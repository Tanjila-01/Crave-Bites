from rest_framework import serializers
from decimal import Decimal
from .models import Order, OrderItem, Cart, CartItem
from restaurants.serializers import MenuItemSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for OrderItem model"""
    menu_item_detail = MenuItemSerializer(source='menu_item', read_only=True)
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'menu_item', 'menu_item_detail', 'quantity', 'price', 'subtotal']
        read_only_fields = ['id', 'order', 'price']
    
    def get_subtotal(self, obj):
        return obj.quantity * obj.price
    
    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1.")
        if value > 100:
            raise serializers.ValidationError("Quantity cannot exceed 100.")
        return value


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order model"""
    items = OrderItemSerializer(many=True, read_only=True)
    user_details = serializers.StringRelatedField(source='user', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'user', 'user_details', 'user_name', 'user_address', 'total_amount',
            'status', 'is_paid', 'razorpay_order_id', 'razorpay_payment_id',
            'created_at', 'items'
        ]
        read_only_fields = ['id', 'created_at', 'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature']
    
    def validate_total_amount(self, value):
        if value < 0:
            raise serializers.ValidationError("Total amount cannot be negative.")
        return value


class CreateOrderSerializer(serializers.ModelSerializer):
    """Serializer for creating orders from cart"""
    items_data = serializers.ListField(child=serializers.DictField(), write_only=True, required=True)
    
    class Meta:
        model = Order
        fields = ['user_name', 'user_address', 'items_data']


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for CartItem model"""
    menu_item_detail = MenuItemSerializer(source='menu_item', read_only=True)
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'menu_item', 'menu_item_detail', 'quantity', 'subtotal']
        read_only_fields = ['id', 'cart']
    
    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1.")
        if value > 100:
            raise serializers.ValidationError("Quantity cannot exceed 100.")
        return value
    
    def get_subtotal(self, obj):
        return obj.quantity * obj.menu_item.price


class CartSerializer(serializers.ModelSerializer):
    """Serializer for Cart model"""
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_items', 'total_amount', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def get_total_items(self, obj):
        """Get total number of items in cart"""
        return sum(item.quantity for item in obj.items.all())

    def get_total_amount(self, obj):
        """Get total amount of cart"""
        return sum(Decimal(item.quantity) * item.menu_item.price for item in obj.items.all())
