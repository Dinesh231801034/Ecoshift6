import { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, Phone, Building, Store, TrendingUp, Users, Package, Sparkles } from 'lucide-react';

const MerchantAuthModal = ({ isOpen, onClose, type = 'login', onSuccess }) => {
  const [authType, setAuthType] = useState(type);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    username: '',
    phoneNumber: '',
    businessName: '',
    businessType: '',
    userType: 'merchant'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const businessTypes = [
    { value: 'retail', label: 'Retail Store' },
    { value: 'online', label: 'Online Store' },
    { value: 'wholesale', label: 'Wholesale' },
    { value: 'manufacturer', label: 'Manufacturer' },
    { value: 'distributor', label: 'Distributor' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const API_BASE = import.meta.env?.VITE_API_BASE || window.__API_BASE__ || 'http://127.0.0.1:5000';
      const endpoint = authType === 'login' ? '/api/auth/login/' : '/api/auth/register/';

      const payload = authType === 'login'
        ? {
            email: formData.email,
            password: formData.password,
          }
        : {
            email: formData.email,
            username: formData.username,
            first_name: formData.firstName,
            last_name: formData.lastName,
            user_type: formData.userType,
            phone_number: formData.phoneNumber || '',
            business_name: formData.businessName,
            business_type: formData.businessType,
            password: formData.password,
            password_confirm: formData.confirmPassword,
          };

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (onSuccess) {
          onSuccess(data.user);
        }
        
        window.location.href = '/merchant-portal';
      } else {
        const firstKey = data && typeof data === 'object' ? Object.keys(data)[0] : null;
        const firstVal = firstKey ? data[firstKey] : null;
        const msg = typeof firstVal === 'string' ? firstVal : Array.isArray(firstVal) ? firstVal.join(', ') : null;
        setError(data.detail || data.error || data.message || msg || 'Request failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthType = () => {
    setAuthType(prev => prev === 'login' ? 'register' : 'login');
    setError('');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      username: '',
      phoneNumber: '',
      businessName: '',
      businessType: '',
      userType: 'merchant'
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-y-auto animate-fade-in"
      style={{ zIndex: 99999 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      <div className="relative min-h-screen flex items-center justify-center p-4">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Main Container */}
        <div className="relative w-full max-w-lg">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 z-[100000] w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200 hover:scale-110"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 animate-slide-in-up">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mb-4 shadow-lg">
                <Store className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {authType === 'login' ? 'Welcome Back, Merchant!' : 'Join Our Merchant Network'}
              </h2>
              <p className="text-gray-600">
                {authType === 'login' 
                  ? 'Access your business dashboard and manage your eco-friendly products' 
                  : 'Start selling sustainable products and grow your business'
                }
              </p>
            </div>

            {/* Merchant Benefits (Register only) */}
            {authType === 'register' && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Why Join as a Merchant?
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs text-blue-700">
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    <span>Reach eco-conscious customers</span>
                  </div>
                  <div className="flex items-center">
                    <Package className="w-3 h-3 mr-1" />
                    <span>Easy product management</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    <span>Growth analytics</span>
                  </div>
                  <div className="flex items-center">
                    <Store className="w-3 h-3 mr-1" />
                    <span>Store locator integration</span>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg animate-slide-in-down">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <X className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {authType === 'register' && (
                <>
                  {/* Business Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      Business Information
                    </h3>
                    
                    {/* Business Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Business Name
                      </label>
                      <div className="relative group">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                          placeholder="Your Business Name"
                        />
                      </div>
                    </div>

                    {/* Business Type */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Business Type
                      </label>
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      >
                        <option value="">Select business type</option>
                        {businessTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      Personal Information
                    </h3>
                    
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          First Name
                        </label>
                        <div className="relative group">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                            placeholder="John"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Last Name
                        </label>
                        <div className="relative group">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Username
                      </label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                          placeholder="johndoe"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Phone Number
                      </label>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="john@business.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Register only) */}
              {authType === 'register' && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>{authType === 'login' ? 'Signing In...' : 'Creating Account...'}</span>
                  </>
                ) : (
                  <>
                    <Store className="w-5 h-5" />
                    <span>{authType === 'login' ? 'Access Dashboard' : 'Join as Merchant'}</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Toggle Auth Type */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={toggleAuthType}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline"
                >
                  {authType === 'login' 
                    ? "Don't have a merchant account? Sign up" 
                    : "Already have a merchant account? Sign in"
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantAuthModal;
