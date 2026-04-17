from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer

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
        user_name = request.data.get('user_name', 'Guest')
        user_address = request.data.get('user_address', 'Unknown')
        items = request.data.get('items', [])
        
        if not items:
            return Response({'error': 'No items in order'}, status=status.HTTP_400_BAD_REQUEST)
        
        order = Order.objects.create(
            user=request.user if request.user.is_authenticated else None,
            user_name=user_name, 
            user_address=user_address
        )
        total_amount = 0
        
        for item in items:
            menu_item_id = item.get('menu_item_id')
            quantity = item.get('quantity', 1)
            price = item.get('price', 0)
            
            OrderItem.objects.create(
                order=order,
                menu_item_id=menu_item_id,
                quantity=quantity,
                price=price
            )
            total_amount += (float(price) * int(quantity))
            
        order.total_amount = total_amount
        order.save()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
