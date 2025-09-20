"""
Management command to calculate EcoScores for all products
"""
from django.core.management.base import BaseCommand
from django.db import transaction
from products.models import Product
from merchants.models import MerchantProduct
from ecoscore.models import EcoInventProcess, ProductEcoMapping
from ecoscore.services import EcoScoreCalculationService
from ecoscore.mapping_data import get_ecoinvent_mapping


class Command(BaseCommand):
    help = 'Calculate EcoScores for all products'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force recalculation even if EcoScore already exists',
        )
        parser.add_argument(
            '--product-id',
            type=int,
            help='Calculate EcoScore for specific product ID only',
        )
        parser.add_argument(
            '--merchant-product-id',
            type=int,
            help='Calculate EcoScore for specific merchant product ID only',
        )
        parser.add_argument(
            '--category',
            type=str,
            help='Calculate EcoScores for products in specific category only',
        )

    def handle(self, *args, **options):
        force = options['force']
        product_id = options.get('product_id')
        merchant_product_id = options.get('merchant_product_id')
        category = options.get('category')
        
        self.stdout.write('Starting EcoScore calculation...')
        
        calculation_service = EcoScoreCalculationService()
        processed_count = 0
        success_count = 0
        error_count = 0
        
        try:
            # Handle specific product
            if product_id:
                try:
                    product = Product.objects.get(id=product_id)
                    self._process_product(product, calculation_service, force)
                    success_count += 1
                    processed_count += 1
                except Product.DoesNotExist:
                    self.stdout.write(
                        self.style.ERROR(f'Product with ID {product_id} not found')
                    )
                    return
                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f'Error processing product {product_id}: {str(e)}')
                    )
                    error_count += 1
                    processed_count += 1
            
            # Handle specific merchant product
            elif merchant_product_id:
                try:
                    merchant_product = MerchantProduct.objects.get(id=merchant_product_id)
                    self._process_merchant_product(merchant_product, calculation_service, force)
                    success_count += 1
                    processed_count += 1
                except MerchantProduct.DoesNotExist:
                    self.stdout.write(
                        self.style.ERROR(f'Merchant product with ID {merchant_product_id} not found')
                    )
                    return
                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f'Error processing merchant product {merchant_product_id}: {str(e)}')
                    )
                    error_count += 1
                    processed_count += 1
            
            # Handle category filter
            elif category:
                products = Product.objects.filter(category__name__icontains=category)
                merchant_products = MerchantProduct.objects.filter(category__icontains=category)
                
                self.stdout.write(f'Processing {products.count()} products and {merchant_products.count()} merchant products in category "{category}"')
                
                for product in products:
                    try:
                        self._process_product(product, calculation_service, force)
                        success_count += 1
                    except Exception as e:
                        self.stdout.write(
                            self.style.ERROR(f'Error processing product {product.id}: {str(e)}')
                        )
                        error_count += 1
                    processed_count += 1
                
                for merchant_product in merchant_products:
                    try:
                        self._process_merchant_product(merchant_product, calculation_service, force)
                        success_count += 1
                    except Exception as e:
                        self.stdout.write(
                            self.style.ERROR(f'Error processing merchant product {merchant_product.id}: {str(e)}')
                        )
                        error_count += 1
                    processed_count += 1
            
            # Process all products
            else:
                products = Product.objects.all()
                merchant_products = MerchantProduct.objects.all()
                
                self.stdout.write(f'Processing {products.count()} products and {merchant_products.count()} merchant products')
                
                for product in products:
                    try:
                        self._process_product(product, calculation_service, force)
                        success_count += 1
                    except Exception as e:
                        self.stdout.write(
                            self.style.ERROR(f'Error processing product {product.id}: {str(e)}')
                        )
                        error_count += 1
                    processed_count += 1
                    
                    if processed_count % 10 == 0:
                        self.stdout.write(f'Processed {processed_count} products...')
                
                for merchant_product in merchant_products:
                    try:
                        self._process_merchant_product(merchant_product, calculation_service, force)
                        success_count += 1
                    except Exception as e:
                        self.stdout.write(
                            self.style.ERROR(f'Error processing merchant product {merchant_product.id}: {str(e)}')
                        )
                        error_count += 1
                    processed_count += 1
                    
                    if processed_count % 10 == 0:
                        self.stdout.write(f'Processed {processed_count} products...')
        
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Fatal error during EcoScore calculation: {str(e)}')
            )
            return
        
        # Summary
        self.stdout.write('\n' + '='*50)
        self.stdout.write('EcoScore Calculation Summary:')
        self.stdout.write(f'Total processed: {processed_count}')
        self.stdout.write(f'Successful: {success_count}')
        self.stdout.write(f'Errors: {error_count}')
        
        if error_count > 0:
            self.stdout.write(
                self.style.WARNING(f'Completed with {error_count} errors')
            )
        else:
            self.stdout.write(
                self.style.SUCCESS('EcoScore calculation completed successfully!')
            )
    
    def _process_product(self, product, calculation_service, force):
        """Process a single Product instance"""
        # Create mapping if it doesn't exist
        if not ProductEcoMapping.objects.filter(product=product).exists():
            self._create_product_mapping(product)
        
        # Calculate EcoScore
        ecoscore = calculation_service.calculate_product_ecoscore(product, force)
        if ecoscore:
            self.stdout.write(
                f'✓ Product "{product.name}" - EcoScore {ecoscore.score_grade} ({ecoscore.score_value:.1f})'
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'⚠ Could not calculate EcoScore for product "{product.name}"')
            )
    
    def _process_merchant_product(self, merchant_product, calculation_service, force):
        """Process a single MerchantProduct instance"""
        # Create mapping if it doesn't exist
        if not ProductEcoMapping.objects.filter(merchant_product=merchant_product).exists():
            self._create_merchant_product_mapping(merchant_product)
        
        # Calculate EcoScore
        ecoscore = calculation_service.calculate_product_ecoscore(merchant_product, force)
        if ecoscore:
            self.stdout.write(
                f'✓ Merchant Product "{merchant_product.name}" - EcoScore {ecoscore.score_grade} ({ecoscore.score_value:.1f})'
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'⚠ Could not calculate EcoScore for merchant product "{merchant_product.name}"')
            )
    
    def _create_product_mapping(self, product):
        """Create ecoinvent mapping for a Product"""
        try:
            # Get ecoinvent mapping data
            mapping_data = get_ecoinvent_mapping(
                product_name=product.name,
                category=product.category.name,
                subcategory=product.subcategory.name if product.subcategory else '',
                tags=product.tags or [],
                is_eco_friendly=product.is_eco_friendly
            )
            
            if not mapping_data:
                self.stdout.write(
                    self.style.WARNING(f'No ecoinvent mapping found for product "{product.name}"')
                )
                return
            
            # Get or create ecoinvent process
            ecoinvent_process, created = EcoInventProcess.objects.get_or_create(
                code=mapping_data['code'],
                defaults={
                    'name': mapping_data['name'],
                    'category': mapping_data['category'],
                    'subcategory': mapping_data.get('subcategory', ''),
                    'unit': mapping_data['unit'],
                    'description': f"Auto-created for {product.name}",
                    'is_active': True
                }
            )
            
            # Create product mapping
            ProductEcoMapping.objects.create(
                product=product,
                ecoinvent_process=ecoinvent_process,
                mapping_confidence=0.8,  # Default confidence
                functional_unit='per item',
                functional_unit_value=1.0,
                mapping_notes=f"Auto-mapped based on product category and attributes"
            )
            
            self.stdout.write(f'Created mapping for product "{product.name}" -> {ecoinvent_process.name}')
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating mapping for product "{product.name}": {str(e)}')
            )
    
    def _create_merchant_product_mapping(self, merchant_product):
        """Create ecoinvent mapping for a MerchantProduct"""
        try:
            # Get ecoinvent mapping data
            mapping_data = get_ecoinvent_mapping(
                product_name=merchant_product.name,
                category=merchant_product.category,
                subcategory=merchant_product.subcategory or '',
                tags=merchant_product.tags or [],
                is_eco_friendly=merchant_product.is_eco_friendly
            )
            
            if not mapping_data:
                self.stdout.write(
                    self.style.WARNING(f'No ecoinvent mapping found for merchant product "{merchant_product.name}"')
                )
                return
            
            # Get or create ecoinvent process
            ecoinvent_process, created = EcoInventProcess.objects.get_or_create(
                code=mapping_data['code'],
                defaults={
                    'name': mapping_data['name'],
                    'category': mapping_data['category'],
                    'subcategory': mapping_data.get('subcategory', ''),
                    'unit': mapping_data['unit'],
                    'description': f"Auto-created for {merchant_product.name}",
                    'is_active': True
                }
            )
            
            # Create product mapping
            ProductEcoMapping.objects.create(
                merchant_product=merchant_product,
                ecoinvent_process=ecoinvent_process,
                mapping_confidence=0.8,  # Default confidence
                functional_unit='per item',
                functional_unit_value=1.0,
                mapping_notes=f"Auto-mapped based on product category and attributes"
            )
            
            self.stdout.write(f'Created mapping for merchant product "{merchant_product.name}" -> {ecoinvent_process.name}')
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating mapping for merchant product "{merchant_product.name}": {str(e)}')
            )
