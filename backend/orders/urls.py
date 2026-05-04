from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, CartViewSet, CreateRazorpayOrderView, VerifyPaymentView

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'cart', CartViewSet, basename='cart')

urlpatterns = [
    path('', include(router.urls)),
    path('payment/create/', CreateRazorpayOrderView.as_view(), name='payment_create'),
    path('payment/verify/', VerifyPaymentView.as_view(), name='payment_verify'),
]
