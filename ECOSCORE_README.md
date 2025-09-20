# 🌱 EcoScore System - Complete Implementation

## Overview

The EcoScore system is a comprehensive environmental impact assessment tool that labels every product with a sustainability score (0-100) and letter grade (A-E). It uses Life Cycle Assessment (LCA) methodology with the ecoinvent database to provide scientifically accurate environmental impact data.

## 🎯 Key Features

### ✅ **Complete Implementation**
- **Product Mapping**: Automatic mapping of products to ecoinvent processes
- **LCA Calculations**: Real environmental impact assessment using Brightway2
- **EcoScore Generation**: 0-100 scale with A-E letter grades
- **Benchmark Normalization**: Fair comparison across product categories
- **Gamification**: User achievements and leaderboards
- **Frontend Integration**: Beautiful UI components and dashboard

### 🌟 **EcoScore Grades**
- **A (80-100)**: 🌱 Highly Sustainable - Excellent environmental performance
- **B (60-79)**: ♻️ Good - Good environmental performance with low impact
- **C (40-59)**: ⚖️ Average - Average environmental performance
- **D (20-39)**: ⚠️ Poor - Poor environmental performance with high impact
- **E (0-19)**: 🚨 Very Poor - Very poor environmental performance

## 🏗️ System Architecture

### Backend Components

#### 1. **Models** (`backend/ecoscore/models.py`)
- `EcoInventProcess`: Ecoinvent database processes
- `ProductEcoMapping`: Maps products to ecoinvent processes
- `EcoScoreBenchmark`: Category benchmarks for normalization
- `EcoScore`: Calculated scores with metadata
- `EcoScoreHistory`: Historical tracking of score changes
- `UserEcoAchievement`: Gamification achievements

#### 2. **Services** (`backend/ecoscore/services.py`)
- `LCACalculationService`: Brightway2 LCA calculations
- `EcoScoreCalculationService`: Score calculation and normalization
- `EcoScoreGamificationService`: Achievement and leaderboard logic

#### 3. **Mapping System** (`backend/ecoscore/mapping_data.py`)
- Pre-defined ecoinvent process mappings
- Category-based mapping rules
- Fallback impact values for missing data

#### 4. **API Endpoints** (`backend/ecoscore/views.py`)
- EcoScore statistics and analytics
- Product filtering by EcoScore
- Leaderboard and achievements
- Real-time score recalculation

#### 5. **Management Commands**
- `setup_ecoscore_data`: Initialize ecoinvent processes and benchmarks
- `calculate_ecoscores`: Calculate scores for all products

### Frontend Components

#### 1. **EcoScoreLabel** (`src/components/EcoScoreLabel.jsx`)
- Visual score display with emojis and colors
- Multiple sizes (small, medium, large)
- Detailed view with score breakdown

#### 2. **EcoScoreDashboard** (`src/components/EcoScoreDashboard.jsx`)
- Statistics overview
- Grade distribution charts
- Top performing categories
- User achievements display

#### 3. **EcoScoreDemo** (`src/pages/EcoScoreDemo.jsx`)
- Interactive demonstration
- Grade guide and methodology
- Sample products with scores

## 🚀 Quick Start

### 1. **Install Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

### 2. **Set Up Database**
```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. **Initialize EcoScore Data**
```bash
python manage.py setup_ecoscore_data
```

### 4. **Calculate EcoScores**
```bash
# Calculate for all products
python manage.py calculate_ecoscores

# Calculate for specific category
python manage.py calculate_ecoscores --category "Clothing"

# Force recalculation
python manage.py calculate_ecoscores --force
```

### 5. **Start the Application**
```bash
# Backend
python manage.py runserver

# Frontend
npm run dev
```

## 📊 How EcoScore Works

### Step 1: Product Mapping
Each product is automatically mapped to the closest ecoinvent process based on:
- Product category and subcategory
- Product name and tags
- Eco-friendly attributes
- Material composition

### Step 2: Impact Calculation
Using Brightway2 and ecoinvent database:
```python
# Example calculation
lca = LCA({process: functional_unit}, method)
lca.lci()  # Life Cycle Inventory
lca.lcia()  # Life Cycle Impact Assessment
impact = lca.score  # kg CO2-eq
```

### Step 3: Normalization
Impact values are normalized against category benchmarks:
```python
normalized_impact = raw_impact / benchmark_impact
```

### Step 4: Scoring
Convert to 0-100 scale with letter grades:
```python
score = max(0, 100 - (normalized_impact * 100))
grade = 'A' if score >= 80 else 'B' if score >= 60 else ...
```

## 🎮 Gamification Features

### Achievements
- **Green Shopper**: 70%+ high eco items in cart
- **Eco Champion**: 90%+ A grade items
- **Carbon Reducer**: Save 10+ kg CO2
- **Sustainability Leader**: Consistent eco-friendly choices

### Leaderboards
- Top eco-friendly shoppers
- Most CO2 saved
- Achievement counts
- Category-specific rankings

## 🔧 API Usage

### Get EcoScore Statistics
```javascript
GET /api/ecoscore/ecoscores/stats/
```

### Filter Products by EcoScore
```javascript
GET /api/ecoscore/products-ecoscore/?grade=A&min_score=80
```

### Check User Achievements
```javascript
POST /api/ecoscore/gamification/check-achievements/
{
  "cart_items": [
    {
      "ecoscore_grade": "A",
      "co2_saved": 2.5
    }
  ]
}
```

## 📈 Sample Data

The system includes comprehensive sample data:

### Ecoinvent Processes (23 processes)
- Food & Beverages: Organic food, bottles, glass containers
- Textiles: Cotton t-shirts, organic cotton, polyester, jeans
- Electronics: LED bulbs, smartphones, laptops, tablets
- Personal Care: Bamboo toothbrushes, shampoo bars, sunscreen
- Cleaning: Eco detergents, bamboo sponges

### Benchmarks (6 categories)
- Food & Beverages: 2.0 kg CO2-eq/kg
- Clothing & Textiles: 5.0 kg CO2-eq/item
- Electronics: 50.0 kg CO2-eq/item
- Home & Garden: 1.0 kg CO2-eq/item
- Personal Care: 0.5 kg CO2-eq/item
- Cleaning Products: 1.5 kg CO2-eq/item

## 🎨 Frontend Integration

### Product Cards
EcoScore labels are automatically displayed on product cards:
```jsx
<EcoScoreLabel 
  score={85} 
  grade="A" 
  size="small"
  showDetails={true}
/>
```

### Dashboard
Comprehensive analytics and user engagement:
- Real-time statistics
- Grade distribution charts
- Achievement tracking
- Leaderboard rankings

## 🔬 Scientific Accuracy

### LCA Methodology
- **Standard**: IPCC 2013 - Climate Change - GWP 100a
- **Database**: Ecoinvent 3.9
- **Tool**: Brightway2
- **Scope**: Cradle-to-gate (production to retail)

### Quality Assurance
- Fallback values for missing data
- Confidence scoring for mappings
- Manual override capabilities
- Historical tracking of changes

## 🚀 Future Enhancements

### Planned Features
- **Multi-impact Categories**: Water, land use, toxicity
- **Regional Variations**: Location-specific impacts
- **Real-time Updates**: Dynamic score recalculation
- **Machine Learning**: Improved product mapping
- **Supply Chain**: End-to-end impact tracking

### Integration Opportunities
- **E-commerce Platforms**: Shopify, WooCommerce plugins
- **Mobile Apps**: React Native components
- **Analytics**: Google Analytics, Mixpanel integration
- **Certifications**: B-Corp, Cradle to Cradle integration

## 📚 Documentation

### Key Files
- `backend/ecoscore/models.py` - Database models
- `backend/ecoscore/services.py` - Business logic
- `backend/ecoscore/mapping_data.py` - Product mappings
- `src/components/EcoScoreLabel.jsx` - UI component
- `src/pages/EcoScoreDemo.jsx` - Demo page

### Management Commands
- `setup_ecoscore_data` - Initialize system
- `calculate_ecoscores` - Calculate scores
- `populate_sample_data` - Add demo products

## 🎯 Success Metrics

The EcoScore system enables:
- **Transparency**: Clear environmental impact visibility
- **Education**: User understanding of sustainability
- **Behavior Change**: Incentivized eco-friendly choices
- **Business Value**: Competitive advantage for sustainable products
- **Impact Measurement**: Quantified environmental benefits

## 🌍 Environmental Impact

By implementing EcoScore, we enable:
- **Informed Decisions**: Users choose products with lower environmental impact
- **Market Transformation**: Demand for sustainable products increases
- **Carbon Reduction**: Measurable CO2 savings through better choices
- **Education**: Users learn about environmental impact of products
- **Transparency**: Companies are incentivized to improve sustainability

---

**The EcoScore system is now fully implemented and ready to transform how users make sustainable purchasing decisions! 🌱**
