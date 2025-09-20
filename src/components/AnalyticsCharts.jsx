import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Package, Users, ShoppingCart } from 'lucide-react';

const AnalyticsCharts = ({ analytics, onRefresh }) => {
  const [chartData, setChartData] = useState(null);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      const token = localStorage.getItem('access_token');
  const response = await fetch(`http://127.0.0.1:8000/api/merchants/analytics/sales/?days=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setChartData(data);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-2"
          >
            <TrendingUp size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold">{formatCurrency(analytics.sales_metrics?.total_revenue || 0)}</p>
              <p className="text-blue-100 text-sm">+12% from last month</p>
            </div>
            <div className="p-3 bg-blue-400 rounded-lg">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold">{formatNumber(analytics.sales_metrics?.total_orders || 0)}</p>
              <p className="text-green-100 text-sm">+8% from last month</p>
            </div>
            <div className="p-3 bg-green-400 rounded-lg">
              <ShoppingCart size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Active Products</p>
              <p className="text-3xl font-bold">{formatNumber(analytics.product_metrics?.active_products || 0)}</p>
              <p className="text-purple-100 text-sm">Out of {formatNumber(analytics.product_metrics?.total_products || 0)} total</p>
            </div>
            <div className="p-3 bg-purple-400 rounded-lg">
              <Package size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Low Stock Items</p>
              <p className="text-3xl font-bold">{formatNumber(analytics.product_metrics?.low_stock_products || 0)}</p>
              <p className="text-red-100 text-sm">Need attention</p>
            </div>
            <div className="p-3 bg-red-400 rounded-lg">
              <Package size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="h-64 flex items-center justify-center">
            {chartData?.daily_sales ? (
              <div className="w-full">
                <div className="space-y-2">
                  {chartData.daily_sales.slice(-7).map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{new Date(day.day).toLocaleDateString()}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min(100, (day.revenue / Math.max(...chartData.daily_sales.map(d => d.revenue))) * 100)}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{formatCurrency(day.revenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-gray-500">No data available</div>
            )}
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders by Status</h3>
          <div className="h-64 flex items-center justify-center">
            {chartData?.sales_by_status ? (
              <div className="w-full space-y-4">
                {chartData.sales_by_status.map((status, index) => {
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'];
                  const totalOrders = chartData.sales_by_status.reduce((sum, s) => sum + s.count, 0);
                  const percentage = totalOrders > 0 ? (status.count / totalOrders) * 100 : 0;
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 capitalize">{status.status}</span>
                        <span className="text-sm text-gray-600">{status.count} orders</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`${colors[index % colors.length]} h-3 rounded-full transition-all duration-300`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-500">No data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
        <div className="space-y-4">
          {chartData?.top_products?.length > 0 ? (
            chartData.top_products.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.product__name}</p>
                    <p className="text-sm text-gray-600">{product.quantity_sold} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                  <p className="text-sm text-gray-600">Revenue</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">No product data available</div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
        <div className="space-y-3">
          {analytics.recent_orders?.length > 0 ? (
            analytics.recent_orders.map((order, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Order #{order.order_number}</p>
                  <p className="text-sm text-gray-600">{order.customer_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(order.total_amount)}</p>
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
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">No recent orders</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;





