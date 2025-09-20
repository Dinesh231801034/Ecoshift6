from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone
import uuid

from .models import Coupon, Payment, ShippingMethod, OrderTracking, EcoImpact
from .serializers import (
    CustomerOrderSerializer, CreateOrderSerializer, CouponSerializer, 
    PaymentSerializer, ShippingMethodSerializer, OrderTrackingSerializer, 
    EcoImpactSerializer, WishlistItemSerializer, AddToWishlistSerializer,
    UpdateCartItemSerializer
)
from customers.models import Cart, CartItem, CustomerProfile, CustomerOrder, OrderItem, CustomerWishlist
from .models import Product


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        customer_profile = get_object_or_404(CustomerProfile, user=self.request.user)
        return CustomerOrder.objects.filter(customer=customer_profile)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def create_order(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        if serializer.is_valid():
            customer_profile = get_object_or_404(CustomerProfile, user=request.user)
            cart, created = Cart.objects.get_or_create(customer=customer_profile)
            
            if not cart.items.exists():
                return Response(
                    {'error': 'Cart is empty'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            with transaction.atomic():
                # Create order
                order_number = f"ECO{timezone.now().strftime('%Y%m%d')}{uuid.uuid4().hex[:8].upper()}"
                order = CustomerOrder.objects.create(
                    customer=customer_profile,
                    order_number=order_number,
                    shipping_address_id=serializer.validated_data['shipping_address_id'],
                    payment_method=serializer.validated_data['payment_method']
                )
                
                # Add items to order
                total_amount = 0
                for cart_item in cart.items.all():
                    OrderItem.objects.create(
                        order=order,
                        product_id=cart_item.product_id,
                        product_name=cart_item.product_name,
                        product_image=cart_item.product_image,
                        quantity=cart_item.quantity,
                        unit_price=cart_item.product_price,
                        total_price=cart_item.total_price
                    )
                    total_amount += cart_item.total_price
                
                # Apply coupon if provided
                coupon_code = serializer.validated_data.get('coupon_code')
                if coupon_code:
                    try:
                        coupon = Coupon.objects.get(code=coupon_code, is_active=True)
                        if coupon.is_valid and total_amount >= coupon.minimum_amount:
                            if coupon.coupon_type == 'percentage':
                                discount = (total_amount * coupon.value) / 100
                                if coupon.maximum_discount:
                                    discount = min(discount, coupon.maximum_discount)
                            else:
                                discount = coupon.value
                            
                            order.discount_amount = discount
                            coupon.used_count += 1
                            coupon.save()
                    except Coupon.DoesNotExist:
                        pass
                
                # Calculate final total
                order.total_amount = total_amount - order.discount_amount
                order.save()
                
                # Clear cart
                cart.items.all().delete()
                
                # Create payment record
                Payment.objects.create(
                    order=order,
                    amount=order.total_amount,
                    payment_method=order.payment_method
                )
                
                return Response(
                    {'order_number': order.order_number, 'message': 'Order created successfully'}, 
                    status=status.HTTP_201_CREATED
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        customer_profile = get_object_or_404(CustomerProfile, user=self.request.user)
        return CustomerWishlist.objects.filter(customer=customer_profile)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_item(self, request):
        serializer = AddToWishlistSerializer(data=request.data)
        if serializer.is_valid():
            customer_profile = get_object_or_404(CustomerProfile, user=request.user)
            product_id = serializer.validated_data['product_id']
            
            try:
                product = Product.objects.get(id=product_id, is_active=True)
            except Product.DoesNotExist:
                return Response(
                    {'error': 'Product not found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            wishlist_item, created = CustomerWishlist.objects.get_or_create(
                customer=customer_profile,
                product_id=product_id,
                defaults={
                    'product_name': product.name,
                    'product_image': product.images.filter(is_primary=True).first().image.url if product.images.filter(is_primary=True).exists() else '',
                    'product_price': product.price
                }
            )
            
            if created:
                return Response({'message': 'Item added to wishlist'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'message': 'Item already in wishlist'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CouponViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Coupon.objects.filter(is_active=True)
    serializer_class = CouponSerializer
    permission_classes = [permissions.AllowAny]


class ShippingMethodViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ShippingMethod.objects.filter(is_active=True)
    serializer_class = ShippingMethodSerializer
    permission_classes = [permissions.AllowAny]


class EcoImpactViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EcoImpactSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return EcoImpact.objects.filter(user=self.request.user)

