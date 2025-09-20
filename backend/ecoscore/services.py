"""
EcoScore calculation services using Brightway2 and ecoinvent data
"""
import logging
from typing import Optional, Dict, Any, Tuple
from decimal import Decimal
from django.utils import timezone
from django.db import transaction

from .models import (
    EcoInventProcess, ProductEcoMapping, EcoScoreBenchmark, 
    EcoScore, EcoScoreHistory
)
from products.models import Product
from merchants.models import MerchantProduct

logger = logging.getLogger(__name__)


class LCACalculationService:
    """
    Service for calculating Life Cycle Assessment impacts using Brightway2
    """
    
    def __init__(self):
        self.method = ('IPCC 2013', 'climate change', 'GWP 100a')
        self.database_name = 'ecoinvent 3.9'
        
    def calculate_impact(self, ecoinvent_code: str, functional_unit: float = 1.0) -> float:
        """
        Calculate environmental impact for a given ecoinvent process
        
        Args:
            ecoinvent_code: Ecoinvent process code
            functional_unit: Functional unit multiplier
            
        Returns:
            Impact value in kg CO2-eq
        """
        try:
            # Import brightway2 components
            from brightway2 import Database, LCA
            
            # Get the ecoinvent database
            db = Database(self.database_name)
            
            # Get the process
            process = db.get(ecoinvent_code)
            if not process:
                logger.error(f"Process {ecoinvent_code} not found in {self.database_name}")
                return 0.0
            
            # Create LCA calculation
            lca = LCA({process: functional_unit}, self.method)
            lca.lci()  # Life Cycle Inventory
            lca.lcia()  # Life Cycle Impact Assessment
            
            return float(lca.score)
            
        except Exception as e:
            logger.error(f"Error calculating impact for {ecoinvent_code}: {str(e)}")
            return 0.0
    
    def get_impact_with_fallback(self, ecoinvent_code: str, functional_unit: float = 1.0) -> float:
        """
        Get impact with fallback to default values if calculation fails
        """
        impact = self.calculate_impact(ecoinvent_code, functional_unit)
        
        # Fallback values based on product type (in kg CO2-eq)
        fallback_impacts = {
            'bottle': 0.1,  # PET bottle
            'textile': 0.5,  # Cotton t-shirt
            'lamp': 0.2,    # LED bulb
            'electronics': 1.0,  # General electronics
            'food': 0.3,    # General food items
            'default': 0.5  # Default fallback
        }
        
        if impact == 0.0:
            # Try to determine fallback based on process name
            process_name = ecoinvent_code.lower()
            for key, fallback_value in fallback_impacts.items():
                if key in process_name:
                    logger.warning(f"Using fallback impact {fallback_value} for {ecoinvent_code}")
                    return fallback_value * functional_unit
            
            logger.warning(f"Using default fallback impact for {ecoinvent_code}")
            return fallback_impacts['default'] * functional_unit
        
        return impact


class EcoScoreCalculationService:
    """
    Service for calculating and normalizing EcoScores
    """
    
    def __init__(self):
        self.lca_service = LCACalculationService()
    
    def normalize_impact(self, impact: float, benchmark: EcoScoreBenchmark) -> float:
        """
        Normalize impact against benchmark
        
        Args:
            impact: Raw impact value
            benchmark: Benchmark for normalization
            
        Returns:
            Normalized impact value
        """
        if benchmark.benchmark_impact == 0:
            return 0.0
        
        return impact / benchmark.benchmark_impact
    
    def calculate_ecoscore(self, normalized_impact: float) -> Tuple[float, str]:
        """
        Convert normalized impact to EcoScore (0-100) and grade
        
        Args:
            normalized_impact: Normalized impact value
            
        Returns:
            Tuple of (score_value, score_grade)
        """
        # Simple linear scaling: lower impact = higher score
        # Score = 100 - (normalized_impact * 100)
        score = max(0.0, min(100.0, 100.0 - (normalized_impact * 100)))
        
        # Determine grade
        if score >= 80:
            grade = 'A'
        elif score >= 60:
            grade = 'B'
        elif score >= 40:
            grade = 'C'
        elif score >= 20:
            grade = 'D'
        else:
            grade = 'E'
        
        return round(score, 1), grade
    
    def get_benchmark_for_product(self, product) -> Optional[EcoScoreBenchmark]:
        """
        Get appropriate benchmark for a product based on its category
        """
        try:
            if hasattr(product, 'category') and hasattr(product.category, 'name'):
                # For Product model
                category = product.category.name
                subcategory = product.subcategory.name if product.subcategory else None
            else:
                # For MerchantProduct model
                category = product.category
                subcategory = product.subcategory
            
            # Try to find exact match first
            benchmark = EcoScoreBenchmark.objects.filter(
                category__iexact=category,
                subcategory__iexact=subcategory or '',
                is_active=True
            ).first()
            
            if benchmark:
                return benchmark
            
            # Try category-only match
            benchmark = EcoScoreBenchmark.objects.filter(
                category__iexact=category,
                subcategory='',
                is_active=True
            ).first()
            
            if benchmark:
                return benchmark
            
            # Try partial category match
            benchmark = EcoScoreBenchmark.objects.filter(
                category__icontains=category,
                is_active=True
            ).first()
            
            if benchmark:
                return benchmark
            
            # Try to map category names
            category_mapping = {
                'Home & Garden': 'Home & Garden',
                'Personal Care': 'Personal Care',
                'Food & Beverages': 'Food & Beverages',
                'Clothing & Textiles': 'Clothing & Textiles',
                'Electronics': 'Electronics',
                'Cleaning Products': 'Cleaning Products',
                'Kitchen & Dining': 'Home & Garden',
                'Fashion & Accessories': 'Clothing & Textiles'
            }
            
            mapped_category = category_mapping.get(category, category)
            benchmark = EcoScoreBenchmark.objects.filter(
                category__iexact=mapped_category,
                is_active=True
            ).first()
            
            return benchmark
            
        except Exception as e:
            logger.error(f"Error getting benchmark for product: {str(e)}")
            return None
    
    def calculate_product_ecoscore(self, product, force_recalculate: bool = False) -> Optional[EcoScore]:
        """
        Calculate EcoScore for a product
        
        Args:
            product: Product or MerchantProduct instance
            force_recalculate: Force recalculation even if score exists
            
        Returns:
            EcoScore instance or None
        """
        try:
            # Check if we already have a recent calculation
            if not force_recalculate:
                existing_score = self._get_latest_ecoscore(product)
                if existing_score and existing_score.calculation_date > timezone.now() - timezone.timedelta(days=30):
                    return existing_score
            
            # Get product mapping
            mapping = self._get_product_mapping(product)
            if not mapping:
                logger.warning(f"No ecoinvent mapping found for product: {product.name}")
                return None
            
            # Get benchmark
            benchmark = self.get_benchmark_for_product(product)
            if not benchmark:
                logger.warning(f"No benchmark found for product: {product.name}")
                return None
            
            # Calculate raw impact
            raw_impact = self.lca_service.get_impact_with_fallback(
                mapping.ecoinvent_process.code,
                mapping.functional_unit_value
            )
            
            # Apply manual override if exists
            if mapping.is_manual_override and mapping.manual_impact_override:
                raw_impact = mapping.manual_impact_override
                logger.info(f"Using manual override for {product.name}: {raw_impact}")
            
            # Normalize impact
            normalized_impact = self.normalize_impact(raw_impact, benchmark)
            
            # Calculate EcoScore
            score_value, score_grade = self.calculate_ecoscore(normalized_impact)
            
            # Create or update EcoScore record
            with transaction.atomic():
                # Delete existing EcoScore for this product and version
                existing_ecoscore = self._get_latest_ecoscore(product)
                if existing_ecoscore:
                    existing_ecoscore.delete()
                
                # Create new EcoScore record
                ecoscore = EcoScore.objects.create(
                    product=product if isinstance(product, Product) else None,
                    merchant_product=product if isinstance(product, MerchantProduct) else None,
                    score_value=score_value,
                    score_grade=score_grade,
                    raw_impact=raw_impact,
                    impact_unit='kg CO2-eq',
                    normalized_impact=normalized_impact,
                    ecoinvent_process=mapping.ecoinvent_process,
                    benchmark=benchmark,
                    is_manual_override=mapping.is_manual_override,
                    calculation_notes=f"Calculated using {mapping.ecoinvent_process.name}"
                )
                
                # Update product fields
                self._update_product_ecoscore_fields(product, score_value, score_grade)
                
                # Create history record if score changed
                self._create_history_record(product, score_value, score_grade)
                
                logger.info(f"Calculated EcoScore for {product.name}: {score_grade} ({score_value})")
                return ecoscore
                
        except Exception as e:
            logger.error(f"Error calculating EcoScore for {product.name}: {str(e)}")
            return None
    
    def _get_latest_ecoscore(self, product) -> Optional[EcoScore]:
        """Get the latest EcoScore for a product"""
        if isinstance(product, Product):
            return EcoScore.objects.filter(product=product).order_by('-calculation_date').first()
        else:
            return EcoScore.objects.filter(merchant_product=product).order_by('-calculation_date').first()
    
    def _get_product_mapping(self, product) -> Optional[ProductEcoMapping]:
        """Get ecoinvent mapping for a product"""
        if isinstance(product, Product):
            return ProductEcoMapping.objects.filter(product=product).first()
        else:
            return ProductEcoMapping.objects.filter(merchant_product=product).first()
    
    def _update_product_ecoscore_fields(self, product, score_value: float, score_grade: str):
        """Update product's EcoScore fields"""
        product.ecoscore_value = score_value
        product.ecoscore_grade = score_grade
        product.ecoscore_last_calculated = timezone.now()
        product.save(update_fields=['ecoscore_value', 'ecoscore_grade', 'ecoscore_last_calculated'])
    
    def _create_history_record(self, product, score_value: float, score_grade: str):
        """Create history record for score change"""
        latest_score = self._get_latest_ecoscore(product)
        if latest_score and latest_score.score_value != score_value:
            EcoScoreHistory.objects.create(
                product=product if isinstance(product, Product) else None,
                merchant_product=product if isinstance(product, MerchantProduct) else None,
                old_score=latest_score.score_value,
                new_score=score_value,
                old_grade=latest_score.score_grade,
                new_grade=score_grade,
                change_reason="Automatic recalculation",
                change_notes="EcoScore recalculated due to updated data or methodology"
            )


class EcoScoreGamificationService:
    """
    Service for handling gamification and achievements
    """
    
    def __init__(self):
        pass
    
    def check_achievements(self, user, cart_items):
        """
        Check and award achievements based on cart items
        
        Args:
            user: User instance
            cart_items: List of cart items with EcoScore data
        """
        try:
            from .models import UserEcoAchievement
            
            # Calculate cart metrics
            total_items = len(cart_items)
            eco_score_a_items = sum(1 for item in cart_items if item.get('ecoscore_grade') == 'A')
            eco_score_b_items = sum(1 for item in cart_items if item.get('ecoscore_grade') == 'B')
            high_eco_items = eco_score_a_items + eco_score_b_items
            
            # Calculate total CO2 saved (compared to average products)
            total_co2_saved = sum(
                item.get('co2_saved', 0) for item in cart_items
            )
            
            # Check Green Shopper achievement (70%+ high eco items)
            if total_items > 0 and (high_eco_items / total_items) >= 0.7:
                self._award_achievement(
                    user, 'green_shopper', 'Green Shopper',
                    'You consistently choose environmentally friendly products!',
                    eco_score_threshold=70.0,
                    purchase_count_threshold=1,
                    total_co2_saved=total_co2_saved
                )
            
            # Check Eco Champion achievement (90%+ A grade items)
            if total_items > 0 and (eco_score_a_items / total_items) >= 0.9:
                self._award_achievement(
                    user, 'eco_champion', 'Eco Champion',
                    'You are a true champion of sustainability!',
                    eco_score_threshold=90.0,
                    purchase_count_threshold=1,
                    total_co2_saved=total_co2_saved
                )
            
            # Check Carbon Reducer achievement (significant CO2 savings)
            if total_co2_saved >= 10.0:  # 10 kg CO2 saved
                self._award_achievement(
                    user, 'carbon_reducer', 'Carbon Reducer',
                    f'You have saved {total_co2_saved:.1f} kg of CO2 through your choices!',
                    eco_score_threshold=0.0,
                    purchase_count_threshold=1,
                    total_co2_saved=total_co2_saved
                )
                
        except Exception as e:
            logger.error(f"Error checking achievements for user {user.email}: {str(e)}")
    
    def _award_achievement(self, user, achievement_type: str, name: str, description: str,
                          eco_score_threshold: float, purchase_count_threshold: int,
                          total_co2_saved: float):
        """Award an achievement to a user"""
        try:
            from .models import UserEcoAchievement
            
            achievement, created = UserEcoAchievement.objects.get_or_create(
                user=user,
                achievement_type=achievement_type,
                defaults={
                    'achievement_name': name,
                    'description': description,
                    'eco_score_threshold': eco_score_threshold,
                    'purchase_count_threshold': purchase_count_threshold,
                    'total_co2_saved': total_co2_saved,
                    'is_earned': True,
                    'earned_at': timezone.now(),
                    'badge_icon': '🌱',
                    'badge_color': '#4CAF50'
                }
            )
            
            if created:
                logger.info(f"Awarded achievement '{name}' to user {user.email}")
            else:
                # Update existing achievement
                achievement.total_co2_saved += total_co2_saved
                achievement.save()
                
        except Exception as e:
            logger.error(f"Error awarding achievement to user {user.email}: {str(e)}")
