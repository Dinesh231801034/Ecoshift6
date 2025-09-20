from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from customers.models import CustomerProfile, CustomerAddress, CustomerOrder, OrderItem, CustomerWishlist, CustomerRecommendation
from merchants.models import MerchantProduct
from decimal import Decimal
from datetime import datetime, timedelta
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate customer portal with sample data'

    def handle(self, *args, **options):
        # Create customer user if it doesn't exist
        customer_user, created = User.objects.get_or_create(
            username='customer',
            defaults={
                'email': 'customer@example.com',
                'first_name': 'Jane',
                'last_name': 'Customer',
                'user_type': 'customer'
            }
        )
        if created:
            customer_user.set_password('customer123')
            customer_user.save()
            self.stdout.write(self.style.SUCCESS('Created customer user'))

        # Create customer profile
        customer_profile, created = CustomerProfile.objects.get_or_create(
            user=customer_user,
            defaults={
                'date_of_birth': '1990-05-15',
                'gender': 'female',
                'eco_interests': ['organic', 'zero waste', 'sustainable materials', 'biodegradable'],
                'preferred_categories': ['Personal Care', 'Kitchen & Dining'],
                'budget_range': 'medium',
                'city': 'Mumbai',
                'state': 'Maharashtra',
                'country': 'India'
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('Created customer profile'))

        # Create customer addresses
        addresses_data = [
            {
                'address_type': 'home',
                'full_name': 'Jane Customer',
                'phone_number': '+91 98765 43210',
                'address_line_1': '123 Green Street, Eco Colony',
                'address_line_2': 'Near Eco Park',
                'city': 'Mumbai',
                'state': 'Maharashtra',
                'country': 'India',
                'postal_code': '400001',
                'is_default': True
            },
            {
                'address_type': 'work',
                'full_name': 'Jane Customer',
                'phone_number': '+91 98765 43210',
                'address_line_1': '456 Business District, Eco Tower',
                'address_line_2': 'Floor 10, Office 1001',
                'city': 'Mumbai',
                'state': 'Maharashtra',
                'country': 'India',
                'postal_code': '400002',
                'is_default': False
            }
        ]

        for address_data in addresses_data:
            address, created = CustomerAddress.objects.get_or_create(
                customer=customer_profile,
                address_type=address_data['address_type'],
                defaults=address_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created {address_data["address_type"]} address'))

        # Get some products for orders and wishlist
        products = MerchantProduct.objects.filter(is_active=True)[:5]
        
        if not products.exists():
            self.stdout.write(self.style.WARNING('No products found. Please run populate_merchant_data first.'))
            return

        # Create sample orders
        order_statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
        for i in range(8):
            order_date = datetime.now() - timedelta(days=random.randint(1, 30))
            order = CustomerOrder.objects.create(
                customer=customer_profile,
                order_number=f"CUST{1000 + i}",
                total_amount=Decimal(str(random.randint(500, 3000))),
                shipping_cost=Decimal('50.00'),
                tax_amount=Decimal('50.00'),
                order_status=random.choice(order_statuses),
                payment_status='paid',
                payment_method='online',
                created_at=order_date
            )

            # Add order items
            if products:
                product = random.choice(products)
                quantity = random.randint(1, 3)
                OrderItem.objects.create(
                    order=order,
                    product_id=str(product.id),
                    product_name=product.name,
                    product_image=product.primary_image.url if product.primary_image else '',
                    quantity=quantity,
                    unit_price=product.price,
                    total_price=product.price * quantity
                )

        self.stdout.write(self.style.SUCCESS('Created sample orders'))

        # Create wishlist items
        for product in products[:3]:
            CustomerWishlist.objects.get_or_create(
                customer=customer_profile,
                product_id=str(product.id),
                defaults={
                    'product_name': product.name,
                    'product_image': product.primary_image.url if product.primary_image else '',
                    'product_price': product.price
                }
            )

        self.stdout.write(self.style.SUCCESS('Created wishlist items'))

        # Create recommendations
        for product in products:
            confidence_score = random.uniform(0.6, 0.9)
            CustomerRecommendation.objects.get_or_create(
                customer=customer_profile,
                product_id=str(product.id),
                defaults={
                    'product_name': product.name,
                    'product_image': product.primary_image.url if product.primary_image else '',
                    'product_price': product.price,
                    'recommendation_reason': f"Based on your interest in {', '.join(customer_profile.eco_interests[:2])}",
                    'confidence_score': confidence_score
                }
            )

        self.stdout.write(self.style.SUCCESS('Created recommendations'))

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully populated customer data:\n'
                f'- Customer: {customer_profile.user.email}\n'
                f'- Addresses: {CustomerAddress.objects.filter(customer=customer_profile).count()}\n'
                f'- Orders: {CustomerOrder.objects.filter(customer=customer_profile).count()}\n'
                f'- Wishlist: {CustomerWishlist.objects.filter(customer=customer_profile).count()}\n'
                f'- Recommendations: {CustomerRecommendation.objects.filter(customer=customer_profile).count()}\n'
                f'Login with: customer@example.com / customer123'
            )
        )





