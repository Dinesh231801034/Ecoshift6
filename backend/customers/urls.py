from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'profile', views.CustomerProfileViewSet, basename='customer-profile')
router.register(r'addresses', views.CustomerAddressViewSet, basename='customer-address')
router.register(r'orders', views.CustomerOrderViewSet, basename='customer-order')
router.register(r'wishlist', views.CustomerWishlistViewSet, basename='customer-wishlist')
router.register(r'reviews', views.CustomerReviewViewSet, basename='customer-review')
router.register(r'recommendations', views.CustomerRecommendationViewSet, basename='customer-recommendation')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', views.customer_dashboard, name='customer_dashboard'),
    path('products/browse/', views.browse_products, name='browse_products'),
    path('products/categories/', views.get_categories, name='get_categories'),
    path('recommendations/', views.get_recommendations, name='get_recommendations'),
    path('recommendations/mark-viewed/', views.mark_recommendation_viewed, name='mark_recommendation_viewed'),
    path('eco-interests/', views.get_eco_interests, name='get_eco_interests'),
]

