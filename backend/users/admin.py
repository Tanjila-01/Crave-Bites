from django.contrib import admin
from django.contrib.auth.models import User
from .models import UserProfile, Address


class AddressInline(admin.TabularInline):
    """Inline admin for Address model"""
    model = Address
    extra = 1
    fields = ['label', 'street', 'city', 'state', 'pincode', 'is_default']


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Admin for UserProfile model"""
    list_display = ['user', 'role', 'phone_number', 'city', 'is_verified', 'created_at']
    list_filter = ['role', 'is_verified', 'created_at']
    search_fields = ['user__username', 'phone_number', 'city']
    readonly_fields = ['created_at', 'updated_at', 'verified_at']
    fieldsets = (
        ('User', {
            'fields': ('user', 'role')
        }),
        ('Contact Information', {
            'fields': ('phone_number', 'address', 'city', 'pincode')
        }),
        ('Location', {
            'fields': ('latitude', 'longitude'),
            'classes': ('collapse',)
        }),
        ('Personal', {
            'fields': ('avatar_url', 'bio')
        }),
        ('Verification', {
            'fields': ('is_verified', 'verification_token', 'verified_at')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    """Admin for Address model"""
    list_display = ['user', 'label', 'city', 'state', 'is_default', 'created_at']
    list_filter = ['label', 'city', 'is_default']
    search_fields = ['user__username', 'city', 'street']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Address Details', {
            'fields': ('label', 'street', 'city', 'state', 'pincode')
        }),
        ('Location', {
            'fields': ('latitude', 'longitude')
        }),
        ('Settings', {
            'fields': ('is_default',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
