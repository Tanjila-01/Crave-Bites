from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, UserProfileView, CookieTokenObtainPairView, LogoutView,
    UserProfileUpdateView, ChangePasswordView, AddressViewSet, CookieTokenRefreshView,
    GetCSRFTokenView
)

router = DefaultRouter()
router.register(r'addresses', AddressViewSet, basename='address')

urlpatterns = [
    path('csrf/', GetCSRFTokenView.as_view(), name='csrf_token'),
    path('token/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', UserProfileView.as_view(), name='user_profile'),
    path('me/update/', UserProfileUpdateView.as_view(), name='user_profile_update'),
    path('me/change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('', include(router.urls)),
]
