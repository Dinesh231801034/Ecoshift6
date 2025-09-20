from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('login/', views.CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', views.logout, name='logout'),
    path('verify-email/', views.verify_email, name='verify_email'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('reset-password/', views.reset_password, name='reset_password'),
    path('profile/', views.UserProfileView.as_view(), name='user_profile'),
    path('update/', views.UserUpdateView.as_view(), name='user_update'),
    path('profile/update/', views.ProfileUpdateView.as_view(), name='profile_update'),
    path('change-password/', views.change_password, name='change_password'),
]

















