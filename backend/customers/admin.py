from django.contrib import admin
from .models import CustomerProfile, CustomerAddress, CustomerOrder, OrderItem, CustomerWishlist, CustomerReview, CustomerRecommendation


@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'city', 'state', 'budget_range', 'created_at')
    list_filter = ('budget_range', 'country', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'city', 'state')
    raw_id_fields = ('user',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(CustomerAddress)
class CustomerAddressAdmin(admin.ModelAdmin):
    list_display = ('customer', 'full_name', 'address_type', 'city', 'is_default', 'created_at')
    list_filter = ('address_type', 'is_default', 'city', 'state', 'created_at')
    search_fields = ('customer__user__email', 'full_name', 'city', 'state')
    raw_id_fields = ('customer',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(CustomerOrder)
class CustomerOrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'customer', 'total_amount', 'order_status', 'payment_status', 'created_at')
    list_filter = ('order_status', 'payment_status', 'created_at')
    search_fields = ('order_number', 'customer__user__email', 'customer_name', 'customer_email')
    raw_id_fields = ('customer', 'shipping_address')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'order', 'quantity', 'unit_price', 'total_price')
    list_filter = ('order__order_status', 'order__created_at')
    search_fields = ('product_name', 'order__order_number')
    raw_id_fields = ('order',)


@admin.register(CustomerWishlist)
class CustomerWishlistAdmin(admin.ModelAdmin):
    list_display = ('customer', 'product_name', 'product_price', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('customer__user__email', 'product_name')
    raw_id_fields = ('customer',)
    readonly_fields = ('created_at',)


@admin.register(CustomerReview)
class CustomerReviewAdmin(admin.ModelAdmin):
    list_display = ('customer', 'product_id', 'rating', 'title', 'is_verified_purchase', 'created_at')
    list_filter = ('rating', 'is_verified_purchase', 'created_at')
    search_fields = ('customer__user__email', 'product_id', 'title')
    raw_id_fields = ('customer', 'order')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(CustomerRecommendation)
class CustomerRecommendationAdmin(admin.ModelAdmin):
    list_display = ('customer', 'product_name', 'confidence_score', 'is_viewed', 'created_at')
    list_filter = ('is_viewed', 'created_at')
    search_fields = ('customer__user__email', 'product_name')
    raw_id_fields = ('customer',)
    readonly_fields = ('created_at',)

















