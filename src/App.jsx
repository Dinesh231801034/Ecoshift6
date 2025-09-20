import { useState, useEffect } from 'react'
import './App.css'
import './styles/design-system.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductsEcommerce from './pages/ProductsEcommerce'
import Services from './pages/Services'
import Contact from './pages/Contact'
import AuthModal from './components/auth/AuthModal'
import MerchantAuthModal from './components/auth/MerchantAuthModal'
import MerchantPortal from './pages/MerchantPortal'
import CustomerPortal from './pages/CustomerPortal'
import Leaderboards from './pages/Leaderboards'
import Rewards from './pages/Rewards'
import Challenges from './pages/Challenges'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import EcoScoreDemo from './pages/EcoScoreDemo'
import Stores from './pages/Stores'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [globalSearchTerm, setGlobalSearchTerm] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showMerchantAuthModal, setShowMerchantAuthModal] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('access_token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        
        // Check if we're on a portal page
        if (window.location.pathname === '/merchant-portal' && parsedUser.user_type === 'merchant') {
          setCurrentPage('merchant-portal')
        } else if (window.location.pathname === '/customer-portal' && parsedUser.user_type === 'customer') {
          setCurrentPage('customer-portal')
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
      }
    }
    
    setIsLoading(false)
  }, [])

  const handleGlobalSearch = (searchTerm) => {
    setGlobalSearchTerm(searchTerm)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    setShowAuthModal(false)
    
    // Redirect to appropriate portal
    if (userData.user_type === 'merchant') {
      setCurrentPage('merchant-portal')
    } else {
      setCurrentPage('customer-portal')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setUser(null)
    setCurrentPage('home')
  }

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'home':
        return <Home setCurrentPage={handlePageChange} />
      case 'products':
        return <ProductsEcommerce globalSearchTerm={globalSearchTerm} setGlobalSearchTerm={setGlobalSearchTerm} setCurrentPage={setCurrentPage} />
      case 'services':
        return <Services globalSearchTerm={globalSearchTerm} setGlobalSearchTerm={setGlobalSearchTerm} />
      case 'contact':
        return <Contact />
      case 'leaderboards':
        return <Leaderboards />
      case 'rewards':
        return <Rewards />
      case 'challenges':
        return <Challenges />
      case 'merchant-portal':
        return <MerchantPortal />
      case 'customer-portal':
        return <CustomerPortal />
      case 'cart':
        return <Cart setCurrentPage={setCurrentPage} />
      case 'checkout':
        return <Checkout setCurrentPage={setCurrentPage} />
      case 'ecoscore-demo':
        return <EcoScoreDemo />
      case 'stores':
        return <Stores />
      default:
        return <Home setCurrentPage={handlePageChange} />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-green-100 overflow-x-hidden">
      {currentPage !== 'merchant-portal' && currentPage !== 'customer-portal' && (
        <Navbar
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
          user={user}
          onLogin={() => setShowAuthModal(true)}
          onMerchantLogin={() => setShowMerchantAuthModal(true)}
          onLogout={handleLogout}
        />
      )}
      <main className="w-full">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white py-8 w-full">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="text-2xl">🌿</div>
                <span className="text-xl font-bold">EcoSwitch</span>
              </div>
              <p className="text-green-200">
                Helping you find sustainable alternatives for a better planet, one product at a time.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-green-200">
                <li><button onClick={() => handlePageChange('home')} className="hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => handlePageChange('products')} className="hover:text-white transition-colors">Products</button></li>
                <li><button onClick={() => handlePageChange('services')} className="hover:text-white transition-colors">Get Recommendations</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <ul className="space-y-2 text-green-200">
                <li>Personal Care</li>
                <li>Home & Kitchen</li>
                <li>Clothing</li>
                <li>Cleaning Products</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-green-200">
                <li>📧 help@ecoswitch.com</li>
                <li>📞 +91-789456123</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-200">
            <p>&copy; 2025 EcoSwitch. Built with 💚 for a sustainable future.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Merchant Auth Modal */}
      <MerchantAuthModal
        isOpen={showMerchantAuthModal}
        onClose={() => setShowMerchantAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  )
}

export default App
