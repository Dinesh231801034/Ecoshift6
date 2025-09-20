// Mock data with exact products and their real EcoScores
const ecoscoreProducts = [
  {
    id: 1,
    name: "Organic Cotton Tote Bag",
    description: "Eco-friendly cotton tote bag perfect for shopping and daily use",
    short_description: "Sustainable cotton tote bag",
    category: "Fashion & Accessories",
    category_name: "Fashion & Accessories",
    brand: "EcoStyle",
    brand_name: "EcoStyle",
    price: 299.00,
    original_price: 399.00,
    discount_percentage: 25,
    is_eco_friendly: true,
    eco_certifications: ["GOTS Certified", "Organic Cotton"],
    eco_rating: 5,
    sustainability_score: 95,
    tags: ["organic", "cotton", "reusable", "sustainable"],
    images: [
      {
        id: 1,
        image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
        alt_text: "Organic Cotton Tote Bag"
      }
    ],
    // EcoScore data
    ecoscore_value: 90.0,
    ecoscore_grade: "A",
    ecoscore_last_calculated: "2025-09-20T10:39:12.168088Z",
    ecoscore_calculation_version: "1.0",
    ecoscore: {
      id: 1,
      score_value: 90.0,
      score_grade: "A",
      raw_impact: 0.3,
      impact_unit: "kg CO2-eq",
      normalized_impact: 0.1,
      calculation_date: "2025-09-20T10:39:12.168088Z"
    }
  },
  {
    id: 2,
    name: "Reusable Water Bottle",
    description: "Stainless steel water bottle with bamboo cap - perfect for daily hydration",
    short_description: "Stainless steel water bottle with bamboo cap",
    category: "Kitchen & Dining",
    category_name: "Kitchen & Dining",
    brand: "AquaEco",
    brand_name: "AquaEco",
    price: 599.00,
    original_price: 799.00,
    discount_percentage: 25,
    is_eco_friendly: true,
    eco_certifications: ["BPA Free", "Food Grade"],
    eco_rating: 5,
    sustainability_score: 92,
    tags: ["stainless steel", "bamboo", "reusable", "BPA free"],
    images: [
      {
        id: 2,
        image_url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop",
        alt_text: "Reusable Water Bottle"
      }
    ],
    // EcoScore data
    ecoscore_value: 90.0,
    ecoscore_grade: "A",
    ecoscore_last_calculated: "2025-09-20T10:39:12.168088Z",
    ecoscore_calculation_version: "1.0",
    ecoscore: {
      id: 2,
      score_value: 90.0,
      score_grade: "A",
      raw_impact: 0.1,
      impact_unit: "kg CO2-eq",
      normalized_impact: 0.05,
      calculation_date: "2025-09-20T10:39:12.168088Z"
    }
  },
  {
    id: 5,
    name: "LED Solar Garden Lights",
    description: "Set of 6 solar-powered LED garden lights with automatic dusk-to-dawn operation",
    short_description: "Solar-powered LED garden lights",
    category: "Home & Garden",
    category_name: "Home & Garden",
    brand: "SolarEco",
    brand_name: "SolarEco",
    price: 899.00,
    original_price: 1199.00,
    discount_percentage: 25,
    is_eco_friendly: true,
    eco_certifications: ["Solar Certified", "Energy Star"],
    eco_rating: 5,
    sustainability_score: 88,
    tags: ["solar", "LED", "garden", "renewable energy"],
    images: [
      {
        id: 5,
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop",
        alt_text: "LED Solar Garden Lights"
      }
    ],
    // EcoScore data
    ecoscore_value: 85.0,
    ecoscore_grade: "A",
    ecoscore_last_calculated: "2025-09-20T10:39:12.168088Z",
    ecoscore_calculation_version: "1.0",
    ecoscore: {
      id: 5,
      score_value: 85.0,
      score_grade: "A",
      raw_impact: 0.15,
      impact_unit: "kg CO2-eq",
      normalized_impact: 0.15,
      calculation_date: "2025-09-20T10:39:12.168088Z"
    }
  },
  {
    id: 6,
    name: "Organic Cotton T-Shirt",
    description: "100% organic cotton t-shirt made with sustainable farming practices",
    short_description: "Organic cotton t-shirt",
    category: "Fashion & Accessories",
    category_name: "Fashion & Accessories",
    brand: "GreenWear",
    brand_name: "GreenWear",
    price: 799.00,
    original_price: 999.00,
    discount_percentage: 20,
    is_eco_friendly: true,
    eco_certifications: ["GOTS Certified", "Fair Trade"],
    eco_rating: 4,
    sustainability_score: 78,
    tags: ["organic cotton", "fair trade", "sustainable"],
    images: [
      {
        id: 6,
        image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
        alt_text: "Organic Cotton T-Shirt"
      }
    ],
    // EcoScore data
    ecoscore_value: 70.0,
    ecoscore_grade: "B",
    ecoscore_last_calculated: "2025-09-20T10:39:12.168088Z",
    ecoscore_calculation_version: "1.0",
    ecoscore: {
      id: 6,
      score_value: 70.0,
      score_grade: "B",
      raw_impact: 2.1,
      impact_unit: "kg CO2-eq",
      normalized_impact: 0.3,
      calculation_date: "2025-09-20T10:39:12.168088Z"
    }
  },
  {
    id: 7,
    name: "Recycled Plastic Water Bottle",
    description: "Water bottle made from 100% recycled plastic with BPA-free materials",
    short_description: "Recycled plastic water bottle",
    category: "Kitchen & Dining",
    category_name: "Kitchen & Dining",
    brand: "RecyclePro",
    brand_name: "RecyclePro",
    price: 399.00,
    original_price: 499.00,
    discount_percentage: 20,
    is_eco_friendly: true,
    eco_certifications: ["Recycled Content", "BPA Free"],
    eco_rating: 3,
    sustainability_score: 65,
    tags: ["recycled plastic", "BPA free", "reusable"],
    images: [
      {
        id: 7,
        image_url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop",
        alt_text: "Recycled Plastic Water Bottle"
      }
    ],
    // EcoScore data
    ecoscore_value: 45.0,
    ecoscore_grade: "C",
    ecoscore_last_calculated: "2025-09-20T10:39:12.168088Z",
    ecoscore_calculation_version: "1.0",
    ecoscore: {
      id: 7,
      score_value: 45.0,
      score_grade: "C",
      raw_impact: 0.55,
      impact_unit: "kg CO2-eq",
      normalized_impact: 0.55,
      calculation_date: "2025-09-20T10:39:12.168088Z"
    }
  },
  {
    id: 8,
    name: "Conventional Plastic Bottle",
    description: "Standard plastic water bottle made from virgin plastic materials",
    short_description: "Standard plastic water bottle",
    category: "Kitchen & Dining",
    category_name: "Kitchen & Dining",
    brand: "PlastiCorp",
    brand_name: "PlastiCorp",
    price: 99.00,
    original_price: 149.00,
    discount_percentage: 33,
    is_eco_friendly: false,
    eco_certifications: [],
    eco_rating: 1,
    sustainability_score: 25,
    tags: ["plastic", "disposable", "conventional"],
    images: [
      {
        id: 8,
        image_url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop",
        alt_text: "Conventional Plastic Bottle"
      }
    ],
    // EcoScore data
    ecoscore_value: 15.0,
    ecoscore_grade: "D",
    ecoscore_last_calculated: "2025-09-20T10:39:12.168088Z",
    ecoscore_calculation_version: "1.0",
    ecoscore: {
      id: 8,
      score_value: 15.0,
      score_grade: "D",
      raw_impact: 0.85,
      impact_unit: "kg CO2-eq",
      normalized_impact: 0.85,
      calculation_date: "2025-09-20T10:39:12.168088Z"
    }
  },
  {
    id: 9,
    name: "Compostable Food Containers",
    description: "Set of 20 compostable food containers made from plant-based materials",
    short_description: "Compostable food containers",
    category: "Kitchen & Dining",
    category_name: "Kitchen & Dining",
    brand: "BioBox",
    brand_name: "BioBox",
    price: 249.00,
    original_price: 349.00,
    discount_percentage: 28,
    is_eco_friendly: true,
    eco_certifications: ["Compostable Certified", "Plant-Based"],
    eco_rating: 5,
    sustainability_score: 92,
    tags: ["compostable", "plant-based", "biodegradable"],
    images: [
      {
        id: 9,
        image_url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop",
        alt_text: "Compostable Food Containers"
      }
    ],
    // EcoScore data
    ecoscore_value: 95.0,
    ecoscore_grade: "A",
    ecoscore_last_calculated: "2025-09-20T10:39:12.168088Z",
    ecoscore_calculation_version: "1.0",
    ecoscore: {
      id: 9,
      score_value: 95.0,
      score_grade: "A",
      raw_impact: 0.05,
      impact_unit: "kg CO2-eq",
      normalized_impact: 0.05,
      calculation_date: "2025-09-20T10:39:12.168088Z"
    }
  },
  {
    id: 10,
    name: "Energy-Efficient LED Bulb",
    description: "10W LED bulb with 60W equivalent brightness and 25,000 hour lifespan",
    short_description: "Energy-efficient LED bulb",
    category: "Home & Garden",
    category_name: "Home & Garden",
    brand: "EcoLight",
    brand_name: "EcoLight",
    price: 199.00,
    original_price: 299.00,
    discount_percentage: 33,
    is_eco_friendly: true,
    eco_certifications: ["Energy Star", "RoHS Compliant"],
    eco_rating: 4,
    sustainability_score: 82,
    tags: ["LED", "energy efficient", "long lasting"],
    images: [
      {
        id: 10,
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop",
        alt_text: "Energy-Efficient LED Bulb"
      }
    ],
    // EcoScore data
    ecoscore_value: 80.0,
    ecoscore_grade: "A",
    ecoscore_last_calculated: "2025-09-20T10:39:12.168088Z",
    ecoscore_calculation_version: "1.0",
    ecoscore: {
      id: 10,
      score_value: 80.0,
      score_grade: "A",
      raw_impact: 0.2,
      impact_unit: "kg CO2-eq",
      normalized_impact: 0.2,
      calculation_date: "2025-09-20T10:39:12.168088Z"
    }
  },
  {
    id: 11,
    name: "Hemp Shopping Bag",
    description: "Durable hemp shopping bag with reinforced handles and eco-friendly design",
    short_description: "Durable hemp shopping bag",
    category: "Fashion & Accessories",
    category_name: "Fashion & Accessories",
    brand: "HempLife",
    brand_name: "HempLife",
    price: 449.00,
    original_price: 599.00,
    discount_percentage: 25,
    is_eco_friendly: true,
    eco_certifications: ["Hemp Certified", "Organic"],
    eco_rating: 4,
    sustainability_score: 76,
    tags: ["hemp", "shopping bag", "durable", "organic"],
    images: [
      {
        id: 11,
        image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
        alt_text: "Hemp Shopping Bag"
      }
    ],
    // EcoScore data
    ecoscore_value: 65.0,
    ecoscore_grade: "B",
    ecoscore_last_calculated: "2025-09-20T10:39:12.168088Z",
    ecoscore_calculation_version: "1.0",
    ecoscore: {
      id: 11,
      score_value: 65.0,
      score_grade: "B",
      raw_impact: 0.35,
      impact_unit: "kg CO2-eq",
      normalized_impact: 0.35,
      calculation_date: "2025-09-20T10:39:12.168088Z"
    }
  },
  {
    id: 12,
    name: "Traditional Plastic Bag",
    description: "Standard single-use plastic shopping bag",
    short_description: "Single-use plastic shopping bag",
    category: "Fashion & Accessories",
    category_name: "Fashion & Accessories",
    brand: "PlastiBag",
    brand_name: "PlastiBag",
    price: 5.00,
    original_price: 10.00,
    discount_percentage: 50,
    is_eco_friendly: false,
    eco_certifications: [],
    eco_rating: 1,
    sustainability_score: 10,
    tags: ["plastic", "single-use", "disposable"],
    images: [
      {
        id: 12,
        image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
        alt_text: "Traditional Plastic Bag"
      }
    ],
    // EcoScore data
    ecoscore_value: 5.0,
    ecoscore_grade: "E",
    ecoscore_last_calculated: "2025-09-20T10:39:12.168088Z",
    ecoscore_calculation_version: "1.0",
    ecoscore: {
      id: 12,
      score_value: 5.0,
      score_grade: "E",
      raw_impact: 0.95,
      impact_unit: "kg CO2-eq",
      normalized_impact: 0.95,
      calculation_date: "2025-09-20T10:39:12.168088Z"
    }
  }
];

export default ecoscoreProducts;
