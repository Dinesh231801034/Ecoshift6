from rest_framework import serializers
from .models import (
    CustomerProfile, CustomerAddress, CustomerOrder, OrderItem,
    CustomerWishlist, CustomerReview, CustomerRecommendation
)


class CustomerProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for customer profiles
    """
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_first_name = serializers.CharField(source='user.first_name', read_only=True)
    user_last_name = serializers.CharField(source='user.last_name', read_only=True)
    
    class Meta:
        model = CustomerProfile
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')


class CustomerAddressSerializer(serializers.ModelSerializer):
    """
    Serializer for customer addresses
    """
    class Meta:
        model = CustomerAddress
        fields = '__all__'
        read_only_fields = ('customer', 'created_at', 'updated_at')


class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer for order items
    """
    class Meta:
        model = OrderItem
        fields = '__all__'


class CustomerOrderSerializer(serializers.ModelSerializer):
    """
    Serializer for customer orders
    """
    items = OrderItemSerializer(many=True, read_only=True)
    customer_email = serializers.EmailField(source='customer.user.email', read_only=True)
    
    class Meta:
        model = CustomerOrder
        fields = '__all__'
        read_only_fields = ('customer', 'created_at', 'updated_at')


class CustomerWishlistSerializer(serializers.ModelSerializer):
    """
    Serializer for customer wishlist
    """
    class Meta:
        model = CustomerWishlist
        fields = '__all__'
        read_only_fields = ('customer', 'created_at')


class CustomerReviewSerializer(serializers.ModelSerializer):
    """
    Serializer for customer reviews
    """
    customer_email = serializers.EmailField(source='customer.user.email', read_only=True)
    
    class Meta:
        model = CustomerReview
        fields = '__all__'
        read_only_fields = ('customer', 'created_at', 'updated_at')


class CustomerRecommendationSerializer(serializers.ModelSerializer):
    """
    Serializer for customer recommendations
    """
    class Meta:
        model = CustomerRecommendation
        fields = '__all__'
        read_only_fields = ('customer', 'created_at')

















