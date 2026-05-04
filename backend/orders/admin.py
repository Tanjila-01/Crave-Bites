from django.contrib import admin
from django.utils.html import format_html
from .models import Order, OrderItem, Cart, CartItem


class OrderItemInline(admin.TabularInline):
    """Inline admin for OrderItem model"""
    model = OrderItem
    extra = 0
    readonly_fields = ['menu_item', 'quantity', 'price', 'subtotal']
    fields = ['menu_item', 'quantity', 'price', 'subtotal']
    can_delete = False
    
    def subtotal(self, obj):
        return obj.quantity * obj.price
    subtotal.short_description = 'Subtotal'


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """Admin for Order model"""
    list_display = ['order_id', 'customer', 'status_badge', 'total_amount', 'payment_status', 'created_at']
    list_filter = ['status', 'is_paid', 'created_at']
    search_fields = ['user_name', 'user_address', 'razorpay_order_id']
    readonly_fields = ['created_at', 'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature']
    inlines = [OrderItemInline]
    fieldsets = (
        ('Order Information', {
            'fields': ('user', 'user_name', 'user_address')
        }),
        ('Order Details', {
            'fields': ('status', 'total_amount', 'created_at')
        }),
        ('Payment Information', {
            'fields': ('is_paid', 'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature')
        }),
    )
    
    def order_id(self, obj):
        return f"#{obj.id}"
    order_id.short_description = 'Order ID'
    
    def customer(self, obj):
        return obj.user_name
    customer.short_description = 'Customer'
    
    def status_badge(self, obj):
        colors = {
            'pending': 'ff9999',
            'preparing': 'ffcc99',
            'out_for_delivery': '99ccff',
            'delivered': '99ff99',
        }
        color = colors.get(obj.status, 'cccccc')
        return format_html(
            '<span style="background-color: #{}; padding: 5px 10px; border-radius: 3px; color: black;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def payment_status(self, obj):
        color = '99ff99' if obj.is_paid else 'ff9999'
        status_text = 'Paid' if obj.is_paid else 'Unpaid'
        return format_html(
            '<span style="background-color: #{}; padding: 5px 10px; border-radius: 3px; color: black;">{}</span>',
            color,
            status_text
        )
    payment_status.short_description = 'Payment'


class CartItemInline(admin.TabularInline):
    """Inline admin for CartItem model"""
    model = CartItem
    extra = 0
    readonly_fields = ['menu_item', 'quantity', 'subtotal']
    fields = ['menu_item', 'quantity', 'subtotal']
    
    def subtotal(self, obj):
        return obj.quantity * obj.menu_item.price
    subtotal.short_description = 'Subtotal'


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    """Admin for Cart model"""
    list_display = ['user', 'items_count', 'total_amount', 'updated_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [CartItemInline]
    fieldsets = (
        ('Cart Information', {
            'fields': ('user',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def items_count(self, obj):
        return obj.items.count()
    items_count.short_description = 'Items'
    
    def total_amount(self, obj):
        total = sum(item.quantity * item.menu_item.price for item in obj.items.all())
        return f"₹{total:.2f}"
    total_amount.short_description = 'Total Amount'
