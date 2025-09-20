"""
Views for EcoScore app
"""
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Avg, Count, Q
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

from .models import (
    EcoInventProcess, ProductEcoMapping, EcoScoreBenchmark, 
    EcoScore, EcoScoreHistory, UserEcoAchievement
)
from merchants.models import MerchantProduct
from .serializers import (
    EcoInventProcessSerializer, ProductEcoMappingSerializer,
    EcoScoreBenchmarkSerializer, EcoScoreSerializer,
    EcoScoreHistorySerializer, UserEcoAchievementSerializer,
    ProductEcoScoreSummarySerializer, MerchantProductEcoScoreSummarySerializer,
    EcoScoreLeaderboardSerializer, EcoScoreStatsSerializer
)
from .services import EcoScoreCalculationService, EcoScoreGamificationService
from products.models import Product
from merchants.models import MerchantProduct

User = get_user_model()


class EcoInventProcessViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for EcoInventProcess"""
    queryset = EcoInventProcess.objects.filter(is_active=True)
    serializer_class = EcoInventProcessSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get processes grouped by category"""
        category = request.query_params.get('category')
        if category:
            processes = self.queryset.filter(category__icontains=category)
        else:
            processes = self.queryset
        
        # Group by category
        categories = {}
        for process in processes:
            if process.category not in categories:
                categories[process.category] = []
            categories[process.category].append(
                EcoInventProcessSerializer(process).data
            )
        
        return Response(categories)


class EcoScoreViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for EcoScore"""
    queryset = EcoScore.objects.all()
    serializer_class = EcoScoreSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        product_id = self.request.query_params.get('product_id')
        merchant_product_id = self.request.query_params.get('merchant_product_id')
        grade = self.request.query_params.get('grade')
        
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        if merchant_product_id:
            queryset = queryset.filter(merchant_product_id=merchant_product_id)
        if grade:
            queryset = queryset.filter(score_grade=grade)
        
        return queryset.order_by('-calculation_date')
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get EcoScore statistics"""
        # Basic stats
        total_products = Product.objects.count() + MerchantProduct.objects.count()
        products_with_ecoscore = EcoScore.objects.values('product', 'merchant_product').distinct().count()
        
        # Average EcoScore
        avg_ecoscore = EcoScore.objects.aggregate(avg=Avg('score_value'))['avg'] or 0
        
        # Grade distribution
        grade_distribution = {}
        for grade in ['A', 'B', 'C', 'D', 'E']:
            count = EcoScore.objects.filter(score_grade=grade).count()
            grade_distribution[grade] = count
        
        # Category breakdown
        category_breakdown = {}
        for score in EcoScore.objects.select_related('benchmark'):
            category = score.benchmark.category
            if category not in category_breakdown:
                category_breakdown[category] = {'count': 0, 'avg_score': 0}
            category_breakdown[category]['count'] += 1
        
        # Calculate average scores per category
        for category in category_breakdown:
            avg_score = EcoScore.objects.filter(
                benchmark__category=category
            ).aggregate(avg=Avg('score_value'))['avg'] or 0
            category_breakdown[category]['avg_score'] = round(avg_score, 1)
        
        # Top performing categories
        top_categories = sorted(
            category_breakdown.items(),
            key=lambda x: x[1]['avg_score'],
            reverse=True
        )[:5]
        
        # Recent calculations (last 7 days)
        recent_calculations = EcoScore.objects.filter(
            calculation_date__gte=timezone.now() - timedelta(days=7)
        ).count()
        
        stats_data = {
            'total_products': total_products,
            'products_with_ecoscore': products_with_ecoscore,
            'average_ecoscore': round(avg_ecoscore, 1),
            'grade_distribution': grade_distribution,
            'category_breakdown': category_breakdown,
            'top_performing_categories': [cat[0] for cat in top_categories],
            'recent_calculations': recent_calculations
        }
        
        serializer = EcoScoreStatsSerializer(stats_data)
        return Response(serializer.data)


class ProductEcoScoreViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for products with EcoScore data"""
    queryset = MerchantProduct.objects.all()
    serializer_class = MerchantProductEcoScoreSummarySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        grade = self.request.query_params.get('grade')
        min_score = self.request.query_params.get('min_score')
        max_score = self.request.query_params.get('max_score')
        category = self.request.query_params.get('category')
        
        if grade:
            queryset = queryset.filter(ecoscore_grade=grade)
        if min_score:
            queryset = queryset.filter(ecoscore_value__gte=float(min_score))
        if max_score:
            queryset = queryset.filter(ecoscore_value__lte=float(max_score))
        if category:
            queryset = queryset.filter(category__icontains=category)
        
        return queryset.filter(ecoscore_value__gt=0).order_by('-ecoscore_value')
    
    @action(detail=True, methods=['post'])
    def recalculate_ecoscore(self, request, pk=None):
        """Recalculate EcoScore for a specific product"""
        product = self.get_object()
        calculation_service = EcoScoreCalculationService()
        
        try:
            ecoscore = calculation_service.calculate_product_ecoscore(product, force=True)
            if ecoscore:
                return Response({
                    'message': 'EcoScore recalculated successfully',
                    'ecoscore': EcoScoreSerializer(ecoscore).data
                })
            else:
                return Response({
                    'error': 'Could not calculate EcoScore'
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'error': f'Error recalculating EcoScore: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EcoScoreGamificationView(generics.GenericAPIView):
    """View for EcoScore gamification features"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Check and award achievements based on cart items"""
        cart_items = request.data.get('cart_items', [])
        
        if not cart_items:
            return Response({
                'error': 'No cart items provided'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        gamification_service = EcoScoreGamificationService()
        
        try:
            gamification_service.check_achievements(request.user, cart_items)
            
            # Get updated achievements
            achievements = UserEcoAchievement.objects.filter(
                user=request.user,
                is_earned=True
            )
            
            return Response({
                'message': 'Achievements checked successfully',
                'achievements': UserEcoAchievementSerializer(achievements, many=True).data
            })
        except Exception as e:
            return Response({
                'error': f'Error checking achievements: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)