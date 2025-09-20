import { useState, useEffect } from 'react'
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CreditCard, MapPin } from 'lucide-react'

const API_BASE = import.meta.env?.VITE_API_BASE || window.__API_BASE__ || 'http://127.0.0.1:5000';

const Cart = ({ setCurrentPage }) => {
  const [cart, setCart] = useState({ items: [], total_items: 0, total_amount: 0 })
  const [isLoading, setIsLoading] = useState(true)
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
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [])

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
    } finally {
      setIsLoading(false)
    }
  }

  const updateCartItem = async (itemId, quantity) => {
    if (quantity <= 0) {
      await removeCartItem(itemId)
      return
    }

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_BASE}/api/ecommerce/cart/update_item/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_id: itemId,
          quantity: quantity
        })
      })

      if (response.ok) {
        await fetchCart()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update cart item')
      }
    } catch (error) {
      console.error('Error updating cart item:', error)
      alert('Failed to update cart item')
    }
  }

  const removeCartItem = async (itemId) => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_BASE}/api/ecommerce/cart/remove_item/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_id: itemId
        })
      })

      if (response.ok) {
        await fetchCart()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to remove cart item')
      }
    } catch (error) {
      console.error('Error removing cart item:', error)
      alert('Failed to remove cart item')
    }
  }

  const clearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_BASE}/api/ecommerce/cart/clear/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        await fetchCart()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to clear cart')
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      alert('Failed to clear cart')
    }
  }

  const proceedToCheckout = () => {
    if (cart.items.length === 0) {
      alert('Your cart is empty')
      return
    }
    setCurrentPage('checkout')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user || user.user_type !== 'customer') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
          <p className="text-gray-600 mb-4">You need to be logged in as a customer to view your cart</p>
          <button
            onClick={() => setCurrentPage('home')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage('products')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          {cart.items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cart.items.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-12">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet</p>
            <button
              onClick={() => setCurrentPage('products')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden">
                <div className="p-6 border-b border-green-100">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Cart Items ({cart.total_items})
                  </h2>
                </div>
                <div className="divide-y divide-green-100">
                  {cart.items.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-center gap-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-gray-400 text-2xl">📦</div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {item.product_name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            Product ID: {item.product_id}
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            ₹{item.product_price}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateCartItem(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartItem(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Total Price */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            ₹{item.total_price}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeCartItem(item.id)}
                          className="text-red-500 hover:text-red-700 p-2 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{cart.total_amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">₹50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">₹{(cart.total_amount * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-green-600">
                        ₹{(cart.total_amount + 50 + (cart.total_amount * 0.18)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={proceedToCheckout}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Proceed to Checkout
                </button>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    Secure checkout with SSL encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
