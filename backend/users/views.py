import logging
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.db import transaction
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings
from .models import UserProfile, Address
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer, UserProfileSerializer,
    AddressSerializer, ChangePasswordSerializer
)
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

logger = logging.getLogger(__name__)


from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFTokenView(APIView):
    """Endpoint to set CSRF cookie for the frontend"""
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def get(self, request):
        return Response({'success': 'CSRF cookie set'})

@method_decorator(csrf_exempt, name='dispatch')
class CookieTokenObtainPairView(TokenObtainPairView):
    """Custom token view that sets tokens as HTTP-only cookies"""
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            if response.status_code == 200:
                access_token = response.data.get('access')
                refresh_token = response.data.get('refresh')
                
                # Set cookies securely
                response.set_cookie(
                    'access_token',
                    access_token,
                    max_age=3600,  # 1 hour
                    httponly=True,
                    samesite='Lax',
                    secure=not settings.DEBUG
                )
                response.set_cookie(
                    'refresh_token',
                    refresh_token,
                    max_age=3600 * 24 * 7,  # 7 days
                    httponly=True,
                    samesite='Lax',
                    secure=not settings.DEBUG
                )
                
                # Remove tokens from response body for security
                del response.data['access']
                del response.data['refresh']
                response.data['message'] = 'Authentication successful'
            
            logger.info(f"User login successful: {request.data.get('username')}")
            return response
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return Response(
                {'error': 'Authentication failed'},
                status=status.HTTP_400_BAD_REQUEST
            )


@method_decorator(csrf_exempt, name='dispatch')
class CookieTokenRefreshView(APIView):
    """Custom token refresh view that reads from and sets cookies"""
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response({'error': 'Refresh token missing'}, status=status.HTTP_401_UNAUTHORIZED)
            
        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            
            response = Response({'message': 'Token refreshed successfully'}, status=status.HTTP_200_OK)
            response.set_cookie(
                'access_token',
                access_token,
                max_age=3600,
                httponly=True,
                samesite='Lax',
                secure=not settings.DEBUG
            )
            return response
        except (InvalidToken, TokenError) as e:
            return Response({'error': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)


@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    """User registration view"""
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    user = serializer.save()
                    refresh = RefreshToken.for_user(user)
                    
                    response = Response({
                        'message': 'Registration successful',
                        'user': {
                            'id': user.id,
                            'username': user.username,
                            'email': user.email
                        }
                    }, status=status.HTTP_201_CREATED)
                    
                    # Set cookies upon registration
                    response.set_cookie(
                        'access_token',
                        str(refresh.access_token),
                        max_age=3600,
                        httponly=True,
                        samesite='Lax',
                        secure=not settings.DEBUG
                    )
                    response.set_cookie(
                        'refresh_token',
                        str(refresh),
                        max_age=3600 * 24 * 7,
                        httponly=True,
                        samesite='Lax',
                        secure=not settings.DEBUG
                    )
                    
                    logger.info(f"New user registered: {user.username}")
                    return response
            except Exception as e:
                logger.error(f"Registration error: {str(e)}")
                return Response(
                    {'error': 'Registration failed'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """User logout view"""
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def post(self, request):
        response = Response(
            {'message': 'Logged out successfully'},
            status=status.HTTP_200_OK
        )
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        if request.user.is_authenticated:
            logger.info(f"User logout: {request.user.username}")
        else:
            logger.info("Anonymous user or invalid token logout.")
        return response


@method_decorator(ensure_csrf_cookie, name='dispatch')
class UserProfileView(APIView):
    """Get authenticated user's profile"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = request.user.profile
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class UserProfileUpdateView(APIView):
    """Update user profile"""
    permission_classes = [IsAuthenticated]

    def put(self, request):
        try:
            profile = request.user.profile
            serializer = UserProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                logger.info(f"User profile updated: {request.user.username}")
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class ChangePasswordView(APIView):
    """Change user password"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.data['old_password']):
                return Response(
                    {'error': 'Old password is incorrect'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user.set_password(serializer.data['new_password'])
            user.save()
            logger.info(f"Password changed for user: {user.username}")
            return Response(
                {'message': 'Password changed successfully'},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddressViewSet(viewsets.ModelViewSet):
    """ViewSet for managing user addresses"""
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        logger.info(f"Address created for user: {self.request.user.username}")
    
    def perform_destroy(self, instance):
        logger.info(f"Address deleted for user: {self.request.user.username}")
        instance.delete()
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def set_default(self, request, pk=None):
        """Set an address as default"""
        address = self.get_object()
        Address.objects.filter(user=request.user).update(is_default=False)
        address.is_default = True
        address.save()
        return Response({'message': 'Address set as default'}, status=status.HTTP_200_OK)
