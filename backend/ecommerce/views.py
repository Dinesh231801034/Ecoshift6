from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone
from django.contrib.auth import get_user_model
import uuid

from .models import (
    Category, Brand, Product, ProductImage, ProductVariant, 
    ProductReview, Coupon, Payment, ShippingMethod, OrderTracking, EcoImpact
)
from .serializers import (
    CategorySerializer, BrandSerializer, ProductListSerializer, ProductDetailSerializer,
    ProductReviewSerializer, CartSerializer, AddToCartSerializer, UpdateCartItemSerializer,
    CustomerOrderSerializer, CreateOrderSerializer, CouponSerializer, ApplyCouponSerializer,
    PaymentSerializer, ShippingMethodSerializer, OrderTrackingSerializer, EcoImpactSerializer,
    WishlistItemSerializer, AddToWishlistSerializer
)
from customers.models import Cart, CartItem, CustomerProfile, CustomerOrder, OrderItem, CustomerWishlist

User = get_user_model()


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.filter(is_active=True)
    serializer_class = BrandSerializer
    permission_classes = [permissions.AllowAny]


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True).select_related('category', 'brand').prefetch_related('images', 'reviews')
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__slug=category)
        
        # Filter by brand
        brand = self.request.query_params.get('brand')
        if brand:
            queryset = queryset.filter(brand__slug=brand)
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Filter by eco attributes
        eco_rating = self.request.query_params.get('eco_rating')
        if eco_rating:
            queryset = queryset.filter(eco_rating__gte=eco_rating)
        
        is_organic = self.request.query_params.get('is_organic')
        if is_organic == 'true':
            queryset = queryset.filter(is_organic=True)
        
        is_plastic_free = self.request.query_params.get('is_plastic_free')
        if is_plastic_free == 'true':
            queryset = queryset.filter(is_plastic_free=True)
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        # Sort
        sort = self.request.query_params.get('sort')
        if sort == 'price_asc':
            queryset = queryset.order_by('price')
        elif sort == 'price_desc':
            queryset = queryset.order_by('-price')
        elif sort == 'eco_rating':
            queryset = queryset.order_by('-eco_rating')
        elif sort == 'newest':
            queryset = queryset.order_by('-created_at')
        elif sort == 'popular':
            queryset = queryset.order_by('-reviews__rating')
        
        return queryset
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_review(self, request, pk=None):
        product = self.get_object()
        serializer = ProductReviewSerializer(data=request.data)
        
        if serializer.is_valid():
            # Check if user already reviewed this product
            if ProductReview.objects.filter(product=product, user=request.user).exists():
                return Response(
                    {'error': 'You have already reviewed this product'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            serializer.save(product=product, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        customer_profile = get_object_or_404(CustomerProfile, user=self.request.user)
        cart, created = Cart.objects.get_or_create(customer=customer_profile)
        return Cart.objects.filter(customer=customer_profile)
    
    def list(self, request, *args, **kwargs):
        customer_profile = get_object_or_404(CustomerProfile, user=request.user)
        cart, created = Cart.objects.get_or_create(customer=customer_profile)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_item(self, request):
        serializer = AddToCartSerializer(data=request.data)
        if serializer.is_valid():
            customer_profile = get_object_or_404(CustomerProfile, user=request.user)
            cart, created = Cart.objects.get_or_create(customer=customer_profile)
            
            product_id = serializer.validated_data['product_id']
            quantity = serializer.validated_data['quantity']
            
            try:
                product = Product.objects.get(id=product_id, is_active=True)
            except Product.DoesNotExist:
                return Response(
                    {'error': 'Product not found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Check stock
            if product.track_inventory and product.stock_quantity < quantity:
                return Response(
                    {'error': 'Insufficient stock'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Add or update cart item
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product_id=product_id,
                defaults={
                    'product_name': product.name,
                    'product_image': product.images.filter(is_primary=True).first().image.url if product.images.filter(is_primary=True).exists() else '',
                    'product_price': product.price,
                    'quantity': quantity
                }
            )
            
            if not created:
                cart_item.quantity += quantity
                cart_item.save()
            
            return Response({'message': 'Item added to cart'}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)