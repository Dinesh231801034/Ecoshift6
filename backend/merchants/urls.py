from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'profile', views.MerchantProfileViewSet, basename='merchant-profile')
router.register(r'products', views.MerchantProductViewSet, basename='merchant-product')
router.register(r'orders', views.MerchantOrderViewSet, basename='merchant-order')
router.register(r'analytics', views.MerchantAnalyticsViewSet, basename='merchant-analytics')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', views.merchant_dashboard, name='merchant_dashboard'),
    path('analytics/sales/', views.sales_analytics, name='sales_analytics'),
    path('analytics/products/', views.product_analytics, name='product_analytics'),
    path('profile/update/', views.update_merchant_profile, name='update_merchant_profile'),
]

