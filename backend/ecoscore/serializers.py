"""
Serializers for EcoScore app
"""
from rest_framework import serializers
from .models import (
    EcoInventProcess, ProductEcoMapping, EcoScoreBenchmark, 
    EcoScore, EcoScoreHistory, UserEcoAchievement
)
from products.models import Product
from merchants.models import MerchantProduct


class EcoInventProcessSerializer(serializers.ModelSerializer):
    """Serializer for EcoInventProcess"""
    
    class Meta:
        model = EcoInventProcess
        fields = [
            'id', 'name', 'code', 'category', 'subcategory', 
            'unit', 'description', 'location', 'is_active',
            'created_at', 'updated_at'
        ]


class ProductEcoMappingSerializer(serializers.ModelSerializer):
    """Serializer for ProductEcoMapping"""
    ecoinvent_process = EcoInventProcessSerializer(read_only=True)
    product_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductEcoMapping
        fields = [
            'id', 'product', 'merchant_product', 'ecoinvent_process',
            'mapping_confidence', 'mapping_notes', 'functional_unit',
            'functional_unit_value', 'manual_impact_override',
            'is_manual_override', 'product_name', 'created_at', 'updated_at'
        ]
    
    def get_product_name(self, obj):
        if obj.product:
            return obj.product.name
        elif obj.merchant_product:
            return obj.merchant_product.name
        return None


class EcoScoreBenchmarkSerializer(serializers.ModelSerializer):
    """Serializer for EcoScoreBenchmark"""
    
    class Meta:
        model = EcoScoreBenchmark
        fields = [
            'id', 'category', 'subcategory', 'benchmark_impact',
            'benchmark_unit', 'description', 'source',
            'score_a_min', 'score_b_min', 'score_c_min', 'score_d_min',
            'is_active', 'created_at', 'updated_at'
        ]


class EcoScoreSerializer(serializers.ModelSerializer):
    """Serializer for EcoScore"""
    ecoinvent_process = EcoInventProcessSerializer(read_only=True)
    benchmark = EcoScoreBenchmarkSerializer(read_only=True)
    product_name = serializers.SerializerMethodField()
    score_emoji = serializers.ReadOnlyField()
    score_description = serializers.ReadOnlyField()
    
    class Meta:
        model = EcoScore
        fields = [
            'id', 'product', 'merchant_product', 'score_value', 'score_grade',
            'raw_impact', 'impact_unit', 'normalized_impact', 'lca_method',
            'ecoinvent_process', 'benchmark', 'calculation_date',
            'calculation_version', 'is_manual_override', 'calculation_notes',
            'product_name', 'score_emoji', 'score_description'
        ]
    
    def get_product_name(self, obj):
        if obj.product:
            return obj.product.name
        elif obj.merchant_product:
            return obj.merchant_product.name
        return None


class EcoScoreHistorySerializer(serializers.ModelSerializer):
    """Serializer for EcoScoreHistory"""
    product_name = serializers.SerializerMethodField()
    
    class Meta:
        model = EcoScoreHistory
        fields = [
            'id', 'product', 'merchant_product', 'old_score', 'new_score',
            'old_grade', 'new_grade', 'change_reason', 'change_notes',
            'product_name', 'created_at'
        ]
    
    def get_product_name(self, obj):
        if obj.product:
            return obj.product.name
        elif obj.merchant_product:
            return obj.merchant_product.name
        return None


class UserEcoAchievementSerializer(serializers.ModelSerializer):
    """Serializer for UserEcoAchievement"""
    
    class Meta:
        model = UserEcoAchievement
        fields = [
            'id', 'achievement_type', 'achievement_name', 'description',
            'eco_score_threshold', 'purchase_count_threshold', 'total_co2_saved',
            'is_earned', 'earned_at', 'badge_icon', 'badge_color',
            'created_at', 'updated_at'
        ]


class ProductEcoScoreSummarySerializer(serializers.ModelSerializer):
    """Serializer for product with EcoScore summary"""
    ecoscore = EcoScoreSerializer(source='ecoscores.first', read_only=True)
    ecoscore_value = serializers.ReadOnlyField()
    ecoscore_grade = serializers.ReadOnlyField()
    ecoscore_emoji = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'category', 'brand', 'price',
            'is_eco_friendly', 'eco_certifications', 'sustainability_score',
            'carbon_footprint', 'ecoscore_value', 'ecoscore_grade',
            'ecoscore_last_calculated', 'ecoscore', 'ecoscore_emoji'
        ]
    
    def get_ecoscore_emoji(self, obj):
        if obj.ecoscore_grade:
            emoji_map = {
                'A': '🌱',
                'B': '♻️',
                'C': '⚖️',
                'D': '⚠️',
                'E': '🚨'
            }
            return emoji_map.get(obj.ecoscore_grade, '❓')
        return None


class MerchantProductEcoScoreSummarySerializer(serializers.ModelSerializer):
    """Serializer for merchant product with EcoScore summary"""
    ecoscore = EcoScoreSerializer(source='ecoscores.first', read_only=True)
    ecoscore_value = serializers.ReadOnlyField()
    ecoscore_grade = serializers.ReadOnlyField()
    ecoscore_emoji = serializers.SerializerMethodField()
    
    class Meta:
        model = MerchantProduct
        fields = [
            'id', 'name', 'description', 'category', 'brand', 'price',
            'is_eco_friendly', 'eco_certifications', 'ecoscore_value',
            'ecoscore_grade', 'ecoscore_last_calculated', 'ecoscore', 'ecoscore_emoji'
        ]
    
    def get_ecoscore_emoji(self, obj):
        if obj.ecoscore_grade:
            emoji_map = {
                'A': '🌱',
                'B': '♻️',
                'C': '⚖️',
                'D': '⚠️',
                'E': '🚨'
            }
            return emoji_map.get(obj.ecoscore_grade, '❓')
        return None


class EcoScoreLeaderboardSerializer(serializers.Serializer):
    """Serializer for EcoScore leaderboard"""
    user_id = serializers.IntegerField()
    user_email = serializers.EmailField()
    total_ecoscore = serializers.FloatField()
    average_ecoscore = serializers.FloatField()
    total_purchases = serializers.IntegerField()
    eco_achievements_count = serializers.IntegerField()
    total_co2_saved = serializers.FloatField()
    rank = serializers.IntegerField()


class EcoScoreStatsSerializer(serializers.Serializer):
    """Serializer for EcoScore statistics"""
    total_products = serializers.IntegerField()
    products_with_ecoscore = serializers.IntegerField()
    average_ecoscore = serializers.FloatField()
    grade_distribution = serializers.DictField()
    category_breakdown = serializers.DictField()
    top_performing_categories = serializers.ListField()
    recent_calculations = serializers.IntegerField()
