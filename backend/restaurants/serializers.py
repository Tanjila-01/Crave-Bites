from rest_framework import serializers
from .models import Restaurant, MenuItem, Category


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""
    item_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'image_url', 'item_count']
    
    def get_item_count(self, obj):
        return obj.items.count()


class MenuItemSerializer(serializers.ModelSerializer):
    """Serializer for MenuItem model"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    
    class Meta:
        model = MenuItem
        fields = [
            'id', 'restaurant', 'restaurant_name', 'name', 'description', 'price',
            'is_veg', 'is_available', 'image_url', 'category', 'category_name'
        ]
        read_only_fields = ['id', 'restaurant']
    
    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative.")
        return value


class RestaurantSerializer(serializers.ModelSerializer):
    """Serializer for Restaurant model with nested menu items"""
    menu_items = MenuItemSerializer(many=True, read_only=True)
    menu_items_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'description', 'address', 'phone_number', 'rating',
            'delivery_time', 'min_order', 'cost_for_two', 'tags', 'image_url',
            'is_open', 'menu_items', 'menu_items_count'
        ]
    
    def get_menu_items_count(self, obj):
        return obj.menu_items.count()


class RestaurantDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for Restaurant with all related data"""
    menu_items = MenuItemSerializer(many=True, read_only=True)
    categories = serializers.SerializerMethodField()
    
    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'description', 'address', 'phone_number', 'rating',
            'delivery_time', 'min_order', 'cost_for_two', 'tags', 'image_url',
            'is_open', 'menu_items', 'categories'
        ]
    
    def get_categories(self, obj):
        categories = Category.objects.filter(items__restaurant=obj).distinct()
        return CategorySerializer(categories, many=True).data


class RestaurantListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for restaurant list view"""
    menu_items = MenuItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'description', 'rating', 'delivery_time',
            'min_order', 'cost_for_two', 'tags', 'image_url', 'is_open',
            'menu_items'
        ]
