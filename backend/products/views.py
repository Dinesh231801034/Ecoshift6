from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q, Avg, Count
from django_filters.rest_framework import DjangoFilterBackend
from .models import (
    Category, Subcategory, Brand, Product, ProductReview, 
    ProductImage, ProductVariant, ProductRecommendation
)
from .serializers import (
    CategorySerializer, SubcategorySerializer, BrandSerializer, ProductSerializer,
    ProductReviewSerializer, ProductImageSerializer, ProductVariantSerializer,
    ProductRecommendationSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for categories (read-only)
    """
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class SubcategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for subcategories (read-only)
    """
    queryset = Subcategory.objects.filter(is_active=True)
    serializer_class = SubcategorySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category']


class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for brands (read-only)
    """
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [permissions.AllowAny]


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for products (read-only)
    """
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'subcategory', 'brand', 'is_eco_friendly', 'is_featured']
    search_fields = ['name', 'description', 'brand__name', 'tags']
    ordering_fields = ['price', 'created_at', 'sustainability_score']
    ordering = ['-created_at']


class ProductReviewViewSet(viewsets.ModelViewSet):
    """
    ViewSet for product reviews
    """
    serializer_class = ProductReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ProductReview.objects.all()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ProductImageViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for product images (read-only)
    """
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [permissions.AllowAny]


class ProductVariantViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for product variants (read-only)
    """
    queryset = ProductVariant.objects.filter(is_active=True)
    serializer_class = ProductVariantSerializer
    permission_classes = [permissions.AllowAny]


class ProductRecommendationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for product recommendations (read-only)
    """
    serializer_class = ProductRecommendationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ProductRecommendation.objects.filter(user=self.request.user)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def product_search(request):
    """
    Advanced product search
    """
    query = request.GET.get('q', '')
    category = request.GET.get('category', '')
    brand = request.GET.get('brand', '')
    min_price = request.GET.get('min_price', '')
    max_price = request.GET.get('max_price', '')
    eco_friendly = request.GET.get('eco_friendly', '')
    sort_by = request.GET.get('sort_by', '-created_at')
    
    queryset = Product.objects.filter(is_active=True)
    
    if query:
        queryset = queryset.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(brand__name__icontains=query) |
            Q(tags__icontains=query)
        )
    
    if category:
        queryset = queryset.filter(category__slug=category)
    
    if brand:
        queryset = queryset.filter(brand__slug=brand)
    
    if min_price:
        queryset = queryset.filter(price__gte=min_price)
    
    if max_price:
        queryset = queryset.filter(price__lte=max_price)
    
    if eco_friendly.lower() == 'true':
        queryset = queryset.filter(is_eco_friendly=True)
    
    queryset = queryset.order_by(sort_by)
    
    serializer = ProductSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def featured_products(request):
    """
    Get featured products
    """
    products = Product.objects.filter(is_active=True, is_featured=True)[:10]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def trending_products(request):
    """
    Get trending products based on reviews and orders
    """
    products = Product.objects.filter(is_active=True).annotate(
        review_count=Count('reviews'),
        avg_rating=Avg('reviews__rating')
    ).filter(
        review_count__gte=1,
        avg_rating__gte=4.0
    ).order_by('-review_count', '-avg_rating')[:10]
    
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

















