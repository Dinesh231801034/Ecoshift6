import React, { useState } from 'react';
import { ShoppingCart, Heart, Package, Star } from 'lucide-react';
import EcoScoreLabel from './EcoScoreLabel';
import { formatRupees } from '../utils/currency';

const StoreProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await onAddToCart(product);
      // Show success feedback
      setTimeout(() => setIsAddingToCart(false), 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    setIsAddingToWishlist(true);
    try {
      await onAddToWishlist(product);
      // Show success feedback
      setTimeout(() => setIsAddingToWishlist(false), 1000);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      setIsAddingToWishlist(false);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-100' };
    if (stock < 5) return { text: 'Low Stock', color: 'text-orange-600 bg-orange-100' };
    return { text: 'In Stock', color: 'text-green-600 bg-green-100' };
  };

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop';
          }}
        />
        
        {/* EcoScore Badge */}
        <div className="absolute top-3 left-3">
          <EcoScoreLabel
            score={product.ecoscoreValue}
            grade={product.ecoscore}
            size="small"
            className="shadow-sm"
          />
        </div>

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 right-3">
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              {product.discount}% OFF
            </span>
          </div>
        )}

        {/* Stock Status */}
        <div className="absolute bottom-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stockStatus.color}`}>
            {stockStatus.text}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-2">
            <button
              onClick={handleAddToWishlist}
              disabled={isAddingToWishlist}
              className="bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-full shadow-md transition-colors duration-200 disabled:opacity-50"
              title="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isAddingToWishlist ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category and Brand */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-medium">{product.category}</span>
          <span className="text-xs text-gray-500 font-medium">{product.brand}</span>
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Features */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {product.features.slice(0, 2).map((feature, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
              >
                {feature}
              </span>
            ))}
            {product.features.length > 2 && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                +{product.features.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-xl font-bold text-green-600">{formatRupees(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">{formatRupees(product.originalPrice)}</span>
          )}
        </div>

        {/* Stock Info */}
        <div className="flex items-center space-x-2 mb-4">
          <Package className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {product.stock} {product.stock === 1 ? 'item' : 'items'} available
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || product.stock === 0}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isAddingToCart
              ? 'bg-green-500 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>
            {isAddingToCart 
              ? 'Adding...' 
              : product.stock === 0 
              ? 'Out of Stock' 
              : 'Add to Cart'
            }
          </span>
        </button>

        {/* EcoScore Details */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Environmental Impact:</span>
            <EcoScoreLabel
              score={product.ecoscoreValue}
              grade={product.ecoscore}
              size="small"
              showDetails={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreProductCard;
