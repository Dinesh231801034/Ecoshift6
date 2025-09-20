from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q, Sum, Count, Avg
from django.utils import timezone
from django.shortcuts import get_object_or_404
from datetime import timedelta
from .models import MerchantProfile, MerchantProduct, MerchantOrder, OrderItem, MerchantAnalytics
from .serializers import (
    MerchantProfileSerializer, MerchantProductSerializer, MerchantOrderSerializer,
    OrderItemSerializer, MerchantAnalyticsSerializer
)


class MerchantProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for merchant profiles
    """
    serializer_class = MerchantProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return MerchantProfile.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MerchantProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for merchant products with comprehensive functionality
    """
    serializer_class = MerchantProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        merchant_profile = get_object_or_404(MerchantProfile, user=self.request.user)
        queryset = MerchantProduct.objects.filter(merchant=merchant_profile)
        
        # Search functionality
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(description__icontains=search) |
                Q(category__icontains=search) |
                Q(brand__icontains=search)
            )
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__iexact=category)
        
        # Filter by status
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        # Filter by stock status
        stock_status = self.request.query_params.get('stock_status', None)
        if stock_status == 'low':
            queryset = queryset.filter(stock_quantity__lt=10)
        elif stock_status == 'out':
            queryset = queryset.filter(stock_quantity=0)
        
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        merchant_profile = get_object_or_404(MerchantProfile, user=self.request.user)
        serializer.save(merchant=merchant_profile)
    
    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        """
        Toggle product active status
        """
        product = self.get_object()
        product.is_active = not product.is_active
        product.save()
        return Response({
            'message': f'Product {"activated" if product.is_active else "deactivated"} successfully',
            'is_active': product.is_active
        })
    
    @action(detail=True, methods=['post'])
    def update_stock(self, request, pk=None):
        """
        Update product stock quantity
        """
        product = self.get_object()
        quantity = request.data.get('quantity')
        
        if quantity is None:
            return Response({'error': 'Quantity is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            quantity = int(quantity)
            if quantity < 0:
                return Response({'error': 'Quantity cannot be negative'}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({'error': 'Invalid quantity format'}, status=status.HTTP_400_BAD_REQUEST)
        
        product.stock_quantity = quantity
        product.save()
        
        return Response({
            'message': 'Stock updated successfully',
            'stock_quantity': product.stock_quantity
        })
    
    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """
        Duplicate a product
        """
        original_product = self.get_object()
        
        # Create a copy
        new_product = MerchantProduct.objects.create(
            merchant=original_product.merchant,
            name=f"{original_product.name} (Copy)",
            description=original_product.description,
            category=original_product.category,
            subcategory=original_product.subcategory,
            price=original_product.price,
            original_price=original_product.original_price,
            sku=f"{original_product.sku}_COPY_{timezone.now().strftime('%Y%m%d%H%M%S')}",
            brand=original_product.brand,
            tags=original_product.tags,
            specifications=original_product.specifications,
            primary_image=original_product.primary_image,
            additional_images=original_product.additional_images,
            stock_quantity=0,  # Start with 0 stock
            min_order_quantity=original_product.min_order_quantity,
            max_order_quantity=original_product.max_order_quantity,
            weight=original_product.weight,
            dimensions=original_product.dimensions,
            shipping_available=original_product.shipping_available,
            free_shipping_threshold=original_product.free_shipping_threshold,
            is_active=False,  # Start as inactive
            is_featured=False,
            is_eco_friendly=original_product.is_eco_friendly,
            eco_certifications=original_product.eco_certifications,
        )
        
        serializer = self.get_serializer(new_product)
        return Response({
            'message': 'Product duplicated successfully',
            'product': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def categories(self, request):
        """
        Get all categories used by merchant products
        """
        merchant_profile = get_object_or_404(MerchantProfile, user=self.request.user)
        categories = MerchantProduct.objects.filter(merchant=merchant_profile).values_list('category', flat=True).distinct()
        return Response({'categories': list(categories)})
    
    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """
        Get products with low stock
        """
        merchant_profile = get_object_or_404(MerchantProfile, user=self.request.user)
        low_stock_products = MerchantProduct.objects.filter(
            merchant=merchant_profile,
            stock_quantity__lt=10,
            is_active=True
        )
        serializer = self.get_serializer(low_stock_products, many=True)
        return Response(serializer.data)


class MerchantOrderViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for merchant orders with comprehensive functionality
    """
    serializer_class = MerchantOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        merchant_profile = get_object_or_404(MerchantProfile, user=self.request.user)
        queryset = MerchantOrder.objects.filter(merchant=merchant_profile)
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        if start_date:
            queryset = queryset.filter(created_at__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__date__lte=end_date)
        
        # Search by order number or customer name
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(order_number__icontains=search) |
                Q(customer_name__icontains=search) |
                Q(customer_email__icontains=search)
            )
        
        return queryset.order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """
        Update order status
        """
        order = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in [choice[0] for choice in MerchantOrder.ORDER_STATUS_CHOICES]:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        order.status = new_status
        order.save()
        
        return Response({
            'message': 'Order status updated successfully',
            'status': order.status
        })
    
    @action(detail=True, methods=['post'])
    def add_note(self, request, pk=None):
        """
        Add a note to an order
        """
        order = self.get_object()
        note = request.data.get('note', '')
        
        if not note:
            return Response({'error': 'Note is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        order.notes = f"{order.notes}\n{note}" if order.notes else note
        order.save()
        
        return Response({'message': 'Note added successfully'})
    
    @action(detail=True, methods=['get'])
    def details(self, request, pk=None):
        """
        Get detailed order information including items
        """
        order = self.get_object()
        serializer = self.get_serializer(order)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def status_counts(self, request):
        """
        Get count of orders by status
        """
        merchant_profile = get_object_or_404(MerchantProfile, user=self.request.user)
        status_counts = MerchantOrder.objects.filter(merchant=merchant_profile).values('status').annotate(
            count=Count('id')
        )
        return Response({'status_counts': list(status_counts)})
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """
        Get recent orders (last 10)
        """
        merchant_profile = get_object_or_404(MerchantProfile, user=self.request.user)
        recent_orders = MerchantOrder.objects.filter(merchant=merchant_profile)[:10]
        serializer = self.get_serializer(recent_orders, many=True)
        return Response(serializer.data)


class MerchantAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for merchant analytics
    """
    serializer_class = MerchantAnalyticsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        merchant_profile = MerchantProfile.objects.get(user=self.request.user)
        return MerchantAnalytics.objects.filter(merchant=merchant_profile)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def merchant_dashboard(request):
    """
    Get merchant dashboard data
    """
    try:
        merchant_profile = MerchantProfile.objects.get(user=request.user)
    except MerchantProfile.DoesNotExist:
        return Response({'error': 'Merchant profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Get date ranges
    today = timezone.now().date()
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)
    
    # Sales metrics
    total_orders = MerchantOrder.objects.filter(merchant=merchant_profile).count()
    week_orders = MerchantOrder.objects.filter(merchant=merchant_profile, created_at__date__gte=week_ago).count()
    month_orders = MerchantOrder.objects.filter(merchant=merchant_profile, created_at__date__gte=month_ago).count()
    
    total_revenue = MerchantOrder.objects.filter(merchant=merchant_profile).aggregate(
        total=Sum('total_amount')
    )['total'] or 0
    
    week_revenue = MerchantOrder.objects.filter(
        merchant=merchant_profile, 
        created_at__date__gte=week_ago
    ).aggregate(total=Sum('total_amount'))['total'] or 0
    
    month_revenue = MerchantOrder.objects.filter(
        merchant=merchant_profile, 
        created_at__date__gte=month_ago
    ).aggregate(total=Sum('total_amount'))['total'] or 0
    
    # Product metrics
    total_products = MerchantProduct.objects.filter(merchant=merchant_profile).count()
    active_products = MerchantProduct.objects.filter(merchant=merchant_profile, is_active=True).count()
    low_stock_products = MerchantProduct.objects.filter(
        merchant=merchant_profile, 
        stock_quantity__lt=10
    ).count()
    
    # Recent orders
    recent_orders = MerchantOrder.objects.filter(merchant=merchant_profile)[:5]
    
    # Top products
    top_products = OrderItem.objects.filter(
        order__merchant=merchant_profile
    ).values('product__name').annotate(
        total_sold=Sum('quantity')
    ).order_by('-total_sold')[:5]
    
    dashboard_data = {
        'merchant_info': {
            'business_name': merchant_profile.business_name,
            'is_verified': merchant_profile.is_verified,
            'is_active': merchant_profile.is_active,
        },
        'sales_metrics': {
            'total_orders': total_orders,
            'week_orders': week_orders,
            'month_orders': month_orders,
            'total_revenue': float(total_revenue),
            'week_revenue': float(week_revenue),
            'month_revenue': float(month_revenue),
        },
        'product_metrics': {
            'total_products': total_products,
            'active_products': active_products,
            'low_stock_products': low_stock_products,
        },
        'recent_orders': MerchantOrderSerializer(recent_orders, many=True).data,
        'top_products': list(top_products),
    }
    
    return Response(dashboard_data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def sales_analytics(request):
    """
    Get detailed sales analytics
    """
    try:
        merchant_profile = MerchantProfile.objects.get(user=request.user)
    except MerchantProfile.DoesNotExist:
        return Response({'error': 'Merchant profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Get date range from query params
    days = int(request.query_params.get('days', 30))
    end_date = timezone.now().date()
    start_date = end_date - timedelta(days=days)
    
    # Daily sales data
    daily_sales = MerchantOrder.objects.filter(
        merchant=merchant_profile,
        created_at__date__range=[start_date, end_date]
    ).extra(
        select={'day': 'date(created_at)'}
    ).values('day').annotate(
        orders=Count('id'),
        revenue=Sum('total_amount')
    ).order_by('day')
    
    # Sales by status
    sales_by_status = MerchantOrder.objects.filter(
        merchant=merchant_profile,
        created_at__date__range=[start_date, end_date]
    ).values('status').annotate(
        count=Count('id'),
        revenue=Sum('total_amount')
    )
    
    # Top selling products
    top_products = OrderItem.objects.filter(
        order__merchant=merchant_profile,
        order__created_at__date__range=[start_date, end_date]
    ).values(
        'product__name', 
        'product__id'
    ).annotate(
        quantity_sold=Sum('quantity'),
        revenue=Sum('total_price')
    ).order_by('-quantity_sold')[:10]
    
    return Response({
        'daily_sales': list(daily_sales),
        'sales_by_status': list(sales_by_status),
        'top_products': list(top_products),
        'date_range': {
            'start_date': start_date,
            'end_date': end_date,
            'days': days
        }
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def product_analytics(request):
    """
    Get detailed product analytics
    """
    try:
        merchant_profile = MerchantProfile.objects.get(user=request.user)
    except MerchantProfile.DoesNotExist:
        return Response({'error': 'Merchant profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Product performance
    products = MerchantProduct.objects.filter(merchant=merchant_profile).annotate(
        total_orders=Count('orderitem__order', distinct=True),
        total_quantity_sold=Sum('orderitem__quantity'),
        total_revenue=Sum('orderitem__total_price')
    ).order_by('-total_revenue')
    
    # Category performance
    category_performance = MerchantProduct.objects.filter(merchant=merchant_profile).values('category').annotate(
        product_count=Count('id'),
        total_revenue=Sum('orderitem__total_price'),
        total_quantity_sold=Sum('orderitem__quantity')
    ).order_by('-total_revenue')
    
    # Stock analysis
    stock_analysis = {
        'total_products': products.count(),
        'active_products': products.filter(is_active=True).count(),
        'low_stock': products.filter(stock_quantity__lt=10).count(),
        'out_of_stock': products.filter(stock_quantity=0).count(),
        'high_stock': products.filter(stock_quantity__gt=100).count(),
    }
    
    return Response({
        'products': MerchantProductSerializer(products, many=True).data,
        'category_performance': list(category_performance),
        'stock_analysis': stock_analysis
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_merchant_profile(request):
    """
    Update merchant profile information
    """
    try:
        merchant_profile = MerchantProfile.objects.get(user=request.user)
    except MerchantProfile.DoesNotExist:
        return Response({'error': 'Merchant profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = MerchantProfileSerializer(merchant_profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Profile updated successfully',
            'profile': serializer.data
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

