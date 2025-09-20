"""
Admin configuration for EcoScore app
"""
from django.contrib import admin
from .models import (
    EcoInventProcess, ProductEcoMapping, EcoScoreBenchmark, 
    EcoScore, EcoScoreHistory, UserEcoAchievement
)


@admin.register(EcoInventProcess)
class EcoInventProcessAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'category', 'subcategory', 'unit', 'is_active']
    list_filter = ['category', 'subcategory', 'is_active']
    search_fields = ['name', 'code', 'category']
    ordering = ['category', 'name']


@admin.register(ProductEcoMapping)
class ProductEcoMappingAdmin(admin.ModelAdmin):
    list_display = ['get_product_name', 'ecoinvent_process', 'mapping_confidence', 'functional_unit', 'is_manual_override']
    list_filter = ['mapping_confidence', 'is_manual_override', 'ecoinvent_process__category']
    search_fields = ['product__name', 'merchant_product__name', 'ecoinvent_process__name']
    
    def get_product_name(self, obj):
        if obj.product:
            return obj.product.name
        elif obj.merchant_product:
            return obj.merchant_product.name
        return 'Unknown'
    get_product_name.short_description = 'Product Name'


@admin.register(EcoScoreBenchmark)
class EcoScoreBenchmarkAdmin(admin.ModelAdmin):
    list_display = ['category', 'subcategory', 'benchmark_impact', 'benchmark_unit', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['category', 'subcategory']


@admin.register(EcoScore)
class EcoScoreAdmin(admin.ModelAdmin):
    list_display = ['get_product_name', 'score_value', 'score_grade', 'raw_impact', 'calculation_date']
    list_filter = ['score_grade', 'calculation_date', 'is_manual_override']
    search_fields = ['product__name', 'merchant_product__name']
    readonly_fields = ['calculation_date']
    
    def get_product_name(self, obj):
        if obj.product:
            return obj.product.name
        elif obj.merchant_product:
            return obj.merchant_product.name
        return 'Unknown'
    get_product_name.short_description = 'Product Name'


@admin.register(EcoScoreHistory)
class EcoScoreHistoryAdmin(admin.ModelAdmin):
    list_display = ['get_product_name', 'old_score', 'new_score', 'old_grade', 'new_grade', 'created_at']
    list_filter = ['old_grade', 'new_grade', 'created_at']
    search_fields = ['product__name', 'merchant_product__name']
    readonly_fields = ['created_at']
    
    def get_product_name(self, obj):
        if obj.product:
            return obj.product.name
        elif obj.merchant_product:
            return obj.merchant_product.name
        return 'Unknown'
    get_product_name.short_description = 'Product Name'


@admin.register(UserEcoAchievement)
class UserEcoAchievementAdmin(admin.ModelAdmin):
    list_display = ['user', 'achievement_name', 'achievement_type', 'is_earned', 'earned_at']
    list_filter = ['achievement_type', 'is_earned', 'earned_at']
    search_fields = ['user__email', 'achievement_name']
    readonly_fields = ['earned_at']