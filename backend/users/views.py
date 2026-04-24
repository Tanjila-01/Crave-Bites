from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings

class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')
            
            # Set cookies securely
            response.set_cookie(
                'access_token',
                access_token,
                max_age=3600, # 1 hour
                httponly=True,
                samesite='Lax'
            )
            response.set_cookie(
                'refresh_token',
                refresh_token,
                max_age=3600 * 24 * 7, # 7 days
                httponly=True,
                samesite='Lax'
            )
            
            # Wipe tokens from the response body for security
            del response.data['access']
            del response.data['refresh']
            response.data['message'] = 'Authentication successful'

        return response

class LogoutView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        response = Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')

        if not username or not password:
            return Response({'error': 'Please provide both username and password'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password, email=email)
        
        # Don't directly return the token anymore as we defer to the login view logic, or we set it here too
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
        response.set_cookie('access_token', str(refresh.access_token), max_age=3600, httponly=True, samesite='Lax')
        response.set_cookie('refresh_token', str(refresh), max_age=3600*24*7, httponly=True, samesite='Lax')
        
        return response

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        })
