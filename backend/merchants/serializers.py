from rest_framework import serializers
from .models import MerchantProfile, MerchantProduct, MerchantOrder, OrderItem, MerchantAnalytics


class MerchantProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for merchant profiles
    """
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_first_name = serializers.CharField(source='user.first_name', read_only=True)
    user_last_name = serializers.CharField(source='user.last_name', read_only=True)
    
    class Meta:
        model = MerchantProfile
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')


class MerchantProductSerializer(serializers.ModelSerializer):
    """
    Serializer for merchant products
    """
    merchant_business_name = serializers.CharField(source='merchant.business_name', read_only=True)
    
    class Meta:
        model = MerchantProduct
        fields = '__all__'
        read_only_fields = ('merchant', 'created_at', 'updated_at')


class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer for order items
    """
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = '__all__'


class MerchantOrderSerializer(serializers.ModelSerializer):
    """
    Serializer for merchant orders
    """
    items = OrderItemSerializer(many=True, read_only=True)
    merchant_business_name = serializers.CharField(source='merchant.business_name', read_only=True)
    
    class Meta:
        model = MerchantOrder
        fields = '__all__'
        read_only_fields = ('merchant', 'created_at', 'updated_at')


class MerchantAnalyticsSerializer(serializers.ModelSerializer):
    """
    Serializer for merchant analytics
    """
    merchant_business_name = serializers.CharField(source='merchant.business_name', read_only=True)
    
    class Meta:
        model = MerchantAnalytics
        fields = '__all__'
        read_only_fields = ('merchant', 'created_at')

















