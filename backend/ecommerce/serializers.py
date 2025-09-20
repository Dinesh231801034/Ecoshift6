from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Category, Brand, Product, ProductImage, ProductVariant, 
    ProductReview, Coupon, Payment, ShippingMethod, OrderTracking, EcoImpact
)
from customers.models import Cart, CartItem, CustomerProfile, CustomerOrder, OrderItem, CustomerWishlist

User = get_user_model()


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'sort_order']


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'name', 'sku', 'price', 'stock_quantity', 'is_active']


class ProductReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.first_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = ProductReview
        fields = ['id', 'user_name', 'user_email', 'rating', 'title', 'comment', 
                 'is_verified_purchase', 'created_at']
        read_only_fields = ['user', 'is_verified_purchase']


class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    primary_image = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    discount_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'short_description', 'category_name', 'brand_name',
                 'price', 'compare_price', 'stock_quantity', 'is_in_stock', 'is_low_stock',
                 'eco_rating', 'is_organic', 'is_biodegradable', 'is_recyclable', 'is_plastic_free',
                 'primary_image', 'average_rating', 'review_count', 'discount_percentage',
                 'is_featured', 'created_at']
    
    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return self.context['request'].build_absolute_uri(primary_image.image.url)
        return None
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.filter(is_approved=True)
        if reviews.exists():
            return round(sum(review.rating for review in reviews) / reviews.count(), 1)
        return 0
    
    def get_review_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()


class ProductDetailSerializer(ProductListSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)
    
    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + [
            'description', 'sku', 'images', 'variants', 'reviews',
            'carbon_footprint', 'meta_title', 'meta_description'
        ]


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product_name', read_only=True)
    product_image = serializers.CharField(source='product_image', read_only=True)
    total_price = serializers.ReadOnlyField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'product_id', 'product_name', 'product_image', 
                 'product_price', 'quantity', 'total_price', 'created_at']
    
    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0")
        return value


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.ReadOnlyField()
    total_amount = serializers.ReadOnlyField()
    
    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_items', 'total_amount', 'created_at', 'updated_at']


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.CharField()
    quantity = serializers.IntegerField(min_value=1, default=1)
    
    def validate_product_id(self, value):
        try:
            product = Product.objects.get(id=value, is_active=True)
            if not product.is_in_stock:
                raise serializers.ValidationError("Product is out of stock")
            return value
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product not found")


class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)
    
    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0")
        return value


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_id', 'product_name', 'product_image', 
                 'quantity', 'unit_price', 'total_price']


class CustomerOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.user.first_name', read_only=True)
    customer_email = serializers.CharField(source='customer.user.email', read_only=True)
    
    class Meta:
        model = CustomerOrder
        fields = ['id', 'order_number', 'customer_name', 'customer_email',
                 'total_amount', 'shipping_cost', 'tax_amount', 'discount_amount',
                 'order_status', 'payment_status', 'payment_method',
                 'items', 'created_at', 'updated_at']
        read_only_fields = ['order_number', 'customer', 'total_amount']


class CreateOrderSerializer(serializers.Serializer):
    shipping_address_id = serializers.IntegerField()
    payment_method = serializers.CharField()
    coupon_code = serializers.CharField(required=False, allow_blank=True)
    
    def validate_shipping_address_id(self, value):
        try:
            from customers.models import CustomerAddress
            CustomerAddress.objects.get(id=value)
            return value
        except CustomerAddress.DoesNotExist:
            raise serializers.ValidationError("Shipping address not found")
    
    def validate_payment_method(self, value):
        valid_methods = ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'cod']
        if value not in valid_methods:
            raise serializers.ValidationError("Invalid payment method")
        return value


class CouponSerializer(serializers.ModelSerializer):
    is_valid = serializers.ReadOnlyField()
    
    class Meta:
        model = Coupon
        fields = ['id', 'code', 'description', 'coupon_type', 'value', 
                 'minimum_amount', 'maximum_discount', 'usage_limit', 'used_count',
                 'valid_from', 'valid_until', 'is_valid']


class ApplyCouponSerializer(serializers.Serializer):
    code = serializers.CharField()
    
    def validate_code(self, value):
        try:
            coupon = Coupon.objects.get(code=value)
            if not coupon.is_valid:
                raise serializers.ValidationError("Coupon is not valid")
            return value
        except Coupon.DoesNotExist:
            raise serializers.ValidationError("Invalid coupon code")


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'payment_id', 'amount', 'payment_method', 'payment_status',
                 'gateway_transaction_id', 'created_at', 'paid_at']


class ShippingMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingMethod
        fields = '__all__'


class OrderTrackingSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderTracking
        fields = ['id', 'status', 'description', 'location', 'timestamp']


class EcoImpactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EcoImpact
        fields = ['id', 'co2_saved', 'plastic_avoided', 'water_saved', 'trees_planted', 'created_at']


class WishlistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerWishlist
        fields = ['id', 'product_id', 'product_name', 'product_image', 'product_price', 'created_at']


class AddToWishlistSerializer(serializers.Serializer):
    product_id = serializers.CharField()
    
    def validate_product_id(self, value):
        try:
            Product.objects.get(id=value, is_active=True)
            return value
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product not found")
