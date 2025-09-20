import { useState, useEffect } from 'react';
import { 
  BarChart3, Package, ShoppingCart, Users, TrendingUp, 
  Plus, Edit, Trash2, Eye, Settings, LogOut, Bell,
  Search, Filter, Download, Upload, Star, DollarSign,
  Store, Target, Zap, Award, Globe, Shield, Calendar,
  ArrowRight, Sparkles, Gift, Leaf, Building
} from 'lucide-react';
import ProductModal from '../components/ProductModal';
import AnalyticsCharts from '../components/AnalyticsCharts';

  const API_BASE = import.meta.env?.VITE_API_BASE || window.__API_BASE__ || 'http://127.0.0.1:5000';

const MerchantPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      window.location.href = '/';
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.user_type !== 'merchant') {
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
      
      // Load products
      const productsResponse = await fetch(`${API_BASE}/api/merchants/products/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      const productsData = await productsResponse.json();
      setProducts(productsData.results || productsData);

      // Load orders
      const ordersResponse = await fetch(`${API_BASE}/api/merchants/orders/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      const ordersData = await ordersResponse.json();
      setOrders(ordersData.results || ordersData);

      // Load analytics
      const analyticsResponse = await fetch(`${API_BASE}/api/merchants/dashboard/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      const analyticsData = await analyticsResponse.json();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      
      const response = await fetch(`${API_BASE}/api/merchants/products/?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      setProducts(data.results || data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const resetSearch = () => {
    setSearchTerm('');
    setSelectedCategory('');
    loadDashboardData();
  };

  const handleToggleProductStatus = async (productId) => {
    try {
      const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_BASE}/api/merchants/products/${productId}/toggle_active/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        loadDashboardData(); // Refresh data
        resetSearch(); // Reset search after operation
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  const handleUpdateStock = async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_BASE}/api/merchants/products/${productId}/update_stock/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      
      if (response.ok) {
        loadDashboardData(); // Refresh data
        resetSearch(); // Reset search after operation
      }
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_BASE}/api/merchants/products/${productId}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
          },
        });
        
        if (response.ok) {
          loadDashboardData(); // Refresh data
          resetSearch(); // Reset search after operation
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleSaveProduct = () => {
    loadDashboardData();
    resetSearch();
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_BASE}/api/merchants/orders/${orderId}/update_status/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        loadDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleViewOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_BASE}/api/merchants/orders/${orderId}/details/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      setShowOrderDetails(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
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
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'orders', name: 'Orders', icon: ShoppingCart },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl shadow-lg border-b border-blue-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Merchant Portal</h1>
                <p className="text-sm text-gray-600 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1 text-blue-500" />
                  Welcome back, {user?.first_name}!
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Business Stats */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-blue-100 px-3 py-2 rounded-full">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">{products.length} Products</span>
                </div>
                <div className="flex items-center space-x-2 bg-green-100 px-3 py-2 rounded-full">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">₹{analytics.totalRevenue || 0}</span>
                </div>
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
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105'
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
              
              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setShowAddProduct(true)}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Export Data</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                    <BarChart3 className="w-4 h-4" />
                    <span>View Reports</span>
                  </button>
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
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">Grow your eco business</h2>
                <p className="text-emerald-50 mt-1">Manage products, track orders, and view insights at a glance.</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button onClick={() => setActiveTab('products')} className="bg-white text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-lg font-medium">
                    Manage Products
                  </button>
                  <button onClick={() => setActiveTab('orders')} className="bg-emerald-800/20 text-white hover:bg-emerald-800/30 px-4 py-2 rounded-lg font-medium">
                    View Orders
                  </button>
                  <button onClick={() => setActiveTab('analytics')} className="bg-emerald-800/20 text-white hover:bg-emerald-800/30 px-4 py-2 rounded-lg font-medium">
                    Analytics
                  </button>
                </div>
              </div>
            </div>
            {activeTab === 'dashboard' && <DashboardTab analytics={analytics} />}
            {activeTab === 'products' && (
              <ProductsTab 
                products={products} 
                onRefresh={loadDashboardData}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                onSearch={handleSearch}
                onResetSearch={resetSearch}
                onToggleStatus={handleToggleProductStatus}
                onUpdateStock={handleUpdateStock}
                onDelete={handleDeleteProduct}
                onEdit={setEditingProduct}
                onAdd={() => setShowAddProduct(true)}
              />
            )}
            {activeTab === 'orders' && (
              <OrdersTab 
                orders={orders} 
                onRefresh={loadDashboardData}
                onUpdateStatus={handleUpdateOrderStatus}
                onViewDetails={handleViewOrderDetails}
              />
            )}
            {activeTab === 'analytics' && <AnalyticsCharts analytics={analytics} onRefresh={loadDashboardData} />}
            {activeTab === 'settings' && <SettingsTab user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Tab Component
const DashboardTab = ({ analytics }) => (
  <div className="space-y-8">
    {/* Welcome Section */}
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
      <div className="relative z-10">
        <h2 className="text-3xl font-bold mb-2">Business Dashboard 🏪</h2>
        <p className="text-blue-100 text-lg">Monitor your sales, manage products, and grow your sustainable business.</p>
      </div>
    </div>
    
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900">{analytics.sales_metrics?.total_orders || 0}</p>
          </div>
          <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <ShoppingCart className="text-white" size={24} />
          </div>
        </div>
        <p className="text-sm text-green-600 mt-3 flex items-center">
          <TrendingUp className="w-4 h-4 mr-1" />
          +12% from last month
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900">₹{analytics.sales_metrics?.total_revenue || 0}</p>
          </div>
          <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
            <DollarSign className="text-white" size={24} />
          </div>
        </div>
        <p className="text-sm text-green-600 mt-3 flex items-center">
          <TrendingUp className="w-4 h-4 mr-1" />
          +8% from last month
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Products</p>
            <p className="text-3xl font-bold text-gray-900">{analytics.product_metrics?.active_products || 0}</p>
          </div>
          <div className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl shadow-lg">
            <Package className="text-white" size={24} />
          </div>
        </div>
        <p className="text-sm text-purple-600 mt-3 flex items-center">
          <Target className="w-4 h-4 mr-1" />
          Out of {analytics.product_metrics?.total_products || 0} total
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
            <p className="text-3xl font-bold text-red-600">{analytics.product_metrics?.low_stock_products || 0}</p>
          </div>
          <div className="p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl shadow-lg">
            <Package className="text-white" size={24} />
          </div>
        </div>
        <p className="text-sm text-red-600 mt-3 flex items-center">
          <Zap className="w-4 h-4 mr-1" />
          Need attention
        </p>
      </div>
    </div>

    {/* Recent Orders */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
      </div>
      <div className="p-6">
        {analytics.recent_orders?.length > 0 ? (
          <div className="space-y-4">
            {analytics.recent_orders.map((order, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Order #{order.order_number}</p>
                  <p className="text-sm text-gray-600">{order.customer_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹{order.total_amount}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
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
  </div>
);

// Products Tab Component
const ProductsTab = ({ 
  products, 
  onRefresh, 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  onSearch, 
  onResetSearch,
  onToggleStatus, 
  onUpdateStock, 
  onDelete, 
  onEdit, 
  onAdd 
}) => {
  const [stockUpdate, setStockUpdate] = useState({});
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleStockUpdate = (productId, newQuantity) => {
    onUpdateStock(productId, newQuantity);
    setStockUpdate({ ...stockUpdate, [productId]: '' });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleSaveProduct = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <div className="flex space-x-2">
          <button 
            onClick={onResetSearch}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <Filter size={16} />
            <span>Reset</span>
          </button>
          <button 
            onClick={handleAddProduct}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-sm"
          >
            <Plus size={20} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            <option value="Personal Care">Personal Care</option>
            <option value="Kitchen & Dining">Kitchen & Dining</option>
            <option value="Fashion & Accessories">Fashion & Accessories</option>
            <option value="Electronics">Electronics</option>
          </select>
          <button 
            onClick={onSearch}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Search
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <div key={product.id || index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <Package className="text-gray-400" size={48} />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                <span className="text-sm text-gray-500">Stock: {product.stock_quantity}</span>
              </div>
              
              {/* Stock Update */}
              <div className="mb-3">
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="New stock"
                    value={stockUpdate[product.id] || ''}
                    onChange={(e) => setStockUpdate({ ...stockUpdate, [product.id]: e.target.value })}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                  <button
                    onClick={() => handleStockUpdate(product.id, stockUpdate[product.id])}
                    className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded"
                  >
                    Update
                  </button>
                </div>
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => onToggleStatus(product.id)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                    product.is_active 
                      ? 'bg-red-100 hover:bg-red-200 text-red-700' 
                      : 'bg-green-100 hover:bg-green-200 text-green-700'
                  }`}
                >
                  {product.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button 
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1"
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </button>
                <button 
                  onClick={() => onDelete(product.id)}
                  className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
        isEditing={!!editingProduct}
      />
    </div>
  );
};

// Orders Tab Component
const OrdersTab = ({ orders, onRefresh, onUpdateStatus, onViewDetails }) => {
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredOrders, setFilteredOrders] = useState(orders);

  useEffect(() => {
    if (statusFilter) {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    } else {
      setFilteredOrders(orders);
    }
  }, [orders, statusFilter]);

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order, index) => (
                <tr key={order.id || index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.order_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{order.total_amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => onViewDetails(order.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        View
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                        className="text-blue-600 hover:text-blue-900 border-none bg-transparent"
                      >
                        {statusOptions.slice(1).map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab = ({ analytics }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Revenue</span>
            <span className="font-semibold">₹{analytics.sales_metrics?.total_revenue || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">This Month</span>
            <span className="font-semibold">₹{analytics.sales_metrics?.month_revenue || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">This Week</span>
            <span className="font-semibold">₹{analytics.sales_metrics?.week_revenue || 0}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Performance</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Products</span>
            <span className="font-semibold">{analytics.product_metrics?.total_products || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Active Products</span>
            <span className="font-semibold">{analytics.product_metrics?.active_products || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Low Stock</span>
            <span className="font-semibold text-red-600">{analytics.product_metrics?.low_stock_products || 0}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

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
              Content-Type="text"
              defaultValue={user?.first_name}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              Content-Type="text"
              defaultValue={user?.last_name}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            Content-Type="email"
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

export default MerchantPortal;












