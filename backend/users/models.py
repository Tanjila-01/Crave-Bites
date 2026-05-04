from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator
from django.utils import timezone

class UserProfile(models.Model):
    """Extended user profile with additional information"""
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('restaurant_owner', 'Restaurant Owner'),
        ('delivery_partner', 'Delivery Partner'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    phone_number = models.CharField(
        max_length=15,
        blank=True,
        null=True,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message='Phone number must be between 9 and 15 digits'
            )
        ]
    )
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    pincode = models.CharField(max_length=10, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    avatar_url = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=255, blank=True, null=True)
    verified_at = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['role']),
        ]
    
    def __str__(self):
        return f"{self.user.username}'s profile ({self.role})"
    
    def mark_verified(self):
        """Mark user as verified"""
        self.is_verified = True
        self.verified_at = timezone.now()
        self.verification_token = None
        self.save()


class Address(models.Model):
    """Saved addresses for users"""
    ADDRESS_TYPES = (
        ('home', 'Home'),
        ('work', 'Work'),
        ('other', 'Other'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    label = models.CharField(max_length=20, choices=ADDRESS_TYPES, default='home')
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    latitude = models.FloatField()
    longitude = models.FloatField()
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_default', '-created_at']
        verbose_name_plural = 'Addresses'
    
    def __str__(self):
        return f"{self.label.title()} - {self.user.username}"
    
    def save(self, *args, **kwargs):
        # Ensure only one default address per user
        if self.is_default:
            Address.objects.filter(user=self.user).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)
