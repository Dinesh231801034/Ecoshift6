import { useState, useEffect } from 'react';
import { 
  ShoppingBag, Heart, Star, MapPin, CreditCard, 
  Package, Truck, CheckCircle, LogOut, Bell, Search,
  Filter, Plus, Minus, Eye, Edit, Trash2, Settings,
  TrendingUp, Award, Leaf, Calendar, Clock, ArrowRight,
  Sparkles, Gift, Target, Zap, Shield, Globe
} from 'lucide-react';

  const API_BASE = import.meta.env?.VITE_API_BASE || window.__API_BASE__ || 'http://127.0.0.1:5000';

const CustomerPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      window.location.href = '/';
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.user_type !== 'customer') {
      window.location.href = '/';
      return;
    }

    setUser(parsedUser);
    setIsLoading(false);
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      // Load orders
      try {
        const ordersResponse = await fetch(`${API_BASE}/api/customers/orders/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.results || ordersData);
      } catch (error) {
        // Fallback to sample data
        setOrders([
          {
            id: 1,
            order_number: 'ECO20240920001',
            total_amount: 1299,
            order_status: 'delivered',
            created_at: '2024-09-15T10:30:00Z',
            items: [
              { product_name: 'Organic Cotton T-Shirt', quantity: 1, unit_price: 899 },
              { product_name: 'Bamboo Kitchen Utensils Set', quantity: 1, unit_price: 400 }
            ]
          },
          {
            id: 2,
            order_number: 'ECO20240920002',
            total_amount: 750,
            order_status: 'shipped',
            created_at: '2024-09-18T14:20:00Z',
            items: [
              { product_name: 'Reusable Water Bottle', quantity: 1, unit_price: 750 }
            ]
          }
        ]);
      }

      // Load wishlist
      try {
        const wishlistResponse = await fetch(`${API_BASE}/api/customers/wishlist/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const wishlistData = await wishlistResponse.json();
        setWishlist(wishlistData.results || wishlistData);
      } catch (error) {
        // Fallback to sample data
        setWishlist([
          {
            id: 1,
            product_name: 'Natural Coconut Oil',
            product_price: 450,
            product_image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=640&auto=format&fit=crop',
            created_at: '2024-09-10T09:15:00Z'
          },
          {
            id: 2,
            product_name: 'Eco-Friendly Laundry Detergent',
            product_price: 650,
            product_image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=640&auto=format&fit=crop',
            created_at: '2024-09-12T16:45:00Z'
          },
          {
            id: 3,
            product_name: 'Natural Face Cleanser',
            product_price: 550,
            product_image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=640&auto=format&fit=crop',
            created_at: '2024-09-14T11:30:00Z'
          }
        ]);
      }

      // Load recommendations
      try {
        const recommendationsResponse = await fetch(`${API_BASE}/api/customers/recommendations/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const recommendationsData = await recommendationsResponse.json();
        setRecommendations(recommendationsData.results || recommendationsData);
      } catch (error) {
        // Fallback to sample data
        setRecommendations([
          {
            id: 1,
            product_name: 'Organic Green Tea',
            product_price: 380,
            product_image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=640&auto=format&fit=crop',
            recommendation_reason: 'Based on your interest in organic products',
            confidence_score: 0.85
          },
          {
            id: 2,
            product_name: 'Eco-Friendly Dish Soap',
            product_price: 320,
            product_image: 'https://images.unsplash.com/photo-1615485925880-d9e8d3d79042?q=80&w=640&auto=format&fit=crop',
            recommendation_reason: 'Perfect for your sustainable kitchen',
            confidence_score: 0.78
          },
          {
            id: 3,
            product_name: 'Natural Lip Balm',
            product_price: 180,
            product_image: 'https://images.unsplash.com/photo-1603712725038-8f7b2b7a9a0b?q=80&w=640&auto=format&fit=crop',
            recommendation_reason: 'Great addition to your personal care routine',
            confidence_score: 0.72
          }
        ]);
      }

      // Load addresses
  const addressesResponse = await fetch(`${API_BASE}/api/customers/addresses/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const addressesData = await addressesResponse.json();
      setAddresses(addressesData.results || addressesData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Package },
    { id: 'orders', name: 'My Orders', icon: ShoppingBag },
    { id: 'wishlist', name: 'Wishlist', icon: Heart },
    { id: 'recommendations', name: 'Recommendations', icon: Star },
    { id: 'addresses', name: 'Addresses', icon: MapPin },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl shadow-lg border-b border-green-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Customer Portal</h1>
                <p className="text-sm text-gray-600 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1 text-green-500" />
                  Welcome back, {user?.first_name}!
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* EcoScore Badge */}
              <div className="hidden md:flex items-center space-x-2 bg-green-100 px-3 py-2 rounded-full">
                <Award className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Eco Champion</span>
              </div>
              
              <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-72">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:transform hover:scale-105'
                      }`}
                    >
                      <Icon size={20} className={activeTab === tab.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'} />
                      <span className="font-medium">{tab.name}</span>
                      {activeTab === tab.id && (
                        <ArrowRight className="w-4 h-4 ml-auto text-white" />
                      )}
                    </button>
                  );
                })}
              </nav>
              
              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Orders</span>
                    <span className="font-semibold text-green-600">{orders.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Wishlist</span>
                    <span className="font-semibold text-pink-600">{wishlist.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">EcoScore</span>
                    <span className="font-semibold text-emerald-600">A+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Hero Section */}
            <div className="mb-8">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 p-6">
                <div className="absolute right-0 top-0 opacity-20 text-white text-9xl">🌿</div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">Welcome to your eco hub</h2>
                <p className="text-emerald-50 mt-1">Track orders, wishlist favorites, and manage addresses easily.</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button onClick={() => setActiveTab('orders')} className="bg-white text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-lg font-medium">
                    My Orders
                  </button>
                  <button onClick={() => setActiveTab('wishlist')} className="bg-emerald-800/20 text-white hover:bg-emerald-800/30 px-4 py-2 rounded-lg font-medium">
                    Wishlist
                  </button>
                  <button onClick={() => setActiveTab('addresses')} className="bg-emerald-800/20 text-white hover:bg-emerald-800/30 px-4 py-2 rounded-lg font-medium">
                    Addresses
                  </button>
                </div>
              </div>
            </div>
            {activeTab === 'dashboard' && <DashboardTab orders={orders} wishlist={wishlist} recommendations={recommendations} />}
            {activeTab === 'orders' && <OrdersTab orders={orders} />}
            {activeTab === 'wishlist' && <WishlistTab wishlist={wishlist} onRefresh={loadDashboardData} />}
            {activeTab === 'recommendations' && <RecommendationsTab recommendations={recommendations} />}
            {activeTab === 'addresses' && (
              <AddressesTab 
                addresses={addresses} 
                onRefresh={loadDashboardData} 
                onAdd={() => setShowAddressModal(true)}
              />
            )}
            {activeTab === 'settings' && <SettingsTab user={user} />}
          </div>
        </div>
    </div>

    {/* Address Modal */}
    {showAddressModal && (
      <AddAddressModal 
        onClose={() => setShowAddressModal(false)} 
        onSaved={() => { setShowAddressModal(false); loadDashboardData(); }}
      />
    )}
    </div>
  );
};

// Dashboard Tab Component
const DashboardTab = ({ orders, wishlist, recommendations }) => (
  <div className="space-y-8">
    {/* Welcome Section */}
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
      <div className="relative z-10">
        <h2 className="text-3xl font-bold mb-2">Welcome to Your Eco Dashboard! 🌱</h2>
        <p className="text-green-100 text-lg">Track your sustainable shopping journey and discover new eco-friendly products.</p>
      </div>
    </div>
    
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
          </div>
          <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <ShoppingBag className="text-white" size={24} />
          </div>
        </div>
        <p className="text-sm text-green-600 mt-3 flex items-center">
          <TrendingUp className="w-4 h-4 mr-1" />
          Keep shopping sustainably!
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Wishlist Items</p>
            <p className="text-3xl font-bold text-gray-900">{wishlist.length}</p>
          </div>
          <div className="p-4 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl shadow-lg">
            <Heart className="text-white" size={24} />
          </div>
        </div>
        <p className="text-sm text-pink-600 mt-3 flex items-center">
          <Gift className="w-4 h-4 mr-1" />
          Save for later
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Recommendations</p>
            <p className="text-3xl font-bold text-gray-900">{recommendations.length}</p>
          </div>
          <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-lg">
            <Star className="text-white" size={24} />
          </div>
        </div>
        <p className="text-sm text-yellow-600 mt-3 flex items-center">
          <Target className="w-4 h-4 mr-1" />
          Personalized for you
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Eco Impact</p>
            <p className="text-3xl font-bold text-green-600">12</p>
          </div>
          <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
            <Leaf className="text-white" size={24} />
          </div>
        </div>
        <p className="text-sm text-green-600 mt-3 flex items-center">
          <Shield className="w-4 h-4 mr-1" />
          Products saved from landfill
        </p>
      </div>
    </div>

    {/* Recent Orders */}
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20">
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Package className="w-6 h-6 mr-2 text-green-600" />
            Recent Orders
          </h3>
          <button className="text-green-600 hover:text-green-700 font-medium flex items-center">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
      <div className="p-6">
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.slice(0, 3).map((order, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Order #{order.order_number}</p>
                  <p className="text-sm text-gray-600">{order.items?.length || 0} items</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹{order.total_amount}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.order_status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.order_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recent orders</p>
        )}
      </div>
    </div>

    {/* Recommendations */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recommended for You</h3>
      </div>
      <div className="p-6">
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map((rec, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                  <Package className="text-gray-400" size={32} />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{rec.product_name}</h4>
                <p className="text-sm text-gray-600 mb-2">₹{rec.product_price}</p>
                <p className="text-xs text-green-600">Confidence: {Math.round(rec.confidence_score * 100)}%</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recommendations yet</p>
        )}
      </div>
    </div>
  </div>
);

// Orders Tab Component
const OrdersTab = ({ orders }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
    
    {orders.length > 0 ? (
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Order #{order.order_number}</h3>
                <p className="text-sm text-gray-600">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">₹{order.total_amount}</p>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  order.order_status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.order_status}
                </span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Items ({order.items?.length || 0})</h4>
              <div className="space-y-2">
                {order.items?.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="text-gray-400" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.product_name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium text-gray-900">₹{item.total_price}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-4">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                View Details
              </button>
              {order.order_status === 'delivered' && (
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Reorder
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <ShoppingBag className="mx-auto text-gray-400" size={64} />
        <h3 className="text-lg font-medium text-gray-900 mt-4">No orders yet</h3>
        <p className="text-gray-500 mt-2">Start shopping to see your orders here</p>
        <button onClick={() => (window.location.href = '/products')} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
          Start Shopping
        </button>
      </div>
    )}
  </div>
);

// Wishlist Tab Component
const WishlistTab = ({ wishlist, onRefresh }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
    
    {wishlist.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <Package className="text-gray-400" size={48} />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{item.product_name}</h3>
              <p className="text-lg font-bold text-green-600 mb-3">₹{item.product_price}</p>
              <div className="flex space-x-2">
                <button onClick={() => (window.location.href = '/products')} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm">
                  Add to Cart
                </button>
                <button className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <Heart className="mx-auto text-gray-400" size={64} />
        <h3 className="text-lg font-medium text-gray-900 mt-4">Your wishlist is empty</h3>
        <p className="text-gray-500 mt-2">Save items you love for later</p>
        <button onClick={() => (window.location.href = '/products')} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
          Start Shopping
        </button>
      </div>
    )}
  </div>
);

// Recommendations Tab Component
const RecommendationsTab = ({ recommendations }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Personalized Recommendations</h2>
    
    {recommendations.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <Package className="text-gray-400" size={48} />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{rec.product_name}</h3>
              <p className="text-sm text-gray-600 mb-2">{rec.recommendation_reason}</p>
              <p className="text-lg font-bold text-green-600 mb-3">₹{rec.product_price}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">
                  Confidence: {Math.round(rec.confidence_score * 100)}%
                </span>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.round(rec.confidence_score * 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                    />
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm">
                  Add to Cart
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm">
                  <Heart size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <Star className="mx-auto text-gray-400" size={64} />
        <h3 className="text-lg font-medium text-gray-900 mt-4">No recommendations yet</h3>
        <p className="text-gray-500 mt-2">Start shopping to get personalized recommendations</p>
        <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
          Start Shopping
        </button>
      </div>
    )}
  </div>
);

// Addresses Tab Component
const AddressesTab = ({ addresses, onRefresh, onAdd }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-900">My Addresses</h2>
      <button onClick={onAdd} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow">
        <Plus size={20} />
        <span>Add Address</span>
      </button>
    </div>
    
    {addresses.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{address.full_name}</h3>
                <p className="text-sm text-gray-600">{address.address_type}</p>
              </div>
              {address.is_default && (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Default
                </span>
              )}
            </div>
            
            <div className="text-gray-600 mb-4">
              <p>{address.address_line_1}</p>
              {address.address_line_2 && <p>{address.address_line_2}</p>}
              <p>{address.city}, {address.state} {address.postal_code}</p>
              <p>{address.country}</p>
              <p className="mt-2">Phone: {address.phone_number}</p>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1">
                <Edit size={16} />
                <span>Edit</span>
              </button>
              <button className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <MapPin className="mx-auto text-gray-400" size={64} />
        <h3 className="text-lg font-medium text-gray-900 mt-4">No addresses saved</h3>
        <p className="text-gray-500 mt-2">Add an address for faster checkout</p>
        <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
          Add Address
        </button>
      </div>
    )}
  </div>
);

// Add Address Modal
const AddAddressModal = ({ onClose, onSaved }) => {
  const [form, setForm] = useState({
    full_name: '',
    address_type: 'Home',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    phone_number: '',
    is_default: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE}/api/customers/addresses/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: form.full_name,
          phone_number: form.phone_number,
          address_type: (form.address_type || '').toLowerCase(),
          address_line_1: form.address_line_1,
          address_line_2: form.address_line_2 || '',
          city: form.city,
          state: form.state,
          country: form.country || 'India',
          postal_code: form.postal_code,
          is_default: !!form.is_default,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Failed to save address');
      }
      onSaved();
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 p-4">
          <h3 className="text-white font-semibold">Add New Address</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Full Name</label>
              <input name="full_name" value={form.full_name} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Phone</label>
              <input name="phone_number" value={form.phone_number} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Address Type</label>
              <select name="address_type" value={form.address_type} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                <option>Home</option>
                <option>Work</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Country</label>
              <input name="country" value={form.country} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">Address Line 1</label>
              <input name="address_line_1" value={form.address_line_1} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">Address Line 2</label>
              <input name="address_line_2" value={form.address_line_2} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">City</label>
              <input name="city" value={form.city} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">State</label>
              <input name="state" value={form.state} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Postal Code</label>
              <input name="postal_code" value={form.postal_code} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" name="is_default" checked={form.is_default} onChange={handleChange} className="h-4 w-4" />
              <span className="text-sm text-gray-700">Set as default</span>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-emerald-600 text-white disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Settings Tab Component
const SettingsTab = ({ user }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
    
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              defaultValue={user?.first_name}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              defaultValue={user?.last_name}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            defaultValue={user?.email}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
          Save Changes
        </button>
      </div>
    </div>
  </div>
);

export default CustomerPortal;
















