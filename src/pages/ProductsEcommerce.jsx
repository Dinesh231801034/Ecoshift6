import { useState, useEffect } from 'react'
import { Search, Filter, Star, Heart, ShoppingCart, Leaf, Award, Plus, Minus } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import ProductViewModal from '../components/ProductViewModal'
import ecoProducts from '../data/ecoProducts'
import ecoscoreProducts from '../data/ecoscoreProducts'

const API_BASE = import.meta.env?.VITE_API_BASE || window.__API_BASE__ || 'http://127.0.0.1:8001';

const ProductsEcommerce = ({ globalSearchTerm, setGlobalSearchTerm, setCurrentPage }) => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [ecoRating, setEcoRating] = useState(0)
  const [ecoscoreGrade, setEcoscoreGrade] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showProductModal, setShowProductModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [cart, setCart] = useState({ items: [], total_items: 0, total_amount: 0 })
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        if (parsedUser.user_type === 'customer') {
          fetchCart()
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
    
    fetchProducts()
    fetchCategories()
    fetchBrands()
  }, [])

  useEffect(() => {
    if (globalSearchTerm) {
      setSearchTerm(globalSearchTerm)
      setGlobalSearchTerm('')
    }
  }, [globalSearchTerm, setGlobalSearchTerm])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, selectedCategory, selectedBrand, priceRange, ecoRating, ecoscoreGrade, sortBy])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      
      // Try to fetch products with EcoScores first
      const ecoscoreResponse = await fetch(`${API_BASE}/api/ecoscore/products-ecoscore/`)
      if (ecoscoreResponse.ok) {
        const ecoscoreData = await ecoscoreResponse.json()
        setProducts(ecoscoreData.results || ecoscoreData)
        return
      }
      
      // Fallback to regular products API
      const response = await fetch(`${API_BASE}/api/ecommerce/products/`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.results || data)
      } else {
        // Use mock data with exact EcoScores
        setProducts(ecoscoreProducts)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      // Use mock data with exact EcoScores
      setProducts(ecoscoreProducts)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/ecommerce/categories/`)
      if (response.ok) {
        const data = await response.json()
        setCategories(['all', ...(data.results || data).map(cat => cat.name)])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories(['all', ...new Set(ecoscoreProducts.map(product => product.category))])
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/ecommerce/brands/`)
      if (response.ok) {
        const data = await response.json()
        setBrands(['all', ...(data.results || data).map(brand => brand.name)])
      }
    } catch (error) {
      console.error('Error fetching brands:', error)
      setBrands(['all', ...new Set(ecoscoreProducts.map(product => product.brand))])
    }
  }

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_BASE}/api/ecommerce/cart/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setCart(data)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  const addToCart = async (product) => {
    if (!user || user.user_type !== 'customer') {
      alert('Please login as a customer to add items to cart')
      return
    }

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_BASE}/api/ecommerce/cart/add_item/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1
        })
      })

      if (response.ok) {
        await fetchCart()
        alert('Product added to cart! Redirecting to checkout...')
        // Redirect to checkout after adding to cart
        window.location.href = '#checkout'
        setCurrentPage('checkout')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to add product to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add product to cart')
    }
  }

  const filterProducts = () => {
    let filtered = products

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.short_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category_name === selectedCategory)
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(product => product.brand_name === selectedBrand)
    }

    // Price range filter
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Eco rating filter
    if (ecoRating > 0) {
      filtered = filtered.filter(product => product.eco_rating >= ecoRating)
    }

    // EcoScore grade filter
    if (ecoscoreGrade !== 'all') {
      filtered = filtered.filter(product => product.ecoscore_grade === ecoscoreGrade)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price
        case 'price_desc':
          return b.price - a.price
        case 'eco_rating':
          return b.eco_rating - a.eco_rating
        case 'ecoscore':
          return (b.ecoscore_value || 0) - (a.ecoscore_value || 0)
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at)
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setShowProductModal(true)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedBrand('all')
    setPriceRange([0, 2000])
    setEcoRating(0)
    setEcoscoreGrade('all')
    setSortBy('name')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Eco-Friendly Products
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover sustainable alternatives that help you make a positive impact on the environment
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {brands.map(brand => (
                      <option key={brand} value={brand}>
                        {brand === 'all' ? 'All Brands' : brand}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>

                {/* Eco Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Eco Rating</label>
                  <select
                    value={ecoRating}
                    onChange={(e) => setEcoRating(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value={0}>All Ratings</option>
                    <option value={1}>1+ Stars</option>
                    <option value={2}>2+ Stars</option>
                    <option value={3}>3+ Stars</option>
                    <option value={4}>4+ Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>
                </div>

                {/* EcoScore Grade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">EcoScore Grade</label>
                  <select
                    value={ecoscoreGrade}
                    onChange={(e) => setEcoscoreGrade(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Grades</option>
                    <option value="A">🌱 A - Highly Sustainable</option>
                    <option value="B">♻️ B - Good</option>
                    <option value="C">⚖️ C - Average</option>
                    <option value="D">⚠️ D - Poor</option>
                    <option value="E">🚨 E - Very Poor</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={clearFilters}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Clear Filters
                </button>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="name">Name</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="eco_rating">Eco Rating</option>
                    <option value="ecoscore">EcoScore</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          {user && user.user_type === 'customer' && cart.total_items > 0 && (
            <div className="flex items-center gap-2 text-green-600">
              <ShoppingCart className="w-5 h-5" />
              <span>{cart.total_items} items in cart</span>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => handleProductClick(product)}
              onAddToCart={() => addToCart(product)}
              user={user}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Product View Modal */}
      <ProductViewModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        product={selectedProduct}
        onAddToCart={() => addToCart(selectedProduct)}
        user={user}
      />
    </div>
  )
}

export default ProductsEcommerce
