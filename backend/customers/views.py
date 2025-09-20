from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q, Sum, Count, Avg
from django.utils import timezone
from django.shortcuts import get_object_or_404
from datetime import timedelta
import random
import string
from .models import (
    CustomerProfile, CustomerAddress, CustomerOrder, OrderItem, 
    CustomerWishlist, CustomerReview, CustomerRecommendation
)
from .serializers import (
    CustomerProfileSerializer, CustomerAddressSerializer, CustomerOrderSerializer,
    OrderItemSerializer, CustomerWishlistSerializer, CustomerReviewSerializer,
    CustomerRecommendationSerializer
)


class CustomerProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for customer profiles with comprehensive functionality
    """
    serializer_class = CustomerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return CustomerProfile.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def preferences(self, request):
        """
        Get customer preferences and interests
        """
        try:
            customer_profile = CustomerProfile.objects.get(user=request.user)
            return Response({
                'eco_interests': customer_profile.eco_interests,
                'preferred_categories': customer_profile.preferred_categories,
                'budget_range': customer_profile.budget_range,
                'city': customer_profile.city,
                'state': customer_profile.state,
            })
        except CustomerProfile.DoesNotExist:
            return Response({'error': 'Customer profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def update_preferences(self, request):
        """
        Update customer preferences
        """
        try:
            customer_profile = CustomerProfile.objects.get(user=request.user)
            customer_profile.eco_interests = request.data.get('eco_interests', customer_profile.eco_interests)
            customer_profile.preferred_categories = request.data.get('preferred_categories', customer_profile.preferred_categories)
            customer_profile.budget_range = request.data.get('budget_range', customer_profile.budget_range)
            customer_profile.city = request.data.get('city', customer_profile.city)
            customer_profile.state = request.data.get('state', customer_profile.state)
            customer_profile.save()
            
            return Response({
                'message': 'Preferences updated successfully',
                'preferences': {
                    'eco_interests': customer_profile.eco_interests,
                    'preferred_categories': customer_profile.preferred_categories,
                    'budget_range': customer_profile.budget_range,
                    'city': customer_profile.city,
                    'state': customer_profile.state,
                }
            })
        except CustomerProfile.DoesNotExist:
            return Response({'error': 'Customer profile not found'}, status=status.HTTP_404_NOT_FOUND)


class CustomerAddressViewSet(viewsets.ModelViewSet):
    """
    ViewSet for customer addresses
    """
    serializer_class = CustomerAddressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        customer_profile = CustomerProfile.objects.get(user=self.request.user)
        return CustomerAddress.objects.filter(customer=customer_profile)
    
    def perform_create(self, serializer):
        customer_profile = CustomerProfile.objects.get(user=self.request.user)
        serializer.save(customer=customer_profile)


class CustomerOrderViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for customer orders with comprehensive functionality
    """
    serializer_class = CustomerOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        customer_profile = get_object_or_404(CustomerProfile, user=self.request.user)
        queryset = CustomerOrder.objects.filter(customer=customer_profile)
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(order_status=status_filter)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        if start_date:
            queryset = queryset.filter(created_at__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__date__lte=end_date)
        
        return queryset.order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def cancel_order(self, request, pk=None):
        """
        Cancel an order
        """
        order = self.get_object()
        
        if order.order_status in ['delivered', 'cancelled', 'returned']:
            return Response({
                'error': 'Cannot cancel order with current status'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        order.order_status = 'cancelled'
        order.save()
        
        return Response({
            'message': 'Order cancelled successfully',
            'order_status': order.order_status
        })
    
    @action(detail=True, methods=['post'])
    def request_return(self, request, pk=None):
        """
        Request return for an order
        """
        order = self.get_object()
        
        if order.order_status != 'delivered':
            return Response({
                'error': 'Can only return delivered orders'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        order.order_status = 'returned'
        order.save()
        
        return Response({
            'message': 'Return requested successfully',
            'order_status': order.order_status
        })
    
    @action(detail=True, methods=['get'])
    def tracking_info(self, request, pk=None):
        """
        Get order tracking information
        """
        order = self.get_object()
        
        # Mock tracking info - in real app, this would come from shipping provider
        tracking_info = {
            'order_number': order.order_number,
            'status': order.order_status,
            'estimated_delivery': None,
            'tracking_number': f"TRK{order.order_number}",
            'shipping_provider': 'EcoShip',
            'updates': [
                {
                    'status': 'Order Placed',
                    'timestamp': order.created_at.isoformat(),
                    'location': 'EcoSwitch Warehouse'
                }
            ]
        }
        
        if order.order_status in ['shipped', 'delivered']:
            tracking_info['updates'].append({
                'status': 'Shipped',
                'timestamp': order.updated_at.isoformat(),
                'location': 'EcoSwitch Warehouse'
            })
        
        if order.order_status == 'delivered':
            tracking_info['updates'].append({
                'status': 'Delivered',
                'timestamp': order.updated_at.isoformat(),
                'location': 'Customer Address'
            })
        
        return Response(tracking_info)
    
    @action(detail=False, methods=['post'])
    def create_order(self, request):
        """
        Create a new order
        """
        try:
            customer_profile = CustomerProfile.objects.get(user=request.user)
            
            # Generate order number
            order_number = f"CUST{''.join(random.choices(string.digits, k=8))}"
            
            # Get order data
            items = request.data.get('items', [])
            shipping_address_id = request.data.get('shipping_address_id')
            payment_method = request.data.get('payment_method', 'online')
            
            if not items:
                return Response({'error': 'No items in order'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Calculate totals
            total_amount = sum(item['quantity'] * item['unit_price'] for item in items)
            shipping_cost = 50.0  # Fixed shipping cost
            tax_amount = total_amount * 0.18  # 18% GST
            final_amount = total_amount + shipping_cost + tax_amount
            
            # Create order
            order = CustomerOrder.objects.create(
                customer=customer_profile,
                order_number=order_number,
                total_amount=total_amount,
                shipping_cost=shipping_cost,
                tax_amount=tax_amount,
                payment_method=payment_method,
                order_status='pending',
                payment_status='pending'
            )
            
            # Create order items
            for item in items:
                OrderItem.objects.create(
                    order=order,
                    product_id=item['product_id'],
                    product_name=item['product_name'],
                    product_image=item.get('product_image', ''),
                    quantity=item['quantity'],
                    unit_price=item['unit_price'],
                    total_price=item['quantity'] * item['unit_price']
                )
            
            return Response({
                'message': 'Order created successfully',
                'order': CustomerOrderSerializer(order).data
            }, status=status.HTTP_201_CREATED)
            
        except CustomerProfile.DoesNotExist:
            return Response({'error': 'Customer profile not found'}, status=status.HTTP_404_NOT_FOUND)


class CustomerWishlistViewSet(viewsets.ModelViewSet):
    """
    ViewSet for customer wishlist with comprehensive functionality
    """
    serializer_class = CustomerWishlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        customer_profile = get_object_or_404(CustomerProfile, user=self.request.user)
        return CustomerWishlist.objects.filter(customer=customer_profile)
    
    def perform_create(self, serializer):
        customer_profile = get_object_or_404(CustomerProfile, user=self.request.user)
        serializer.save(customer=customer_profile)
    
    @action(detail=False, methods=['post'])
    def add_product(self, request):
        """
        Add a product to wishlist
        """
        try:
            customer_profile = CustomerProfile.objects.get(user=request.user)
            product_id = request.data.get('product_id')
            product_name = request.data.get('product_name')
            product_image = request.data.get('product_image', '')
            product_price = request.data.get('product_price')
            
            if not all([product_id, product_name, product_price]):
                return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)
            
            wishlist_item, created = CustomerWishlist.objects.get_or_create(
                customer=customer_profile,
                product_id=product_id,
                defaults={
                    'product_name': product_name,
                    'product_image': product_image,
                    'product_price': product_price
                }
            )
            
            if created:
                return Response({
                    'message': 'Product added to wishlist',
                    'item': CustomerWishlistSerializer(wishlist_item).data
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'message': 'Product already in wishlist',
                    'item': CustomerWishlistSerializer(wishlist_item).data
                })
                
        except CustomerProfile.DoesNotExist:
            return Response({'error': 'Customer profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def remove_product(self, request):
        """
        Remove a product from wishlist
        """
        try:
            customer_profile = CustomerProfile.objects.get(user=request.user)
            product_id = request.data.get('product_id')
            
            if not product_id:
                return Response({'error': 'Product ID is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            wishlist_item = CustomerWishlist.objects.filter(
                customer=customer_profile,
                product_id=product_id
            ).first()
            
            if wishlist_item:
                wishlist_item.delete()
                return Response({'message': 'Product removed from wishlist'})
            else:
                return Response({'error': 'Product not found in wishlist'}, status=status.HTTP_404_NOT_FOUND)
                
        except CustomerProfile.DoesNotExist:
            return Response({'error': 'Customer profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def check_product(self, request):
        """
        Check if a product is in wishlist
        """
        try:
            customer_profile = CustomerProfile.objects.get(user=request.user)
            product_id = request.query_params.get('product_id')
            
            if not product_id:
                return Response({'error': 'Product ID is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            is_in_wishlist = CustomerWishlist.objects.filter(
                customer=customer_profile,
                product_id=product_id
            ).exists()
            
            return Response({'is_in_wishlist': is_in_wishlist})
            
        except CustomerProfile.DoesNotExist:
            return Response({'error': 'Customer profile not found'}, status=status.HTTP_404_NOT_FOUND)


class CustomerReviewViewSet(viewsets.ModelViewSet):
    """
    ViewSet for customer reviews
    """
    serializer_class = CustomerReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        customer_profile = CustomerProfile.objects.get(user=self.request.user)
        return CustomerReview.objects.filter(customer=customer_profile)
    
    def perform_create(self, serializer):
        customer_profile = CustomerProfile.objects.get(user=self.request.user)
        serializer.save(customer=customer_profile)


class CustomerRecommendationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for customer recommendations (read-only)
    """
    serializer_class = CustomerRecommendationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        customer_profile = CustomerProfile.objects.get(user=self.request.user)
        return CustomerRecommendation.objects.filter(customer=customer_profile)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def customer_dashboard(request):
    """
    Get customer dashboard data
    """
    try:
        customer_profile = CustomerProfile.objects.get(user=request.user)
    except CustomerProfile.DoesNotExist:
        return Response({'error': 'Customer profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Get date ranges
    today = timezone.now().date()
    month_ago = today - timedelta(days=30)
    
    # Order metrics
    total_orders = CustomerOrder.objects.filter(customer=customer_profile).count()
    month_orders = CustomerOrder.objects.filter(
        customer=customer_profile, 
        created_at__date__gte=month_ago
    ).count()
    
    total_spent = CustomerOrder.objects.filter(customer=customer_profile).aggregate(
        total=Sum('total_amount')
    )['total'] or 0
    
    month_spent = CustomerOrder.objects.filter(
        customer=customer_profile, 
        created_at__date__gte=month_ago
    ).aggregate(total=Sum('total_amount'))['total'] or 0
    
    # Wishlist and reviews
    wishlist_count = CustomerWishlist.objects.filter(customer=customer_profile).count()
    reviews_count = CustomerReview.objects.filter(customer=customer_profile).count()
    
    # Recent orders
    recent_orders = CustomerOrder.objects.filter(customer=customer_profile)[:5]
    
    # Recent recommendations
    recent_recommendations = CustomerRecommendation.objects.filter(
        customer=customer_profile
    ).order_by('-confidence_score')[:5]
    
    # Eco-friendly stats
    eco_orders = CustomerOrder.objects.filter(
        customer=customer_profile,
        items__product__is_eco_friendly=True
    ).distinct().count()
    
    dashboard_data = {
        'customer_info': {
            'user_email': customer_profile.user.email,
            'user_name': f"{customer_profile.user.first_name} {customer_profile.user.last_name}",
            'city': customer_profile.city,
            'budget_range': customer_profile.budget_range,
        },
        'order_metrics': {
            'total_orders': total_orders,
            'month_orders': month_orders,
            'total_spent': float(total_spent),
            'month_spent': float(month_spent),
            'eco_orders': eco_orders,
        },
        'activity_metrics': {
            'wishlist_count': wishlist_count,
            'reviews_count': reviews_count,
        },
        'recent_orders': CustomerOrderSerializer(recent_orders, many=True).data,
        'recent_recommendations': CustomerRecommendationSerializer(recent_recommendations, many=True).data,
    }
    
    return Response(dashboard_data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def browse_products(request):
    """
    Browse products with filtering and search
    """
    try:
        customer_profile = CustomerProfile.objects.get(user=request.user)
    except CustomerProfile.DoesNotExist:
        return Response({'error': 'Customer profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Import here to avoid circular imports
    from merchants.models import MerchantProduct
    
    # Get query parameters
    search = request.query_params.get('search', '')
    category = request.query_params.get('category', '')
    min_price = request.query_params.get('min_price')
    max_price = request.query_params.get('max_price')
    eco_friendly = request.query_params.get('eco_friendly')
    sort_by = request.query_params.get('sort_by', 'created_at')
    sort_order = request.query_params.get('sort_order', 'desc')
    
    # Build queryset
    queryset = MerchantProduct.objects.filter(is_active=True)
    
    # Apply filters
    if search:
        queryset = queryset.filter(
            Q(name__icontains=search) |
            Q(description__icontains=search) |
            Q(brand__icontains=search) |
            Q(category__icontains=search)
        )
    
    if category:
        queryset = queryset.filter(category__iexact=category)
    
    if min_price:
        queryset = queryset.filter(price__gte=min_price)
    
    if max_price:
        queryset = queryset.filter(price__lte=max_price)
    
    if eco_friendly == 'true':
        queryset = queryset.filter(is_eco_friendly=True)
    
    # Apply sorting
    if sort_order == 'desc':
        queryset = queryset.order_by(f'-{sort_by}')
    else:
        queryset = queryset.order_by(sort_by)
    
    # Pagination
    page_size = int(request.query_params.get('page_size', 20))
    page = int(request.query_params.get('page', 1))
    start = (page - 1) * page_size
    end = start + page_size
    
    products = queryset[start:end]
    total_count = queryset.count()
    
    # Serialize products
    from merchants.serializers import MerchantProductSerializer
    product_data = MerchantProductSerializer(products, many=True).data
    
    return Response({
        'products': product_data,
        'total_count': total_count,
        'page': page,
        'page_size': page_size,
        'total_pages': (total_count + page_size - 1) // page_size
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_recommendations(request):
    """
    Get personalized product recommendations
    """
    try:
        customer_profile = CustomerProfile.objects.get(user=request.user)
    except CustomerProfile.DoesNotExist:
        return Response({'error': 'Customer profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Get existing recommendations
    recommendations = CustomerRecommendation.objects.filter(
        customer=customer_profile,
        is_viewed=False
    ).order_by('-confidence_score')[:10]
    
    if not recommendations.exists():
        # Generate new recommendations based on preferences
        from merchants.models import MerchantProduct
        
        # Get products based on customer preferences
        preferred_categories = customer_profile.preferred_categories or []
        eco_interests = customer_profile.eco_interests or []
        
        recommended_products = MerchantProduct.objects.filter(
            is_active=True,
            is_eco_friendly=True
        )
        
        if preferred_categories:
            recommended_products = recommended_products.filter(
                category__in=preferred_categories
            )
        
        # Create recommendation entries
        for product in recommended_products[:10]:
            confidence_score = random.uniform(0.6, 0.9)  # Mock confidence score
            
            CustomerRecommendation.objects.get_or_create(
                customer=customer_profile,
                product_id=str(product.id),
                defaults={
                    'product_name': product.name,
                    'product_image': product.primary_image.url if product.primary_image else '',
                    'product_price': product.price,
                    'recommendation_reason': f"Based on your interest in {', '.join(eco_interests[:2])}",
                    'confidence_score': confidence_score
                }
            )
        
        # Get the newly created recommendations
        recommendations = CustomerRecommendation.objects.filter(
            customer=customer_profile,
            is_viewed=False
        ).order_by('-confidence_score')[:10]
    
    return Response({
        'recommendations': CustomerRecommendationSerializer(recommendations, many=True).data
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_recommendation_viewed(request):
    """
    Mark a recommendation as viewed
    """
    try:
        customer_profile = CustomerProfile.objects.get(user=request.user)
        recommendation_id = request.data.get('recommendation_id')
        
        if not recommendation_id:
            return Response({'error': 'Recommendation ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        recommendation = CustomerRecommendation.objects.get(
            id=recommendation_id,
            customer=customer_profile
        )
        
        recommendation.is_viewed = True
        recommendation.save()
        
        return Response({'message': 'Recommendation marked as viewed'})
        
    except CustomerProfile.DoesNotExist:
        return Response({'error': 'Customer profile not found'}, status=status.HTTP_404_NOT_FOUND)
    except CustomerRecommendation.DoesNotExist:
        return Response({'error': 'Recommendation not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_categories(request):
    """
    Get all available product categories
    """
    from merchants.models import MerchantProduct
    
    categories = MerchantProduct.objects.filter(is_active=True).values_list(
        'category', flat=True
    ).distinct().order_by('category')
    
    return Response({'categories': list(categories)})


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_eco_interests(request):
    """
    Get available eco-friendly interests/tags
    """
    eco_interests = [
        'renewable energy',
        'zero waste',
        'organic',
        'sustainable materials',
        'carbon neutral',
        'biodegradable',
        'recycled',
        'fair trade',
        'local sourcing',
        'minimal packaging'
    ]
    
    return Response({'eco_interests': eco_interests})












