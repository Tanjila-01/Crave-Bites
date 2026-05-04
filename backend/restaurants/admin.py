from django.contrib import admin
from .models import Restaurant, MenuItem, Category


class MenuItemInline(admin.TabularInline):
    """Inline admin for MenuItem model"""
    model = MenuItem
    extra = 1
    fields = ['name', 'price', 'is_veg', 'is_available', 'category']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin for Category model"""
    list_display = ['name', 'items_count']
    search_fields = ['name']
    readonly_fields = ['items_count']
    
    def items_count(self, obj):
        return obj.items.count()
    items_count.short_description = 'Number of Items'


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    """Admin for Restaurant model"""
    list_display = ['name', 'rating', 'delivery_time', 'min_order', 'is_open', 'items_count']
    list_filter = ['is_open', 'rating']
    search_fields = ['name', 'tags', 'description']
    readonly_fields = ['items_count']
    inlines = [MenuItemInline]
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description')
        }),
        ('Contact & Location', {
            'fields': ('phone_number', 'address')
        }),
        ('Rating & Delivery', {
            'fields': ('rating', 'delivery_time')
        }),
        ('Order Details', {
            'fields': ('min_order', 'cost_for_two')
        }),
        ('Classification', {
            'fields': ('tags',)
        }),
        ('Media', {
            'fields': ('image_url',)
        }),
        ('Status', {
            'fields': ('is_open',)
        }),
    )
    
    def items_count(self, obj):
        return obj.menu_items.count()
    items_count.short_description = 'Menu Items'


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    """Admin for MenuItem model"""
    list_display = ['name', 'restaurant', 'category', 'price', 'is_veg', 'is_available']
    list_filter = ['is_veg', 'is_available', 'category', 'restaurant']
    search_fields = ['name', 'description', 'restaurant__name']
    fieldsets = (
        ('Basic Information', {
            'fields': ('restaurant', 'name', 'description')
        }),
        ('Pricing', {
            'fields': ('price',)
        }),
        ('Classification', {
            'fields': ('category', 'is_veg')
        }),
        ('Media', {
            'fields': ('image_url',)
        }),
        ('Status', {
            'fields': ('is_available',)
        }),
    )
