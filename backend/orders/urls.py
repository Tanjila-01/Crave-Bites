from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, CartAPIView, CreateRazorpayOrderView, VerifyPaymentView

router = DefaultRouter()
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('cart/', CartAPIView.as_view(), name='user-cart'),
    path('payment/create/', CreateRazorpayOrderView.as_view(), name='payment-create'),
    path('payment/verify/', VerifyPaymentView.as_view(), name='payment-verify'),
    path('', include(router.urls)),
]
