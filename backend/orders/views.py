import logging
from decimal import Decimal
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.conf import settings
from .models import Order, OrderItem, Cart, CartItem
from .serializers import OrderSerializer, CartSerializer, CartItemSerializer
from restaurants.models import MenuItem
import razorpay

logger = logging.getLogger(__name__)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet for Order model"""
    serializer_class = OrderSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'total_amount', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        """Return orders only for the current user with optimized queries"""
        return Order.objects.filter(user=self.request.user).prefetch_related(
            'items__menu_item__restaurant'
        ).order_by('-created_at')

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def place_order(self, request):
        """Create order from cart"""
        user_name = request.data.get('user_name', request.user.get_full_name() or request.user.username)
        user_address = request.data.get('user_address')
        
        if not user_address:
            return Response(
                {'error': 'user_address is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            cart = Cart.objects.prefetch_related('items__menu_item__restaurant').get(user=request.user)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)
        
        cart_items = cart.items.all()
        if not cart_items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate all restaurants are open
        restaurants_set = set()
        for item in cart_items:
            restaurants_set.add(item.menu_item.restaurant)
            if not item.menu_item.restaurant.is_open:
                return Response(
                    {'error': f'{item.menu_item.restaurant.name} is currently closed'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if not item.menu_item.is_available:
                return Response(
                    {'error': f'{item.menu_item.name} is currently unavailable'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Check minimum order value
        total_amount = Decimal('0')
        for item in cart_items:
            total_amount += Decimal(str(item.menu_item.price)) * item.quantity
        
        try:
            with transaction.atomic():
                order = Order.objects.create(
                    user=request.user,
                    user_name=user_name,
                    user_address=user_address,
                    total_amount=total_amount
                )
                
                # Create order items
                for item in cart_items:
                    OrderItem.objects.create(
                        order=order,
                        menu_item=item.menu_item,
                        quantity=item.quantity,
                        price=item.menu_item.price
                    )
                
                # Clear cart
                cart.items.all().delete()
                
                logger.info(f"Order created: {order.id} for user {request.user.username}")
                serializer = self.get_serializer(order)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error creating order: {str(e)}")
            return Response(
                {'error': 'Failed to create order'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def cancel_order(self, request, pk=None):
        """Cancel an order"""
        order = self.get_object()
        
        if order.user != request.user:
            return Response(
                {'error': 'You cannot cancel this order'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if order.status in ['delivered', 'cancelled']:
            return Response(
                {'error': f'Cannot cancel order with status {order.status}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = 'cancelled'
        order.save()
        logger.info(f"Order {order.id} cancelled by user {request.user.username}")
        return Response(
            {'message': 'Order cancelled successfully'},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def recent_orders(self, request):
        """Get user's recent orders"""
        orders = self.get_queryset()[:5]
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)


class CartViewSet(viewsets.ViewSet):
    """ViewSet for Cart operations"""
    permission_classes = [IsAuthenticated]

    def _get_cart(self, user):
        """Get or create cart for user and prefetch items"""
        cart, created = Cart.objects.get_or_create(user=user)
        return Cart.objects.prefetch_related('items__menu_item__restaurant').get(id=cart.id)

    def list(self, request):
        """Get user's cart"""
        cart = self._get_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def add_item(self, request):
        """Add item to cart"""
        menu_item_id = request.data.get('menu_item_id')
        quantity = request.data.get('quantity', 1)
        
        if not menu_item_id:
            return Response(
                {'error': 'menu_item_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            quantity = int(quantity)
            if quantity < 1:
                raise ValueError
        except (ValueError, TypeError):
            return Response(
                {'error': 'quantity must be a positive integer'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            menu_item = MenuItem.objects.get(id=menu_item_id, is_available=True)
        except MenuItem.DoesNotExist:
            return Response(
                {'error': 'MenuItem not found or unavailable'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        cart = self._get_cart(request.user)
        
        try:
            with transaction.atomic():
                cart_item, created = CartItem.objects.get_or_create(
                    cart=cart,
                    menu_item=menu_item,
                    defaults={'quantity': quantity}
                )
                if not created:
                    cart_item.quantity += quantity
                    cart_item.save()
                
                logger.info(f"Item {menu_item_id} added to cart for user {request.user.username}")
                serializer = CartSerializer(cart)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error adding item to cart: {str(e)}")
            return Response(
                {'error': 'Failed to add item to cart'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def update_item(self, request):
        """Update cart item quantity"""
        cart_item_id = request.data.get('cart_item_id')
        quantity = request.data.get('quantity')
        
        if not cart_item_id or quantity is None:
            return Response(
                {'error': 'cart_item_id and quantity are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            quantity = int(quantity)
            if quantity < 1:
                raise ValueError
        except (ValueError, TypeError):
            return Response(
                {'error': 'quantity must be a positive integer'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            cart = self._get_cart(request.user)
            cart_item = CartItem.objects.get(id=cart_item_id, cart=cart)
            cart_item.quantity = quantity
            cart_item.save()
            logger.info(f"Cart item {cart_item_id} updated for user {request.user.username}")
            serializer = CartSerializer(cart)
            return Response(serializer.data)
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'CartItem not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def remove_item(self, request):
        """Remove item from cart"""
        cart_item_id = request.data.get('cart_item_id')
        
        if not cart_item_id:
            return Response(
                {'error': 'cart_item_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            cart = self._get_cart(request.user)
            cart_item = CartItem.objects.get(id=cart_item_id, cart=cart)
            cart_item.delete()
            logger.info(f"Cart item {cart_item_id} removed for user {request.user.username}")
            serializer = CartSerializer(cart)
            return Response(serializer.data)
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'CartItem not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def clear_cart(self, request):
        """Clear entire cart"""
        try:
            cart = self._get_cart(request.user)
            cart.items.all().delete()
            logger.info(f"Cart cleared for user {request.user.username}")
            return Response(
                {'message': 'Cart cleared successfully'},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Error clearing cart: {str(e)}")
            return Response(
                {'error': 'Failed to clear cart'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CreateRazorpayOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        if not order_id:
            return Response({"error": "order_id is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        order = get_object_or_404(Order, id=order_id, user=request.user)
        
        # Initialize Razorpay Client
        if settings.RAZORPAY_KEY_ID == "rzp_test_YourKeyIdHere" or not settings.RAZORPAY_KEY_ID:
            logger.warning("Using dummy Razorpay keys. Simulating Razorpay order creation.")
            amount_in_paise = int(order.total_amount * 100)
            order.razorpay_order_id = f"fake_order_{order.id}"
            order.save()
            return Response({
                "order_id": order.id,
                "razorpay_order_id": order.razorpay_order_id,
                "amount": amount_in_paise, 
                "currency": "INR",
                "key_id": "fake_key_id"
            }, status=status.HTTP_201_CREATED)
            
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
            if str(razorpay_order_id).startswith("fake_order_"):
                logger.warning("Simulating Razorpay payment verification for dummy order.")
            else:
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
