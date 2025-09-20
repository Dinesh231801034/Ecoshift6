import { useState } from 'react'
import { X, Star, Heart, ShoppingCart, Leaf, Award, Plus, Minus } from 'lucide-react'

const ProductViewModal = ({ isOpen, onClose, product, onAddToCart, user }) => {
  if (!isOpen || !product) return null

  // Handle both API data and mock data structures
  const productImage = product.primary_image || product.image
  const productName = product.name
  const productBrand = product.brand_name || product.brand
  const productPrice = product.price
  const productRating = product.average_rating || product.eco_rating || product.rating
  const productCategory = product.category_name || product.category
  const productDescription = product.description || product.short_description
  const productTags = product.tags || []
  const isInStock = product.is_in_stock !== undefined ? product.is_in_stock : true
  const ecoRating = product.eco_rating || product.rating || 0

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Product Details</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-gradient-to-br from-green-50 to-blue-50 rounded-xl overflow-hidden">
                {productImage ? (
                  <img
                    src={productImage}
                    alt={productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    🌿
                  </div>
                )}
              </div>
              
              {/* Eco Rating */}
              <div className="flex items-center justify-center space-x-2 bg-green-50 p-4 rounded-lg">
                <Leaf className="w-6 h-6 text-green-600" />
                <span className="text-lg font-semibold text-green-700">
                  Eco Rating: {ecoRating}/5
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{productName}</h1>
                <p className="text-xl text-gray-600 mb-4">{productBrand}</p>
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-green-600">{productPrice}</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {productCategory}
                  </span>
                </div>
              </div>

              {/* Description */}
              {productDescription && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{productDescription}</p>
                </div>
              )}

              {/* Tags */}
              {productTags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {productTags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-green-50 border border-green-200 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Eco-friendly Features */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Eco-Friendly Features
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {product.is_organic && (
                    <div className="flex items-center text-green-700">
                      <span className="mr-2">🌱</span>
                      <span>Organic</span>
                    </div>
                  )}
                  {product.is_biodegradable && (
                    <div className="flex items-center text-green-700">
                      <span className="mr-2">♻️</span>
                      <span>Biodegradable</span>
                    </div>
                  )}
                  {product.is_recyclable && (
                    <div className="flex items-center text-green-700">
                      <span className="mr-2">🔄</span>
                      <span>Recyclable</span>
                    </div>
                  )}
                  {product.is_plastic_free && (
                    <div className="flex items-center text-green-700">
                      <span className="mr-2">🚫</span>
                      <span>Plastic-Free</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                {isInStock ? (
                  <span className="text-green-600 font-medium flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    In Stock
                  </span>
                ) : (
                  <span className="text-red-600 font-medium flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {user && user.user_type === 'customer' && isInStock ? (
                  <button
                    onClick={() => {
                      onAddToCart()
                      onClose()
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart - {productPrice}</span>
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>View Product - {productPrice}</span>
                  </button>
                )}
                
                <button
                  onClick={onClose}
                  className="w-full border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductViewModal
