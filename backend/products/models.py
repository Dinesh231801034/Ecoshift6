from django.db import models
from django.conf import settings


class Category(models.Model):
    """
    Product categories
    """
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='category_images/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['sort_order', 'name']
        verbose_name_plural = 'Categories'
    
    def __str__(self):
        return self.name


class Subcategory(models.Model):
    """
    Product subcategories
    """
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=100)
    slug = models.SlugField()
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['sort_order', 'name']
        unique_together = ['category', 'slug']
        verbose_name_plural = 'Subcategories'
    
    def __str__(self):
        return f"{self.category.name} - {self.name}"


class Brand(models.Model):
    """
    Product brands
    """
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='brand_logos/', blank=True, null=True)
    website = models.URLField(blank=True)
    is_eco_friendly = models.BooleanField(default=True)
    certifications = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name


class Product(models.Model):
    """
    Main product model
    """
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    short_description = models.CharField(max_length=500, blank=True)
    
    # Relationships
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    subcategory = models.ForeignKey(Subcategory, on_delete=models.CASCADE, related_name='products', blank=True, null=True)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='products')
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    discount_percentage = models.PositiveIntegerField(default=0)
    
    # Product Details
    sku = models.CharField(max_length=100, unique=True)
    tags = models.JSONField(default=list, blank=True)
    specifications = models.JSONField(default=dict, blank=True)
    features = models.JSONField(default=list, blank=True)
    
    # Images
    primary_image = models.ImageField(upload_to='product_images/')
    additional_images = models.JSONField(default=list, blank=True)
    
    # Inventory
    stock_quantity = models.PositiveIntegerField(default=0)
    min_order_quantity = models.PositiveIntegerField(default=1)
    max_order_quantity = models.PositiveIntegerField(default=100)
    
    # Eco-friendly attributes
    is_eco_friendly = models.BooleanField(default=True)
    eco_certifications = models.JSONField(default=list, blank=True)
    sustainability_score = models.FloatField(default=0.0)  # 0.0 to 10.0
    carbon_footprint = models.FloatField(blank=True, null=True)  # in kg CO2
    recyclability = models.CharField(max_length=50, blank=True)
    packaging_type = models.CharField(max_length=100, blank=True)
    
    # EcoScore fields
    ecoscore_value = models.FloatField(default=0.0, help_text="EcoScore value (0-100)")
    ecoscore_grade = models.CharField(max_length=1, choices=[
        ('A', 'A - Highly Sustainable'),
        ('B', 'B - Good'),
        ('C', 'C - Average'),
        ('D', 'D - Poor'),
        ('E', 'E - Very Poor'),
    ], blank=True)
    ecoscore_last_calculated = models.DateTimeField(null=True, blank=True)
    ecoscore_calculation_version = models.CharField(max_length=50, default='1.0')
    
    # Shipping
    weight = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    dimensions = models.CharField(max_length=100, blank=True)
    shipping_available = models.BooleanField(default=True)
    free_shipping_threshold = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_bestseller = models.BooleanField(default=False)
    
    # SEO
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    @property
    def is_on_sale(self):
        return self.original_price and self.original_price > self.price
    
    @property
    def savings_amount(self):
        if self.is_on_sale:
            return self.original_price - self.price
        return 0


class ProductReview(models.Model):
    """
    Product reviews
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='product_reviews')
    rating = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 6)])
    title = models.CharField(max_length=200)
    comment = models.TextField()
    is_verified_purchase = models.BooleanField(default=False)
    is_helpful = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['product', 'user']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.product.name} - {self.user.email} - {self.rating} stars"


class ProductImage(models.Model):
    """
    Additional product images
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='product_images/')
    alt_text = models.CharField(max_length=200, blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['sort_order']
    
    def __str__(self):
        return f"{self.product.name} - Image {self.sort_order}"


class ProductVariant(models.Model):
    """
    Product variants (size, color, etc.)
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    variant_name = models.CharField(max_length=100)  # e.g., "Size", "Color"
    variant_value = models.CharField(max_length=100)  # e.g., "Large", "Red"
    sku = models.CharField(max_length=100, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['product', 'variant_name', 'variant_value']
    
    def __str__(self):
        return f"{self.product.name} - {self.variant_name}: {self.variant_value}"


class ProductRecommendation(models.Model):
    """
    Product recommendations based on user behavior
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='product_recommendations')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='recommendations')
    recommendation_type = models.CharField(max_length=50, choices=[
        ('similar', 'Similar Products'),
        ('frequently_bought', 'Frequently Bought Together'),
        ('trending', 'Trending'),
        ('personalized', 'Personalized'),
    ])
    confidence_score = models.FloatField()  # 0.0 to 1.0
    reason = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    is_viewed = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ['user', 'product', 'recommendation_type']
        ordering = ['-confidence_score', '-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.product.name} ({self.recommendation_type})"

















