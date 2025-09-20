import { useState } from 'react';

const Navbar = ({ currentPage, setCurrentPage, user, onLogin, onMerchantLogin, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGamificationOpen, setIsGamificationOpen] = useState(false);

  const navItems = [
    { id: 'home', name: 'Home', icon: '🏠' },
    { id: 'products', name: 'Products', icon: '🛍️' },
    { id: 'stores', name: 'Stores', icon: '🏪' },
    { id: 'services', name: 'Search', icon: '🔎' },
    { id: 'ecoscore-demo', name: 'EcoScore', icon: '🌱' },
    { id: 'contact', name: 'Contact', icon: '📞' }
  ];

  const gamificationItems = [
    { id: 'leaderboards', name: 'Leaderboards', icon: '🏆' },
    { id: 'challenges', name: 'Challenges', icon: '🎯' },
    { id: 'rewards', name: 'Rewards', icon: '🎖️' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-green-100/90 to-blue-100/90 backdrop-blur-md border-b border-green-200 shadow-sm w-full">
      <div className="w-full">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
          >
            <div className="text-2xl">🌿</div>
            <span className="text-xl font-bold text-green-800">EcoSwitch</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  currentPage === item.id
                    ? 'bg-green-100 text-green-800 shadow-sm'
                    : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
            
            {/* Gamification Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsGamificationOpen(!isGamificationOpen)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  currentPage === 'leaderboards' || currentPage === 'challenges' || currentPage === 'rewards'
                    ? 'bg-green-100 text-green-800 shadow-sm'
                    : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                }`}
              >
                <span>🎮</span>
                <span>Gamify</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isGamificationOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isGamificationOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-green-200 py-2 z-50">
                  {gamificationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentPage(item.id);
                        setIsGamificationOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                        currentPage === item.id
                          ? 'bg-green-100 text-green-800'
                          : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Cart Button */}
            {user && user.user_type === 'customer' && (
              <button
                onClick={() => setCurrentPage('cart')}
                className="relative p-2 text-gray-600 hover:text-green-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </button>
            )}

            {/* Auth Buttons */}
            <div className="ml-4 flex items-center space-x-2">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    Welcome, {user.first_name}!
                  </span>
                  <button
                    onClick={() => setCurrentPage(user.user_type === 'merchant' ? 'merchant-portal' : 'customer-portal')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {user.user_type === 'merchant' ? 'Merchant Portal' : 'Customer Portal'}
                  </button>
                  <button
                    onClick={onLogout}
                    className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={onLogin}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Customer Login
                  </button>
                  <button
                    onClick={onMerchantLogin}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Merchant Login
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-green-700 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-green-200">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 flex items-center space-x-3 ${
                    currentPage === item.id
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
              
              {/* Mobile Gamification Items */}
              {gamificationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 flex items-center space-x-3 ${
                    currentPage === item.id
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-green-200">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2 text-sm text-gray-600">
                      Welcome, {user.first_name}!
                    </div>
                    <button
                      onClick={() => {
                        setCurrentPage(user.user_type === 'merchant' ? 'merchant-portal' : 'customer-portal');
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                    >
                      {user.user_type === 'merchant' ? 'Merchant Portal' : 'Customer Portal'}
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-gray-600 hover:text-gray-800 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onLogin();
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                  >
                    Login / Sign Up
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

    </nav>
  );
};

export default Navbar;
