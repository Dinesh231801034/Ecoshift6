from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from products.models import Product
from merchants.models import MerchantProduct


class EcoInventProcess(models.Model):
    """
    Ecoinvent database process mapping
    """
    name = models.CharField(max_length=200, unique=True)
    code = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=100)
    subcategory = models.CharField(max_length=100, blank=True)
    unit = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=100, default='GLO')  # Global
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['category', 'name']
        verbose_name = 'Ecoinvent Process'
        verbose_name_plural = 'Ecoinvent Processes'
    
    def __str__(self):
        return f"{self.name} ({self.code})"


class ProductEcoMapping(models.Model):
    """
    Maps products to ecoinvent processes
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='eco_mappings', null=True, blank=True)
    merchant_product = models.ForeignKey(MerchantProduct, on_delete=models.CASCADE, related_name='eco_mappings', null=True, blank=True)
    ecoinvent_process = models.ForeignKey(EcoInventProcess, on_delete=models.CASCADE, related_name='product_mappings')
    
    # Mapping details
    mapping_confidence = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)],
        help_text="Confidence level of the mapping (0.0 to 1.0)"
    )
    mapping_notes = models.TextField(blank=True, help_text="Notes about the mapping decision")
    functional_unit = models.CharField(max_length=100, help_text="e.g., 'per kg', 'per item', 'per use'")
    functional_unit_value = models.FloatField(help_text="Value of the functional unit")
    
    # Manual overrides
    manual_impact_override = models.FloatField(null=True, blank=True, help_text="Manual override for impact value")
    is_manual_override = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = [
            ['product', 'ecoinvent_process'],
            ['merchant_product', 'ecoinvent_process']
        ]
    
    def __str__(self):
        product_name = self.product.name if self.product else self.merchant_product.name
        return f"{product_name} -> {self.ecoinvent_process.name}"


class EcoScoreBenchmark(models.Model):
    """
    Benchmarks for normalizing EcoScores by category
    """
    category = models.CharField(max_length=100, unique=True)
    subcategory = models.CharField(max_length=100, blank=True)
    benchmark_impact = models.FloatField(help_text="Benchmark impact value for normalization")
    benchmark_unit = models.CharField(max_length=50, help_text="Unit of the benchmark")
    description = models.TextField(blank=True)
    source = models.CharField(max_length=200, help_text="Source of the benchmark data")
    
    # Score ranges
    score_a_min = models.FloatField(default=80.0, validators=[MinValueValidator(0.0), MaxValueValidator(100.0)])
    score_b_min = models.FloatField(default=60.0, validators=[MinValueValidator(0.0), MaxValueValidator(100.0)])
    score_c_min = models.FloatField(default=40.0, validators=[MinValueValidator(0.0), MaxValueValidator(100.0)])
    score_d_min = models.FloatField(default=20.0, validators=[MinValueValidator(0.0), MaxValueValidator(100.0)])
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['category', 'subcategory']
    
    def __str__(self):
        return f"{self.category} - {self.subcategory or 'All'} (Benchmark: {self.benchmark_impact} {self.benchmark_unit})"


class EcoScore(models.Model):
    """
    Calculated EcoScore for products
    """
    SCORE_GRADES = [
        ('A', 'A - Highly Sustainable'),
        ('B', 'B - Good'),
        ('C', 'C - Average'),
        ('D', 'D - Poor'),
        ('E', 'E - Very Poor'),
    ]
    
    # Product reference (either Product or MerchantProduct)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='ecoscores', null=True, blank=True)
    merchant_product = models.ForeignKey(MerchantProduct, on_delete=models.CASCADE, related_name='ecoscores', null=True, blank=True)
    
    # EcoScore details
    score_value = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        help_text="EcoScore value (0-100)"
    )
    score_grade = models.CharField(max_length=1, choices=SCORE_GRADES)
    
    # Impact assessment details
    raw_impact = models.FloatField(help_text="Raw environmental impact value")
    impact_unit = models.CharField(max_length=50, help_text="Unit of the impact value")
    normalized_impact = models.FloatField(help_text="Normalized impact value")
    
    # LCA method used
    lca_method = models.CharField(max_length=100, default='IPCC 2013 - climate change - GWP 100a')
    ecoinvent_process = models.ForeignKey(EcoInventProcess, on_delete=models.CASCADE, related_name='ecoscores')
    benchmark = models.ForeignKey(EcoScoreBenchmark, on_delete=models.CASCADE, related_name='ecoscores')
    
    # Calculation metadata
    calculation_date = models.DateTimeField(auto_now_add=True)
    calculation_version = models.CharField(max_length=50, default='1.0')
    is_manual_override = models.BooleanField(default=False)
    calculation_notes = models.TextField(blank=True)
    
    class Meta:
        unique_together = [
            ['product', 'calculation_version'],
            ['merchant_product', 'calculation_version']
        ]
        ordering = ['-calculation_date']
    
    def __str__(self):
        product_name = self.product.name if self.product else self.merchant_product.name
        return f"{product_name} - EcoScore {self.score_grade} ({self.score_value:.1f})"
    
    @property
    def score_emoji(self):
        """Return emoji representation of the score grade"""
        emoji_map = {
            'A': '🌱',
            'B': '♻️',
            'C': '⚖️',
            'D': '⚠️',
            'E': '🚨'
        }
        return emoji_map.get(self.score_grade, '❓')
    
    @property
    def score_description(self):
        """Return human-readable description of the score"""
        descriptions = {
            'A': 'Highly sustainable',
            'B': 'Good environmental impact',
            'C': 'Average environmental impact',
            'D': 'Poor environmental impact',
            'E': 'Very poor environmental impact'
        }
        return descriptions.get(self.score_grade, 'Unknown')


class EcoScoreHistory(models.Model):
    """
    Historical tracking of EcoScore changes
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='ecoscore_history', null=True, blank=True)
    merchant_product = models.ForeignKey(MerchantProduct, on_delete=models.CASCADE, related_name='ecoscore_history', null=True, blank=True)
    
    old_score = models.FloatField(null=True, blank=True)
    new_score = models.FloatField()
    old_grade = models.CharField(max_length=1, choices=EcoScore.SCORE_GRADES, blank=True)
    new_grade = models.CharField(max_length=1, choices=EcoScore.SCORE_GRADES)
    
    change_reason = models.CharField(max_length=200, help_text="Reason for the score change")
    change_notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        product_name = self.product.name if self.product else self.merchant_product.name
        return f"{product_name} - Score change: {self.old_score} -> {self.new_score}"


class UserEcoAchievement(models.Model):
    """
    User achievements and gamification for eco-friendly purchases
    """
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    ACHIEVEMENT_TYPES = [
        ('green_shopper', 'Green Shopper'),
        ('eco_champion', 'Eco Champion'),
        ('sustainability_leader', 'Sustainability Leader'),
        ('carbon_reducer', 'Carbon Reducer'),
        ('eco_explorer', 'Eco Explorer'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='eco_achievements')
    achievement_type = models.CharField(max_length=50, choices=ACHIEVEMENT_TYPES)
    achievement_name = models.CharField(max_length=100)
    description = models.TextField()
    
    # Achievement metrics
    eco_score_threshold = models.FloatField(help_text="Minimum EcoScore threshold for this achievement")
    purchase_count_threshold = models.PositiveIntegerField(help_text="Minimum number of qualifying purchases")
    total_co2_saved = models.FloatField(default=0.0, help_text="Total CO2 saved through eco-friendly purchases")
    
    # Achievement status
    is_earned = models.BooleanField(default=False)
    earned_at = models.DateTimeField(null=True, blank=True)
    
    # Badge details
    badge_icon = models.CharField(max_length=50, default='🌱')
    badge_color = models.CharField(max_length=7, default='#4CAF50')  # Hex color
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'achievement_type']
        ordering = ['-earned_at', '-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.achievement_name}"