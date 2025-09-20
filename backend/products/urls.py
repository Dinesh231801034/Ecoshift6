from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'subcategories', views.SubcategoryViewSet, basename='subcategory')
router.register(r'brands', views.BrandViewSet, basename='brand')
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'reviews', views.ProductReviewViewSet, basename='product-review')
router.register(r'recommendations', views.ProductRecommendationViewSet, basename='product-recommendation')

urlpatterns = [
    path('', include(router.urls)),
    path('search/', views.product_search, name='product_search'),
    path('featured/', views.featured_products, name='featured_products'),
    path('trending/', views.trending_products, name='trending_products'),
]

