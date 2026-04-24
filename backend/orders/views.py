from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.conf import settings
import razorpay
import logging
from .models import Order, OrderItem, Cart, CartItem

logger = logging.getLogger('orders')
from .serializers import OrderSerializer, OrderItemSerializer, CartSerializer
from restaurants.models import MenuItem

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Order.objects.filter(user=user).order_by('-created_at')
        return Order.objects.none()

    @action(detail=False, methods=['post'])
    def place_order(self, request):
        user_name = request.data.get('user_name', request.user.username)
        user_address = request.data.get('user_address', 'Unknown')
        
        try:
            cart = Cart.objects.prefetch_related('items__menu_item').get(user=request.user)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
            
        cart_items = cart.items.all()
        if not cart_items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check restaurant constraints
        for item in cart_items:
            if not item.menu_item.restaurant.is_open:
                return Response({'error': f'{item.menu_item.restaurant.name} is currently closed'}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(
            user=request.user,
            user_name=user_name, 
            user_address=user_address,
            total_amount=0 # Will be calculated
        )
        total_amount = 0
        
        for item in cart_items:
            price = item.menu_item.price
            OrderItem.objects.create(
                order=order,
                menu_item=item.menu_item,
                quantity=item.quantity,
                price=price
            )
            total_amount += (float(price) * item.quantity)
            
        order.total_amount = total_amount
        order.save()
        
        logger.info(f"Order created: {order.id} for user {request.user.username}")
        
        # Clear Cart
        cart_items.delete()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_cart(self, user):
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

    def get(self, request):
        cart = self.get_cart(request.user)
        return Response(CartSerializer(cart).data)

    def post(self, request):
        menu_item_id = request.data.get('menu_item_id')
        if not menu_item_id:
            return Response({"error": "menu_item_id is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        quantity = int(request.data.get('quantity', 1))

        menu_item = get_object_or_404(MenuItem, id=menu_item_id)
        if not menu_item.restaurant.is_open:
            return Response({"error": f"{menu_item.restaurant.name} is currently closed."}, status=status.HTTP_400_BAD_REQUEST)

        cart = self.get_cart(request.user)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, menu_item=menu_item)
        
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()
        
        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)

    def put(self, request):
        menu_item_id = request.data.get('menu_item_id')
        if not menu_item_id:
            return Response({"error": "menu_item_id is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        quantity = int(request.data.get('quantity', 1))
        cart = self.get_cart(request.user)

        if quantity <= 0:
            CartItem.objects.filter(cart=cart, menu_item_id=menu_item_id).delete()
        else:
            CartItem.objects.filter(cart=cart, menu_item_id=menu_item_id).update(quantity=quantity)
            
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)

    def delete(self, request):
        menu_item_id = request.query_params.get('menu_item_id') or request.data.get('menu_item_id')
        if not menu_item_id:
            return Response({"error": "menu_item_id is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        cart = self.get_cart(request.user)
        CartItem.objects.filter(cart=cart, menu_item_id=menu_item_id).delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)

class CreateRazorpayOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        if not order_id:
            return Response({"error": "order_id is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        order = get_object_or_404(Order, id=order_id, user=request.user)
        
        # Initialize Razorpay Client
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        
        # Amounts must be in paise (smallest currency unit, logic assumes INR)
        amount_in_paise = int(order.total_amount * 100)
        
        try:
            razorpay_order = client.order.create({
                "amount": amount_in_paise,
                "currency": "INR",
                "payment_capture": "1" # Auto capture
            })
            
            # Save the external reference id
            order.razorpay_order_id = razorpay_order['id']
            order.save()
            
            return Response({
                "order_id": order.id,
                "razorpay_order_id": order.razorpay_order_id,
                "amount": amount_in_paise, 
                "currency": "INR",
                "key_id": settings.RAZORPAY_KEY_ID
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')
        
        if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature]):
            return Response({"error": "Missing payment verification parameters"}, status=status.HTTP_400_BAD_REQUEST)

        order = get_object_or_404(Order, razorpay_order_id=razorpay_order_id, user=request.user)

        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        
        try:
            # SDK will raise SignatureVerificationError if fails
            client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            })
            
            # Payment Verified Successfully
            order.razorpay_payment_id = razorpay_payment_id
            order.razorpay_signature = razorpay_signature
            order.is_paid = True
            order.status = 'preparing'
            order.save()
            
            return Response({"message": "Payment successfully verified."}, status=status.HTTP_200_OK)
            
        except razorpay.errors.SignatureVerificationError:
            logger.error(f"Payment signature failed for order: {order.id}")
            return Response({"error": "Invalid signature. Payment could not be verified."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Payment verification exception for order: {order.id} - {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
