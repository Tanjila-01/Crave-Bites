import logging
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Prefetch
from .models import Restaurant, MenuItem, Category
from .serializers import (
    RestaurantSerializer, RestaurantDetailSerializer, RestaurantListSerializer,
    MenuItemSerializer, CategorySerializer
)

logger = logging.getLogger(__name__)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class RestaurantViewSet(viewsets.ModelViewSet):
    """ViewSet for Restaurant model with caching and filtering"""
    queryset = Restaurant.objects.prefetch_related(
        Prefetch('menu_items', queryset=MenuItem.objects.select_related('restaurant', 'category'))
    ).filter(is_open=True)
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_open']
    search_fields = ['name', 'tags', 'description']
    ordering_fields = ['rating', 'min_order', 'delivery_time']
    ordering = ['-rating']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return RestaurantDetailSerializer
        elif self.action == 'list':
            return RestaurantListSerializer
        return RestaurantSerializer
    
    @method_decorator(cache_page(60 * 15))
    def list(self, request, *args, **kwargs):
        """List all restaurants with caching"""
        return super().list(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def top_rated(self, request):
        """Get top-rated restaurants with pagination"""
        queryset = self.queryset.order_by('-rating')
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def fast_delivery(self, request):
        """Get restaurants with fastest delivery with pagination"""
        queryset = self.queryset.order_by('delivery_time')
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_tags(self, request):
        """Filter restaurants by tags with pagination"""
        tag = request.query_params.get('tag')
        if not tag:
            return Response({'error': 'tag parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        queryset = self.queryset.filter(tags__icontains=tag)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class MenuItemViewSet(viewsets.ModelViewSet):
    """ViewSet for MenuItem model with filtering and search"""
    queryset = MenuItem.objects.select_related('restaurant', 'category').filter(is_available=True)
    serializer_class = MenuItemSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['restaurant', 'category', 'is_veg', 'is_available']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'name']
    ordering = ['price']
    
    @action(detail=False, methods=['get'])
    def by_restaurant(self, request):
        """Get menu items by restaurant with pagination"""
        restaurant_id = request.query_params.get('restaurant_id')
        if not restaurant_id:
            return Response(
                {'error': 'restaurant_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        queryset = self.queryset.filter(restaurant_id=restaurant_id)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def vegetarian(self, request):
        """Get all vegetarian items with pagination"""
        queryset = self.queryset.filter(is_veg=True)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def price_range(self, request):
        """Filter items by price range with pagination"""
        min_price = request.query_params.get('min_price', 0)
        max_price = request.query_params.get('max_price', 10000)
        
        try:
            min_price = float(min_price)
            max_price = float(max_price)
        except ValueError:
            return Response(
                {'error': 'min_price and max_price must be numbers'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        queryset = self.queryset.filter(price__gte=min_price, price__lte=max_price)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for Category model"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering = ['name']
    
    @method_decorator(cache_page(60 * 15))
    def list(self, request, *args, **kwargs):
        """List all categories with caching"""
        return super().list(request, *args, **kwargs)
    
    @action(detail=True, methods=['get'])
    def items(self, request, pk=None):
        """Get all items in a category with pagination"""
        category = self.get_object()
        queryset = category.items.filter(is_available=True)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = MenuItemSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = MenuItemSerializer(queryset, many=True)
        return Response(serializer.data)
