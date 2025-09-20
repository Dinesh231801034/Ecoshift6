import { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, Phone, Building, Sparkles, Leaf, Store, ShoppingBag } from 'lucide-react';
import CustomDropdown from '../ui/CustomDropdown';

const AuthModal = ({ isOpen, onClose, type = 'login', onSuccess }) => {
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
    userType: 'customer'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

      // Map frontend fields to backend serializer expectations
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
        // Store tokens and user data
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (onSuccess) {
          onSuccess(data.user);
        }
        
        // Redirect based on user type
        if (data.user.user_type === 'merchant') {
          window.location.href = '/merchant-portal';
        } else {
          window.location.href = '/customer-portal';
        }
      } else {
        // Gather validation errors if any
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
      userType: 'customer'
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] bg-gradient-to-br from-green-50 via-white to-blue-50 overflow-y-auto animate-fade-in"
      style={{ zIndex: 99999 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      <div className="relative min-h-screen flex items-center justify-center p-4">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Main Container */}
        <div className="relative w-full max-w-md">
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
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl mb-4 shadow-lg">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {authType === 'login' ? 'Welcome Back!' : 'Join EcoSwitch'}
              </h2>
              <p className="text-gray-600">
                {authType === 'login' 
                  ? 'Sign in to continue your sustainable journey' 
                  : 'Start your eco-friendly shopping experience'
                }
              </p>
            </div>

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
                  {/* User Type Selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      I want to join as:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, userType: 'customer' }))}
                        className={`group relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                          formData.userType === 'customer'
                            ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                        }`}
                      >
                        <div className="text-center">
                          <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center transition-colors ${
                            formData.userType === 'customer' 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                          }`}>
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                          <div className={`font-semibold mb-1 ${
                            formData.userType === 'customer' ? 'text-green-700' : 'text-gray-900'
                          }`}>
                            Customer
                          </div>
                          <div className="text-xs text-gray-500">Buy eco products</div>
                        </div>
                        {formData.userType === 'customer' && (
                          <div className="absolute top-2 right-2">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          </div>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, userType: 'merchant' }))}
                        className={`group relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                          formData.userType === 'merchant'
                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                        }`}
                      >
                        <div className="text-center">
                          <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center transition-colors ${
                            formData.userType === 'merchant' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                          }`}>
                            <Store className="w-6 h-6" />
                          </div>
                          <div className={`font-semibold mb-1 ${
                            formData.userType === 'merchant' ? 'text-blue-700' : 'text-gray-900'
                          }`}>
                            Merchant
                          </div>
                          <div className="text-xs text-gray-500">Sell eco products</div>
                        </div>
                        {formData.userType === 'merchant' && (
                          <div className="absolute top-2 right-2">
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        First Name
                      </label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={20} />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                          placeholder="John"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Last Name
                      </label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={20} />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
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
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={20} />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
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
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={20} />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        placeholder="+91 98765 43210"
                      />
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
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
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
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>{authType === 'login' ? 'Signing In...' : 'Creating Account...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>{authType === 'login' ? 'Sign In' : 'Create Account'}</span>
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
                  className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200 hover:underline"
                >
                  {authType === 'login' 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"
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

export default AuthModal;







