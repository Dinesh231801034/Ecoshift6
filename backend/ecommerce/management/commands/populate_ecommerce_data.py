from django.core.management.base import BaseCommand
from django.db import transaction
from decimal import Decimal
from ecommerce.models import Category, Brand, Product, ProductImage, Coupon, ShippingMethod
from customers.models import CustomerProfile
from authentication.models import User
import random


class Command(BaseCommand):
    help = 'Populate e-commerce database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Starting to populate e-commerce data...')
        
        with transaction.atomic():
            self.create_categories()
            self.create_brands()
            self.create_products()
            self.create_coupons()
            self.create_shipping_methods()
            self.create_customer_profiles()
        
        self.stdout.write(
            self.style.SUCCESS('Successfully populated e-commerce data!')
        )

    def create_categories(self):
        self.stdout.write('Creating categories...')
        
        categories_data = [
            {'name': 'Personal Care', 'slug': 'personal-care', 'description': 'Eco-friendly personal care products'},
            {'name': 'Home & Kitchen', 'slug': 'home-kitchen', 'description': 'Sustainable home and kitchen essentials'},
            {'name': 'Clothing', 'slug': 'clothing', 'description': 'Organic and sustainable clothing'},
            {'name': 'Cleaning Products', 'slug': 'cleaning-products', 'description': 'Natural and eco-friendly cleaning products'},
            {'name': 'Food & Beverages', 'slug': 'food-beverages', 'description': 'Organic and sustainable food items'},
            {'name': 'Beauty & Cosmetics', 'slug': 'beauty-cosmetics', 'description': 'Natural and cruelty-free beauty products'},
        ]
        
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults=cat_data
            )
            if created:
                self.stdout.write(f'  Created category: {category.name}')

    def create_brands(self):
        self.stdout.write('Creating brands...')
        
        brands_data = [
            {'name': 'EcoLife', 'slug': 'ecolife', 'description': 'Leading eco-friendly lifestyle brand'},
            {'name': 'GreenEarth', 'slug': 'greenearth', 'description': 'Sustainable products for a better planet'},
            {'name': 'NaturePure', 'slug': 'naturepure', 'description': 'Pure natural products'},
            {'name': 'BioCare', 'slug': 'biocare', 'description': 'Biodegradable care products'},
            {'name': 'OrganicChoice', 'slug': 'organicchoice', 'description': 'Premium organic selections'},
            {'name': 'EcoWear', 'slug': 'ecowear', 'description': 'Sustainable fashion brand'},
        ]
        
        for brand_data in brands_data:
            brand, created = Brand.objects.get_or_create(
                slug=brand_data['slug'],
                defaults=brand_data
            )
            if created:
                self.stdout.write(f'  Created brand: {brand.name}')

    def create_products(self):
        self.stdout.write('Creating products...')
        
        categories = list(Category.objects.all())
        brands = list(Brand.objects.all())
        
        products_data = [
            {
                'name': 'Organic Bamboo Toothbrush',
                'slug': 'organic-bamboo-toothbrush',
                'description': '100% biodegradable bamboo toothbrush with soft bristles. Perfect for eco-conscious individuals.',
                'short_description': 'Biodegradable bamboo toothbrush',
                'price': Decimal('299.00'),
                'stock_quantity': 100,
                'eco_rating': 5,
                'is_biodegradable': True,
                'is_plastic_free': True,
                'carbon_footprint': Decimal('0.5'),
            },
            {
                'name': 'Natural Coconut Oil',
                'slug': 'natural-coconut-oil',
                'description': 'Cold-pressed virgin coconut oil for cooking and skincare. 100% natural and organic.',
                'short_description': 'Cold-pressed virgin coconut oil',
                'price': Decimal('450.00'),
                'stock_quantity': 50,
                'eco_rating': 4,
                'is_organic': True,
                'is_plastic_free': True,
                'carbon_footprint': Decimal('1.2'),
            },
            {
                'name': 'Eco-Friendly Laundry Detergent',
                'slug': 'eco-friendly-laundry-detergent',
                'description': 'Plant-based laundry detergent that is gentle on clothes and the environment.',
                'short_description': 'Plant-based laundry detergent',
                'price': Decimal('650.00'),
                'stock_quantity': 75,
                'eco_rating': 4,
                'is_biodegradable': True,
                'is_plastic_free': False,
                'carbon_footprint': Decimal('0.8'),
            },
            {
                'name': 'Organic Cotton T-Shirt',
                'slug': 'organic-cotton-t-shirt',
                'description': 'Soft and comfortable organic cotton t-shirt. Fair trade and sustainable.',
                'short_description': 'Soft organic cotton t-shirt',
                'price': Decimal('899.00'),
                'stock_quantity': 30,
                'eco_rating': 5,
                'is_organic': True,
                'is_plastic_free': True,
                'carbon_footprint': Decimal('2.1'),
            },
            {
                'name': 'Bamboo Kitchen Utensils Set',
                'slug': 'bamboo-kitchen-utensils-set',
                'description': 'Complete set of bamboo kitchen utensils. Durable and eco-friendly.',
                'short_description': 'Bamboo kitchen utensils set',
                'price': Decimal('1200.00'),
                'stock_quantity': 25,
                'eco_rating': 5,
                'is_biodegradable': True,
                'is_plastic_free': True,
                'carbon_footprint': Decimal('1.5'),
            },
            {
                'name': 'Natural Face Cleanser',
                'slug': 'natural-face-cleanser',
                'description': 'Gentle natural face cleanser with aloe vera and chamomile. Suitable for all skin types.',
                'short_description': 'Natural face cleanser with aloe vera',
                'price': Decimal('550.00'),
                'stock_quantity': 60,
                'eco_rating': 4,
                'is_organic': True,
                'is_biodegradable': True,
                'carbon_footprint': Decimal('0.7'),
            },
            {
                'name': 'Reusable Water Bottle',
                'slug': 'reusable-water-bottle',
                'description': 'Stainless steel reusable water bottle. BPA-free and keeps drinks cold for 24 hours.',
                'short_description': 'Stainless steel reusable water bottle',
                'price': Decimal('750.00'),
                'stock_quantity': 40,
                'eco_rating': 5,
                'is_plastic_free': True,
                'is_recyclable': True,
                'carbon_footprint': Decimal('1.8'),
            },
            {
                'name': 'Organic Green Tea',
                'slug': 'organic-green-tea',
                'description': 'Premium organic green tea leaves. Rich in antioxidants and naturally caffeine-free.',
                'short_description': 'Premium organic green tea',
                'price': Decimal('380.00'),
                'stock_quantity': 80,
                'eco_rating': 4,
                'is_organic': True,
                'is_plastic_free': True,
                'carbon_footprint': Decimal('0.3'),
            },
            {
                'name': 'Eco-Friendly Dish Soap',
                'slug': 'eco-friendly-dish-soap',
                'description': 'Plant-based dish soap that cuts through grease while being gentle on hands.',
                'short_description': 'Plant-based dish soap',
                'price': Decimal('320.00'),
                'stock_quantity': 90,
                'eco_rating': 4,
                'is_biodegradable': True,
                'is_plastic_free': False,
                'carbon_footprint': Decimal('0.6'),
            },
            {
                'name': 'Natural Lip Balm',
                'slug': 'natural-lip-balm',
                'description': 'Moisturizing natural lip balm with beeswax and essential oils.',
                'short_description': 'Natural lip balm with beeswax',
                'price': Decimal('180.00'),
                'stock_quantity': 120,
                'eco_rating': 4,
                'is_organic': True,
                'is_plastic_free': True,
                'carbon_footprint': Decimal('0.2'),
            },
        ]
        
        for product_data in products_data:
            # Assign random category and brand
            category = random.choice(categories)
            brand = random.choice(brands)
            
            # Generate SKU
            sku = f"ECO{random.randint(1000, 9999)}"
            
            product, created = Product.objects.get_or_create(
                slug=product_data['slug'],
                defaults={
                    **product_data,
                    'category': category,
                    'brand': brand,
                    'sku': sku,
                }
            )
            
            if created:
                self.stdout.write(f'  Created product: {product.name}')

    def create_coupons(self):
        self.stdout.write('Creating coupons...')
        
        from django.utils import timezone
        from datetime import timedelta
        
        coupons_data = [
            {
                'code': 'WELCOME10',
                'description': 'Welcome discount for new customers',
                'coupon_type': 'percentage',
                'value': Decimal('10.00'),
                'minimum_amount': Decimal('500.00'),
                'usage_limit': 100,
                'valid_from': timezone.now(),
                'valid_until': timezone.now() + timedelta(days=30),
            },
            {
                'code': 'ECO20',
                'description': '20% off on eco-friendly products',
                'coupon_type': 'percentage',
                'value': Decimal('20.00'),
                'minimum_amount': Decimal('1000.00'),
                'maximum_discount': Decimal('500.00'),
                'usage_limit': 50,
                'valid_from': timezone.now(),
                'valid_until': timezone.now() + timedelta(days=15),
            },
            {
                'code': 'SAVE100',
                'description': 'Flat ₹100 off on orders above ₹2000',
                'coupon_type': 'fixed',
                'value': Decimal('100.00'),
                'minimum_amount': Decimal('2000.00'),
                'usage_limit': 200,
                'valid_from': timezone.now(),
                'valid_until': timezone.now() + timedelta(days=60),
            },
        ]
        
        for coupon_data in coupons_data:
            coupon, created = Coupon.objects.get_or_create(
                code=coupon_data['code'],
                defaults=coupon_data
            )
            if created:
                self.stdout.write(f'  Created coupon: {coupon.code}')

    def create_shipping_methods(self):
        self.stdout.write('Creating shipping methods...')
        
        shipping_methods_data = [
            {
                'name': 'Standard Shipping',
                'description': 'Regular delivery within 5-7 business days',
                'cost': Decimal('50.00'),
                'free_shipping_threshold': Decimal('1000.00'),
                'estimated_days': 5,
            },
            {
                'name': 'Express Shipping',
                'description': 'Fast delivery within 2-3 business days',
                'cost': Decimal('150.00'),
                'free_shipping_threshold': Decimal('2000.00'),
                'estimated_days': 2,
            },
            {
                'name': 'Same Day Delivery',
                'description': 'Same day delivery for select areas',
                'cost': Decimal('300.00'),
                'estimated_days': 1,
            },
        ]
        
        for shipping_data in shipping_methods_data:
            shipping_method, created = ShippingMethod.objects.get_or_create(
                name=shipping_data['name'],
                defaults=shipping_data
            )
            if created:
                self.stdout.write(f'  Created shipping method: {shipping_method.name}')

    def create_customer_profiles(self):
        self.stdout.write('Creating customer profiles...')
        
        # Create customer profiles for existing users
        users = User.objects.filter(user_type='customer')
        for user in users:
            profile, created = CustomerProfile.objects.get_or_create(
                user=user,
                defaults={
                    'city': 'Mumbai',
                    'state': 'Maharashtra',
                    'country': 'India',
                    'eco_interests': ['sustainability', 'organic', 'zero-waste'],
                    'preferred_categories': ['personal-care', 'home-kitchen'],
                    'budget_range': 'medium',
                }
            )
            if created:
                self.stdout.write(f'  Created customer profile for: {user.email}')

