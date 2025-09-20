# EcoSwitch Backend

A Django REST API backend for the EcoSwitch e-commerce platform with separate merchant and customer portals.

## Features

- **User Authentication**: JWT-based authentication with email verification
- **Dual Portal System**: Separate portals for merchants and customers
- **Product Management**: Complete product catalog with categories, brands, and variants
- **Order Management**: Order processing and tracking for both merchants and customers
- **Analytics**: Dashboard analytics for merchants
- **Recommendations**: Personalized product recommendations for customers
- **Reviews & Ratings**: Product review system
- **Wishlist**: Customer wishlist functionality

## Setup Instructions

### Prerequisites

- Python 3.8+
- pip
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ecoshift/backend
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Run database migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create a superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Load sample data (optional)**
   ```bash
   python manage.py loaddata fixtures/sample_data.json
   ```

8. **Run the development server**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/verify-email/` - Email verification
- `POST /api/auth/forgot-password/` - Password reset request
- `POST /api/auth/reset-password/` - Password reset
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/update/` - Update user info
- `PUT /api/auth/profile/update/` - Update profile
- `POST /api/auth/change-password/` - Change password

### Merchants
- `GET /api/merchants/profile/` - Get merchant profile
- `POST /api/merchants/profile/` - Create merchant profile
- `PUT /api/merchants/profile/` - Update merchant profile
- `GET /api/merchants/products/` - List merchant products
- `POST /api/merchants/products/` - Create product
- `GET /api/merchants/orders/` - List merchant orders
- `GET /api/merchants/dashboard/` - Dashboard analytics

### Customers
- `GET /api/customers/profile/` - Get customer profile
- `POST /api/customers/profile/` - Create customer profile
- `PUT /api/customers/profile/` - Update customer profile
- `GET /api/customers/orders/` - List customer orders
- `GET /api/customers/wishlist/` - List wishlist items
- `POST /api/customers/wishlist/` - Add to wishlist
- `GET /api/customers/recommendations/` - Get recommendations
- `GET /api/customers/dashboard/` - Dashboard overview

### Products
- `GET /api/products/categories/` - List categories
- `GET /api/products/products/` - List products
- `GET /api/products/search/` - Search products
- `GET /api/products/featured/` - Featured products
- `GET /api/products/trending/` - Trending products

## Database Models

### User Management
- `User` - Custom user model with email as username
- `UserProfile` - Extended user profile information
- `EmailVerification` - Email verification tokens
- `PasswordResetToken` - Password reset tokens

### Merchant Models
- `MerchantProfile` - Merchant business information
- `MerchantProduct` - Products added by merchants
- `MerchantOrder` - Orders received by merchants
- `OrderItem` - Individual items in orders
- `MerchantAnalytics` - Analytics data for merchants

### Customer Models
- `CustomerProfile` - Customer profile information
- `CustomerAddress` - Customer shipping addresses
- `CustomerOrder` - Customer orders
- `CustomerWishlist` - Customer wishlist items
- `CustomerReview` - Product reviews by customers
- `CustomerRecommendation` - Personalized recommendations

### Product Models
- `Category` - Product categories
- `Subcategory` - Product subcategories
- `Brand` - Product brands
- `Product` - Main product model
- `ProductReview` - Product reviews
- `ProductImage` - Product images
- `ProductVariant` - Product variants
- `ProductRecommendation` - Product recommendations

## Development

### Running Tests
```bash
python manage.py test
```

### Code Formatting
```bash
black .
isort .
```

### Database Reset
```bash
python manage.py flush
python manage.py migrate
python manage.py createsuperuser
```

## Deployment

### Production Settings
1. Set `DEBUG=False` in environment variables
2. Configure proper database (PostgreSQL recommended)
3. Set up Redis for Celery
4. Configure email backend
5. Set up static file serving
6. Configure CORS for production domains

### Docker Deployment
```bash
docker-compose up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

















