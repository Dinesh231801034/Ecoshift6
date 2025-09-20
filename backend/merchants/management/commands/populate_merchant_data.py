from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from merchants.models import MerchantProfile, MerchantProduct, MerchantOrder, OrderItem
from decimal import Decimal
from datetime import datetime, timedelta
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate merchant portal with sample data'

    def handle(self, *args, **options):
        # Create merchant user if it doesn't exist
        merchant_user, created = User.objects.get_or_create(
            username='merchant',
            defaults={
                'email': 'merchant@example.com',
                'first_name': 'John',
                'last_name': 'Merchant',
                'user_type': 'merchant'
            }
        )
        if created:
            merchant_user.set_password('merchant123')
            merchant_user.save()
            self.stdout.write(self.style.SUCCESS('Created merchant user'))

        # Create merchant profile
        merchant_profile, created = MerchantProfile.objects.get_or_create(
            user=merchant_user,
            defaults={
                'business_name': 'EcoGreen Solutions',
                'business_type': 'Eco-friendly Products',
                'business_description': 'Leading provider of sustainable and eco-friendly products',
                'contact_person': 'John Merchant',
                'phone_number': '+91 98765 43210',
                'email': 'merchant@example.com',
                'address': '123 Green Street, Eco City',
                'city': 'Mumbai',
                'state': 'Maharashtra',
                'country': 'India',
                'postal_code': '400001',
                'is_verified': True,
                'is_active': True
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('Created merchant profile'))

        # Create sample products
        products_data = [
            {
                'name': 'Bamboo Toothbrush Set',
                'description': 'Eco-friendly bamboo toothbrushes with charcoal bristles',
                'category': 'Personal Care',
                'subcategory': 'Oral Care',
                'price': Decimal('299.00'),
                'original_price': Decimal('399.00'),
                'sku': 'BAMBOO-TB-001',
                'brand': 'EcoBrush',
                'tags': ['bamboo', 'toothbrush', 'eco-friendly', 'charcoal'],
                'stock_quantity': 50,
                'is_active': True,
                'is_eco_friendly': True,
                'eco_certifications': ['FSC Certified', 'Biodegradable']
            },
            {
                'name': 'Reusable Water Bottle',
                'description': 'Stainless steel water bottle with bamboo cap',
                'category': 'Kitchen & Dining',
                'subcategory': 'Water Bottles',
                'price': Decimal('599.00'),
                'original_price': Decimal('799.00'),
                'sku': 'STEEL-WB-002',
                'brand': 'AquaEco',
                'tags': ['stainless steel', 'water bottle', 'reusable', 'bamboo'],
                'stock_quantity': 30,
                'is_active': True,
                'is_eco_friendly': True,
                'eco_certifications': ['BPA Free', 'Food Grade']
            },
            {
                'name': 'Organic Cotton Tote Bag',
                'description': 'Handmade organic cotton tote bag for shopping',
                'category': 'Fashion & Accessories',
                'subcategory': 'Bags',
                'price': Decimal('199.00'),
                'original_price': Decimal('299.00'),
                'sku': 'COTTON-TB-003',
                'brand': 'GreenBag',
                'tags': ['organic cotton', 'tote bag', 'handmade', 'shopping'],
                'stock_quantity': 25,
                'is_active': True,
                'is_eco_friendly': True,
                'eco_certifications': ['GOTS Certified', 'Fair Trade']
            },
            {
                'name': 'Solar Phone Charger',
                'description': 'Portable solar charger for mobile devices',
                'category': 'Electronics',
                'subcategory': 'Chargers',
                'price': Decimal('1299.00'),
                'original_price': Decimal('1599.00'),
                'sku': 'SOLAR-PC-004',
                'brand': 'SunPower',
                'tags': ['solar', 'charger', 'portable', 'renewable energy'],
                'stock_quantity': 15,
                'is_active': True,
                'is_eco_friendly': True,
                'eco_certifications': ['CE Certified', 'RoHS Compliant']
            },
            {
                'name': 'Bamboo Cutlery Set',
                'description': 'Complete bamboo cutlery set for travel',
                'category': 'Kitchen & Dining',
                'subcategory': 'Cutlery',
                'price': Decimal('399.00'),
                'original_price': Decimal('499.00'),
                'sku': 'BAMBOO-CS-005',
                'brand': 'EcoEats',
                'tags': ['bamboo', 'cutlery', 'travel', 'disposable alternative'],
                'stock_quantity': 40,
                'is_active': True,
                'is_eco_friendly': True,
                'eco_certifications': ['FSC Certified', 'Food Safe']
            }
        ]

        created_products = []
        for product_data in products_data:
            product, created = MerchantProduct.objects.get_or_create(
                merchant=merchant_profile,
                sku=product_data['sku'],
                defaults=product_data
            )
            if created:
                created_products.append(product)
                self.stdout.write(self.style.SUCCESS(f'Created product: {product.name}'))

        # Create sample orders
        order_statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
        for i in range(15):
            order_date = datetime.now() - timedelta(days=random.randint(1, 30))
            order = MerchantOrder.objects.create(
                merchant=merchant_profile,
                order_number=f'ECO{1000 + i}',
                customer_name=f'Customer {i+1}',
                customer_email=f'customer{i+1}@example.com',
                customer_phone=f'+91 98765{1000 + i}',
                total_amount=Decimal(str(random.randint(500, 3000))),
                shipping_cost=Decimal('50.00'),
                tax_amount=Decimal('50.00'),
                shipping_address=f'{100 + i} Green Street, Eco City',
                shipping_city='Mumbai',
                shipping_state='Maharashtra',
                shipping_country='India',
                shipping_postal_code='400001',
                status=random.choice(order_statuses),
                created_at=order_date
            )

            # Add order items
            if created_products:
                product = random.choice(created_products)
                quantity = random.randint(1, 3)
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=quantity,
                    unit_price=product.price,
                    total_price=product.price * quantity
                )

        self.stdout.write(self.style.SUCCESS('Created sample orders'))

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully populated merchant data:\n'
                f'- Merchant: {merchant_profile.business_name}\n'
                f'- Products: {MerchantProduct.objects.filter(merchant=merchant_profile).count()}\n'
                f'- Orders: {MerchantOrder.objects.filter(merchant=merchant_profile).count()}\n'
                f'Login with: merchant@example.com / merchant123'
            )
        )





