from django.db import models
from django.conf import settings


class CustomerProfile(models.Model):
    """
    Extended profile for customers
    """
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='customer_profile')
    
    # Personal Information
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=20, choices=[
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
        ('prefer_not_to_say', 'Prefer not to say'),
    ], blank=True)
    
    # Preferences
    eco_interests = models.JSONField(default=list, blank=True)  # List of eco interests
    preferred_categories = models.JSONField(default=list, blank=True)  # Preferred product categories
    budget_range = models.CharField(max_length=20, choices=[
        ('low', 'Low (₹0-500)'),
        ('medium', 'Medium (₹500-2000)'),
        ('high', 'High (₹2000-5000)'),
        ('premium', 'Premium (₹5000+)'),
    ], blank=True)
    
    # Location
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, default='India')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.email}'s Customer Profile"


class CustomerAddress(models.Model):
    """
    Customer shipping addresses
    """
    ADDRESS_TYPE_CHOICES = [
        ('home', 'Home'),
        ('work', 'Work'),
        ('other', 'Other'),
    ]
    
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, related_name='addresses')
    address_type = models.CharField(max_length=10, choices=ADDRESS_TYPE_CHOICES, default='home')
    full_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    address_line_1 = models.CharField(max_length=200)
    address_line_2 = models.CharField(max_length=200, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default='India')
    postal_code = models.CharField(max_length=20)
    is_default = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.full_name} - {self.address_line_1}, {self.city}"


class CustomerOrder(models.Model):
    """
    Customer orders
    """
    ORDER_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
        ('returned', 'Returned'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, related_name='orders')
    order_number = models.CharField(max_length=50, unique=True)
    
    # Order Details
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_cost = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    
    # Shipping Address
    shipping_address = models.ForeignKey(CustomerAddress, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Status
    order_status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=50, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order {self.order_number} - {self.customer.user.email}"


class OrderItem(models.Model):
    """
    Individual items in a customer order
    """
    order = models.ForeignKey(CustomerOrder, on_delete=models.CASCADE, related_name='items')
    product_id = models.CharField(max_length=100)  # Reference to product in products app
    product_name = models.CharField(max_length=200)
    product_image = models.URLField(blank=True)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.product_name} x {self.quantity} - {self.order.order_number}"


class CustomerWishlist(models.Model):
    """
    Customer wishlist
    """
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, related_name='wishlist')
    product_id = models.CharField(max_length=100)  # Reference to product
    product_name = models.CharField(max_length=200)
    product_image = models.URLField(blank=True)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['customer', 'product_id']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.customer.user.email} - {self.product_name}"


class CustomerReview(models.Model):
    """
    Customer product reviews
    """
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, related_name='reviews')
    product_id = models.CharField(max_length=100)  # Reference to product
    order = models.ForeignKey(CustomerOrder, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 6)])
    title = models.CharField(max_length=200)
    comment = models.TextField()
    is_verified_purchase = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['customer', 'product_id', 'order']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.customer.user.email} - {self.product_id} - {self.rating} stars"


class CustomerRecommendation(models.Model):
    """
    Personalized recommendations for customers
    """
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, related_name='recommendations')
    product_id = models.CharField(max_length=100)
    product_name = models.CharField(max_length=200)
    product_image = models.URLField(blank=True)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    recommendation_reason = models.TextField()
    confidence_score = models.FloatField()  # 0.0 to 1.0
    
    created_at = models.DateTimeField(auto_now_add=True)
    is_viewed = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-confidence_score', '-created_at']
    
    def __str__(self):
        return f"{self.customer.user.email} - {self.product_name} ({self.confidence_score:.2f})"


class Cart(models.Model):
    """
    Shopping cart for customers
    """
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Cart for {self.customer.user.email}"
    
    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())
    
    @property
    def total_amount(self):
        return sum(item.total_price for item in self.items.all())


class CartItem(models.Model):
    """
    Individual items in shopping cart
    """
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product_id = models.CharField(max_length=100)  # Reference to product
    product_name = models.CharField(max_length=200)
    product_image = models.URLField(blank=True)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['cart', 'product_id']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.product_name} x {self.quantity} in {self.cart.customer.user.email}'s cart"
    
    @property
    def total_price(self):
        return self.product_price * self.quantity

