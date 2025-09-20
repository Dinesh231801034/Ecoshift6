// Mock store data with locations and product catalogs
const mockStores = [
  {
    id: 1,
    name: "EcoSwitch Bangalore Central",
    address: "MG Road, Brigade Road, Bangalore, Karnataka 560001",
    phone: "+91 80 1234 5678",
    email: "bangalore@ecoswitch.com",
    website: "https://ecoswitch.com/bangalore",
    latitude: 12.9716,
    longitude: 77.5946,
    rating: 4.5,
    reviewCount: 128,
    openingHours: {
      monday: "9:00 AM - 9:00 PM",
      tuesday: "9:00 AM - 9:00 PM",
      wednesday: "9:00 AM - 9:00 PM",
      thursday: "9:00 AM - 9:00 PM",
      friday: "9:00 AM - 10:00 PM",
      saturday: "9:00 AM - 10:00 PM",
      sunday: "10:00 AM - 8:00 PM"
    },
    isOpen: true,
    distance: 0, // Will be calculated dynamically
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop",
    description: "Our flagship store in the heart of Bangalore, featuring the latest eco-friendly products and sustainable alternatives.",
    features: ["Free WiFi", "Parking Available", "Wheelchair Accessible", "Product Demos"],
    products: [
      {
        id: 101,
        name: "Organic Cotton Tote Bag",
        price: 299.00,
        originalPrice: 399.00,
        discount: 25,
        stock: 15,
        ecoscore: "A",
        ecoscoreValue: 90.0,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
        category: "Fashion & Accessories",
        brand: "EcoStyle",
        features: ["GOTS Certified", "Organic Cotton", "Machine Washable"]
      },
      {
        id: 102,
        name: "Bamboo Cutlery Set",
        price: 199.00,
        originalPrice: 299.00,
        discount: 33,
        stock: 8,
        ecoscore: "C",
        ecoscoreValue: 50.0,
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
        category: "Kitchen & Dining",
        brand: "BambooLife",
        features: ["Biodegradable", "BPA Free", "Travel Friendly"]
      },
      {
        id: 103,
        name: "LED Solar Garden Lights",
        price: 899.00,
        originalPrice: 1199.00,
        discount: 25,
        stock: 5,
        ecoscore: "A",
        ecoscoreValue: 85.0,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
        category: "Home & Garden",
        brand: "SolarEco",
        features: ["Solar Powered", "Auto Dusk-to-Dawn", "Weather Resistant"]
      }
    ]
  },
  {
    id: 2,
    name: "EcoSwitch Mumbai Marine Drive",
    address: "Marine Drive, Churchgate, Mumbai, Maharashtra 400020",
    phone: "+91 22 1234 5678",
    email: "mumbai@ecoswitch.com",
    website: "https://ecoswitch.com/mumbai",
    latitude: 18.9409,
    longitude: 72.8255,
    rating: 4.3,
    reviewCount: 95,
    openingHours: {
      monday: "10:00 AM - 9:00 PM",
      tuesday: "10:00 AM - 9:00 PM",
      wednesday: "10:00 AM - 9:00 PM",
      thursday: "10:00 AM - 9:00 PM",
      friday: "10:00 AM - 10:00 PM",
      saturday: "10:00 AM - 10:00 PM",
      sunday: "11:00 AM - 8:00 PM"
    },
    isOpen: true,
    distance: 0,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop",
    description: "Located on the iconic Marine Drive, our Mumbai store offers premium eco-friendly products with a stunning sea view.",
    features: ["Sea View", "Valet Parking", "Premium Lounge", "Personal Shopper"],
    products: [
      {
        id: 201,
        name: "Reusable Water Bottle",
        price: 599.00,
        originalPrice: 799.00,
        discount: 25,
        stock: 12,
        ecoscore: "A",
        ecoscoreValue: 90.0,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop",
        category: "Kitchen & Dining",
        brand: "AquaEco",
        features: ["Stainless Steel", "BPA Free", "Insulated"]
      },
      {
        id: 202,
        name: "Organic Cotton T-Shirt",
        price: 799.00,
        originalPrice: 999.00,
        discount: 20,
        stock: 20,
        ecoscore: "B",
        ecoscoreValue: 70.0,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
        category: "Fashion & Accessories",
        brand: "GreenWear",
        features: ["GOTS Certified", "Fair Trade", "Pre-shrunk"]
      }
    ]
  },
  {
    id: 3,
    name: "EcoSwitch Delhi Connaught Place",
    address: "Connaught Place, New Delhi, Delhi 110001",
    phone: "+91 11 1234 5678",
    email: "delhi@ecoswitch.com",
    website: "https://ecoswitch.com/delhi",
    latitude: 28.6315,
    longitude: 77.2167,
    rating: 4.7,
    reviewCount: 156,
    openingHours: {
      monday: "9:30 AM - 9:30 PM",
      tuesday: "9:30 AM - 9:30 PM",
      wednesday: "9:30 AM - 9:30 PM",
      thursday: "9:30 AM - 9:30 PM",
      friday: "9:30 AM - 10:30 PM",
      saturday: "9:30 AM - 10:30 PM",
      sunday: "10:30 AM - 9:00 PM"
    },
    isOpen: false, // Currently closed
    distance: 0,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop",
    description: "Our largest store in the capital, featuring an extensive range of sustainable products and eco-friendly alternatives.",
    features: ["Metro Connected", "Multi-level Store", "Café", "Event Space"],
    products: [
      {
        id: 301,
        name: "Compostable Food Containers",
        price: 249.00,
        originalPrice: 349.00,
        discount: 28,
        stock: 25,
        ecoscore: "A",
        ecoscoreValue: 95.0,
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
        category: "Kitchen & Dining",
        brand: "BioBox",
        features: ["Compostable", "Plant-Based", "Microwave Safe"]
      },
      {
        id: 302,
        name: "Energy-Efficient LED Bulb",
        price: 199.00,
        originalPrice: 299.00,
        discount: 33,
        stock: 30,
        ecoscore: "A",
        ecoscoreValue: 80.0,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
        category: "Home & Garden",
        brand: "EcoLight",
        features: ["25,000 Hour Life", "Energy Star", "Dimmable"]
      },
      {
        id: 303,
        name: "Hemp Shopping Bag",
        price: 449.00,
        originalPrice: 599.00,
        discount: 25,
        stock: 18,
        ecoscore: "B",
        ecoscoreValue: 65.0,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
        category: "Fashion & Accessories",
        brand: "HempLife",
        features: ["Hemp Fiber", "Reinforced Handles", "Machine Washable"]
      }
    ]
  },
  {
    id: 4,
    name: "AJ STORES ",
    address: "414, Thandalam, Mevalurkuppam, Tamil Nadu 602105",
    phone: "+91 44 1234 5678",
    email: "chennai@ecoswitch.com",
    website: "https://ecoswitch.com/chennai",
    latitude: 12.997783,
    longitude: 79.989055,
    rating: 4.2,
    reviewCount: 87,
    openingHours: {
      monday: "10:00 AM - 9:00 PM",
      tuesday: "10:00 AM - 9:00 PM",
      wednesday: "10:00 AM - 9:00 PM",
      thursday: "10:00 AM - 9:00 PM",
      friday: "10:00 AM - 9:30 PM",
      saturday: "10:00 AM - 9:30 PM",
      sunday: "11:00 AM - 8:00 PM"
    },
    isOpen: true,
    distance: 0,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop",
    description: "Located in the bustling hopping district, our Chennai store brings eco-friendly products to South India.",
    features: ["Shopping District", "Parking Available", "Local Products", "Tamil Support"],
    products: [
      {
        id: 401,
        name: "Bamboo Toothbrush Set",
        price: 149.00,
        originalPrice: 199.00,
        discount: 25,
        stock: 22,
        ecoscore: "E",
        ecoscoreValue: 0.0,
        image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300&h=300&fit=crop",
        category: "Personal Care",
        brand: "EcoBrush",
        features: ["Bamboo Handle", "BPA Free Bristles", "Biodegradable"]
      },
      {
        id: 402,
        name: "Recycled Plastic Water Bottle",
        price: 399.00,
        originalPrice: 499.00,
        discount: 20,
        stock: 14,
        ecoscore: "C",
        ecoscoreValue: 45.0,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop",
        category: "Kitchen & Dining",
        brand: "RecyclePro",
        features: ["100% Recycled", "BPA Free", "Leak Proof"]
      }
    ]
  },
  {
    id: 5,
    name: "EcoSwitch Pune Koregaon Park",
    address: "Koregaon Park, Pune, Maharashtra 411001",
    phone: "+91 20 1234 5678",
    email: "pune@ecoswitch.com",
    website: "https://ecoswitch.com/pune",
    latitude: 18.5362,
    longitude: 73.8903,
    rating: 4.6,
    reviewCount: 73,
    openingHours: {
      monday: "9:00 AM - 8:30 PM",
      tuesday: "9:00 AM - 8:30 PM",
      wednesday: "9:00 AM - 8:30 PM",
      thursday: "9:00 AM - 8:30 PM",
      friday: "9:00 AM - 9:00 PM",
      saturday: "9:00 AM - 9:00 PM",
      sunday: "10:00 AM - 7:30 PM"
    },
    isOpen: true,
    distance: 0,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop",
    description: "Our boutique store in the trendy Koregaon Park area, focusing on premium sustainable lifestyle products.",
    features: ["Boutique Store", "Premium Products", "Styling Service", "Gift Wrapping"],
    products: [
      {
        id: 501,
        name: "Conventional Plastic Bottle",
        price: 99.00,
        originalPrice: 149.00,
        discount: 33,
        stock: 35,
        ecoscore: "D",
        ecoscoreValue: 15.0,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop",
        category: "Kitchen & Dining",
        brand: "PlastiCorp",
        features: ["Single Use", "Lightweight", "Clear Design"]
      },
      {
        id: 502,
        name: "Traditional Plastic Bag",
        price: 5.00,
        originalPrice: 10.00,
        discount: 50,
        stock: 100,
        ecoscore: "E",
        ecoscoreValue: 5.0,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
        category: "Fashion & Accessories",
        brand: "PlastiBag",
        features: ["Single Use", "Lightweight", "Waterproof"]
      }
    ]
  },
  {
    id: 6,
    name: "Khadi Bhavan",
    address: "94, N Usman Rd, opposite Hotel Saravana Bhavan, T Nagar, Chennai, Tamil Nadu 600017",
    phone: "+91 44 9876 5432",
    email: "thirumazhisai@ecoswitch.com",
    website: "https://ecoswitch.com/thirumazhisai",
    latitude: 13.0839,
    longitude: 80.2700,
    rating: 4.4,
    reviewCount: 67,
    openingHours: {
      monday: "9:00 AM - 8:00 PM",
      tuesday: "9:00 AM - 8:00 PM",
      wednesday: "9:00 AM - 8:00 PM",
      thursday: "9:00 AM - 8:00 PM",
      friday: "9:00 AM - 9:00 PM",
      saturday: "9:00 AM - 9:00 PM",
      sunday: "10:00 AM - 7:00 PM"
    },
    isOpen: true,
    distance: 0,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop",
    description: "Our newest store in Thirumazhisai, bringing eco-friendly products to the growing community in this vibrant Chennai suburb.",
    features: ["New Store", "Local Community Focus", "Parking Available", "Tamil Support"],
    products: [
      {
        id: 601,
        name: "Bamboo Kitchen Set",
        price: 349.00,
        originalPrice: 499.00,
        discount: 30,
        stock: 12,
        ecoscore: "A",
        ecoscoreValue: 88.0,
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
        category: "Kitchen & Dining",
        brand: "BambooLife",
        features: ["Bamboo Material", "Biodegradable", "Complete Set", "Eco-Friendly"]
      },
      {
        id: 602,
        name: "Organic Cotton Bedsheet Set",
        price: 1299.00,
        originalPrice: 1799.00,
        discount: 28,
        stock: 8,
        ecoscore: "A",
        ecoscoreValue: 92.0,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
        category: "Home & Garden",
        brand: "EcoHome",
        features: ["GOTS Certified", "Organic Cotton", "King Size", "Machine Washable"]
      },
      {
        id: 603,
        name: "Solar Phone Charger",
        price: 799.00,
        originalPrice: 1199.00,
        discount: 33,
        stock: 15,
        ecoscore: "A",
        ecoscoreValue: 85.0,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
        category: "Electronics",
        brand: "SolarTech",
        features: ["Solar Powered", "Portable", "Fast Charging", "Weather Resistant"]
      }
    ]
  }
];

// Utility function to calculate distance between two coordinates
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
};

// Function to sort stores by distance
export const sortStoresByDistance = (stores, userLat, userLon) => {
  return stores.map(store => ({
    ...store,
    distance: calculateDistance(userLat, userLon, store.latitude, store.longitude)
  })).sort((a, b) => a.distance - b.distance);
};

// Function to get current time in HH:MM format
export const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Function to check if store is currently open
export const isStoreOpen = (store) => {
  const now = new Date();
  const currentDay = now.toLocaleLowerCase().slice(0, 3) + 'day';
  const currentTime = getCurrentTime();
  
  if (!store.openingHours[currentDay]) {
    return false;
  }
  
  const [openTime, closeTime] = store.openingHours[currentDay].split(' - ');
  const openHour = parseInt(openTime.split(':')[0]);
  const openMin = parseInt(openTime.split(':')[1].split(' ')[0]);
  const closeHour = parseInt(closeTime.split(':')[0]);
  const closeMin = parseInt(closeTime.split(':')[1].split(' ')[0]);
  
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();
  
  const currentMinutes = currentHour * 60 + currentMin;
  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;
  
  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
};

export default mockStores;
