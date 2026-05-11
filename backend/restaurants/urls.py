from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RestaurantViewSet, MenuItemViewSet, CategoryViewSet, SeedView

router = DefaultRouter()
router.register(r'restaurants', RestaurantViewSet)
router.register(r'menu-items', MenuItemViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'seed', SeedView, basename='seed')

urlpatterns = [
    path('', include(router.urls)),
]
