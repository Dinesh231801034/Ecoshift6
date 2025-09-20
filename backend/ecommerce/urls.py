from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views_extra import OrderViewSet, WishlistViewSet, CouponViewSet, ShippingMethodViewSet, EcoImpactViewSet

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'brands', views.BrandViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'cart', views.CartViewSet, basename='cart')
router.register(r'orders', OrderViewSet, basename='orders')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
router.register(r'coupons', CouponViewSet)
router.register(r'shipping-methods', ShippingMethodViewSet)
router.register(r'eco-impact', EcoImpactViewSet, basename='eco-impact')

urlpatterns = [
    path('', include(router.urls)),
]
