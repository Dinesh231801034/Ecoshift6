"""
URLs for EcoScore app
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'processes', views.EcoInventProcessViewSet, basename='ecoinvent-process')
router.register(r'ecoscores', views.EcoScoreViewSet, basename='ecoscore')
router.register(r'products-ecoscore', views.ProductEcoScoreViewSet, basename='product-ecoscore')

urlpatterns = [
    path('', include(router.urls)),
    path('gamification/check-achievements/', views.EcoScoreGamificationView.as_view(), name='check-achievements'),
]
