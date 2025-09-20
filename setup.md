# EcoSwitch Complete Setup Guide

This guide will help you set up the complete EcoSwitch platform with Django backend and React frontend, including separate merchant and customer portals.

## Prerequisites

- **Node.js** (v16 or higher)
- **Python** (3.8 or higher)
- **pip** (Python package manager)
- **Git**

## Quick Start

### 1. Backend Setup (Django)

```bash
# Navigate to backend directory
cd Ecoshift/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp env.example .env
# Edit .env file with your settings

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start Django server
python manage.py runserver
```

The Django API will be available at `http://localhost:8000`

### 2. Frontend Setup (React)

```bash
# Navigate to frontend directory (from Ecoshift root)
cd Ecoshift

# Install dependencies
npm install

# Start development server
npm run dev
```

The React app will be available at `http://localhost:5173`

## Features Overview

### 🔐 Authentication System
- **JWT-based authentication** with secure token management
- **Email verification** for new accounts
- **Password reset** functionality
- **Role-based access** (Merchant vs Customer)

### 🏪 Merchant Portal
- **Dashboard** with sales analytics and metrics
- **Product Management** - Add, edit, delete products
- **Order Management** - View and update order status
- **Analytics** - Sales reports and performance metrics
- **Profile Management** - Business information and settings

### 🛍️ Customer Portal
- **Dashboard** with order history and recommendations
- **Order Tracking** - View order status and history
- **Wishlist** - Save favorite products
- **Personalized Recommendations** - AI-powered product suggestions
- **Address Management** - Multiple shipping addresses
- **Profile Settings** - Personal information and preferences

### 🌱 Product Features
- **Eco-friendly Product Catalog** with sustainability scores
- **Advanced Search & Filtering** by category, brand, price, etc.
- **Product Reviews & Ratings** system
- **Product Variants** (size, color, etc.)
- **Featured & Trending Products**

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile

### Merchants
- `GET /api/merchants/dashboard/` - Dashboard data
- `GET /api/merchants/products/` - List products
- `POST /api/merchants/products/` - Create product
- `GET /api/merchants/orders/` - List orders

### Customers
- `GET /api/customers/dashboard/` - Dashboard data
- `GET /api/customers/orders/` - List orders
- `GET /api/customers/wishlist/` - Wishlist items
- `GET /api/customers/recommendations/` - Recommendations

### Products
- `GET /api/products/products/` - List all products
- `GET /api/products/search/` - Search products
- `GET /api/products/featured/` - Featured products

## User Types

### 👤 Customer
- Browse and search eco-friendly products
- Add products to wishlist
- Place orders and track them
- Get personalized recommendations
- Write product reviews
- Manage shipping addresses

### 🏪 Merchant
- Add and manage product catalog
- Process customer orders
- View sales analytics and reports
- Manage business profile
- Track inventory levels

## Database Schema

The system uses Django models with the following key entities:

- **User** - Base user model with authentication
- **MerchantProfile** - Extended merchant information
- **CustomerProfile** - Extended customer information
- **Product** - Product catalog with eco-friendly attributes
- **Order** - Order management for both merchants and customers
- **Review** - Product review system
- **Recommendation** - Personalized product recommendations

## Environment Configuration

### Backend (.env)
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend
The frontend automatically connects to `http://localhost:8000` for API calls.

## Testing the System

### 1. Create Test Accounts

**Merchant Account:**
- Register as "Merchant" user type
- Complete merchant profile setup
- Access merchant portal at `/merchant-portal`

**Customer Account:**
- Register as "Customer" user type
- Complete customer profile setup
- Access customer portal at `/customer-portal`

### 2. Test Features

**Merchant Portal:**
- Add sample products
- View dashboard analytics
- Process test orders

**Customer Portal:**
- Browse products
- Add items to wishlist
- Place test orders
- View recommendations

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure CORS_ALLOWED_ORIGINS includes your frontend URL
   - Check that Django server is running on port 8000

2. **Authentication Issues**
   - Verify JWT tokens are being stored in localStorage
   - Check that API endpoints are accessible

3. **Database Issues**
   - Run migrations: `python manage.py migrate`
   - Check database connection settings

4. **Frontend Build Issues**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

## Production Deployment

### Backend
1. Set `DEBUG=False`
2. Configure production database (PostgreSQL)
3. Set up Redis for Celery
4. Configure email backend
5. Set up static file serving

### Frontend
1. Build production bundle: `npm run build`
2. Deploy to CDN or static hosting
3. Update API endpoints for production

## Support

For issues and questions:
- Check the Django logs in the terminal
- Verify API responses in browser dev tools
- Ensure all dependencies are installed correctly

## Next Steps

1. **Customize the UI** - Modify colors, fonts, and layout
2. **Add Payment Integration** - Integrate with payment gateways
3. **Implement Real-time Features** - Add WebSocket support
4. **Add Mobile App** - Create React Native mobile app
5. **Deploy to Cloud** - Deploy to AWS, Google Cloud, or Heroku

---

**Happy coding! 🌿**

















