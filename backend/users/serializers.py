from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import UserProfile, Address


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    email = serializers.EmailField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class AddressSerializer(serializers.ModelSerializer):
    """Serializer for Address model"""
    
    class Meta:
        model = Address
        fields = ['id', 'label', 'street', 'city', 'state', 'pincode', 'latitude', 'longitude', 'is_default', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def validate_pincode(self, value):
        if len(value) < 5 or len(value) > 10:
            raise serializers.ValidationError("Pincode must be between 5 and 10 digits")
        return value


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model"""
    user = UserSerializer(read_only=True)
    addresses = AddressSerializer(many=True, read_only=True, source='user.addresses')
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'role', 'phone_number', 'address', 'city', 'pincode',
            'latitude', 'longitude', 'avatar_url', 'bio', 'is_verified',
            'is_active', 'created_at', 'updated_at', 'addresses'
        ]
        read_only_fields = ['id', 'is_verified', 'verification_token', 'verified_at', 'created_at', 'updated_at']
    
    def validate_phone_number(self, value):
        if value and len(value) < 9:
            raise serializers.ValidationError("Phone number must be at least 9 digits")
        return value


class RegisterSerializer(serializers.Serializer):
    """Serializer for user registration"""
    username = serializers.CharField(max_length=150, required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value
    
    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(str(e))
        return value
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return data
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        UserProfile.objects.create(user=user)
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for changing password"""
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, required=True)
    
    def validate_new_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(str(e))
        return value
    
    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return data
