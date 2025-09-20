from django.contrib import admin
from .models import Category, Subcategory, Brand, Product, ProductReview, ProductImage, ProductVariant, ProductRecommendation


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'sort_order', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Subcategory)
class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'slug', 'is_active', 'sort_order', 'created_at')
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('name', 'description', 'category__name')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_eco_friendly', 'created_at')
    list_filter = ('is_eco_friendly', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand', 'category', 'price', 'stock_quantity', 'is_active', 'is_featured', 'created_at')
    list_filter = ('category', 'brand', 'is_active', 'is_featured', 'is_bestseller', 'is_eco_friendly', 'created_at')
    search_fields = ('name', 'description', 'sku', 'brand__name', 'category__name')
    prepopulated_fields = {'slug': ('name',)}
    raw_id_fields = ('brand', 'category', 'subcategory')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'title', 'is_verified_purchase', 'created_at')
    list_filter = ('rating', 'is_verified_purchase', 'created_at')
    search_fields = ('product__name', 'user__email', 'title')
    raw_id_fields = ('product', 'user')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'alt_text', 'sort_order', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('product__name', 'alt_text')
    raw_id_fields = ('product',)
    readonly_fields = ('created_at',)


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ('product', 'variant_name', 'variant_value', 'sku', 'price', 'stock_quantity', 'is_active')
    list_filter = ('variant_name', 'is_active', 'created_at')
    search_fields = ('product__name', 'variant_name', 'variant_value', 'sku')
    raw_id_fields = ('product',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(ProductRecommendation)
class ProductRecommendationAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'recommendation_type', 'confidence_score', 'is_viewed', 'created_at')
    list_filter = ('recommendation_type', 'is_viewed', 'created_at')
    search_fields = ('user__email', 'product__name')
    raw_id_fields = ('user', 'product')
    readonly_fields = ('created_at',)

