import { useState, useEffect } from 'react'
import { ArrowLeft, CreditCard, MapPin, Truck, Shield, CheckCircle } from 'lucide-react'

const API_BASE = import.meta.env?.VITE_API_BASE || window.__API_BASE__ || 'http://127.0.0.1:5000';

const Checkout = ({ setCurrentPage }) => {
  const [cart, setCart] = useState({ items: [], total_items: 0, total_amount: 0 })
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
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
          fetchAddresses()
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
        if (data.items.length === 0) {
          setCurrentPage('cart')
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_BASE}/api/customers/addresses/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setAddresses(data.results || data)
        // Select default address if available
        const defaultAddress = data.results?.find(addr => addr.is_default) || data.find(addr => addr.is_default)
        if (defaultAddress) {
          setSelectedAddress(defaultAddress.id)
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    }
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_BASE}/api/ecommerce/coupons/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const coupons = await response.json()
        const coupon = (coupons.results || coupons).find(c => c.code === couponCode.toUpperCase())
        
        if (coupon && coupon.is_valid) {
          if (cart.total_amount >= coupon.minimum_amount) {
            setAppliedCoupon(coupon)
            alert(`Coupon applied! You saved ₹${coupon.value}`)
          } else {
            alert(`Minimum order amount of ₹${coupon.minimum_amount} required for this coupon`)
          }
        } else {
          alert('Invalid or expired coupon code')
        }
      }
    } catch (error) {
      console.error('Error applying coupon:', error)
      alert('Failed to apply coupon')
    }
  }

  const placeOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a shipping address')
      return
    }

    setIsProcessing(true)
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_BASE}/api/ecommerce/orders/create_order/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shipping_address_id: selectedAddress,
          payment_method: paymentMethod,
          coupon_code: appliedCoupon?.code || ''
        })
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Order placed successfully! Order number: ${data.order_number}`)
        setCurrentPage('customer-portal')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to place order')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order')
    } finally {
      setIsProcessing(false)
    }
  }

  const calculateTotal = () => {
    let total = cart.total_amount
    let discount = 0
    
    if (appliedCoupon) {
      if (appliedCoupon.coupon_type === 'percentage') {
        discount = (total * appliedCoupon.value) / 100
        if (appliedCoupon.maximum_discount) {
          discount = Math.min(discount, appliedCoupon.maximum_discount)
        }
      } else {
        discount = appliedCoupon.value
      }
    }
    
    const shipping = 50
    const tax = (total - discount) * 0.18
    return {
      subtotal: total,
      discount,
      shipping,
      tax,
      total: total - discount + shipping + tax
    }
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
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
          <p className="text-gray-600 mb-4">You need to be logged in as a customer to checkout</p>
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

  const totals = calculateTotal()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setCurrentPage('cart')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
              </div>
              
              {addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label key={address.id} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-green-300 transition-colors">
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddress === address.id}
                        onChange={(e) => setSelectedAddress(parseInt(e.target.value))}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{address.full_name}</span>
                          {address.is_default && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">
                          {address.address_line_1}, {address.address_line_2 && `${address.address_line_2}, `}
                          {address.city}, {address.state} - {address.postal_code}
                        </p>
                        <p className="text-gray-600 text-sm">{address.phone_number}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No addresses found</p>
                  <button
                    onClick={() => setCurrentPage('customer-portal')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Address
                  </button>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { value: 'upi', label: 'UPI', icon: '📱' },
                  { value: 'credit_card', label: 'Credit Card', icon: '💳' },
                  { value: 'debit_card', label: 'Debit Card', icon: '💳' },
                  { value: 'net_banking', label: 'Net Banking', icon: '🏦' },
                  { value: 'cod', label: 'Cash on Delivery', icon: '💰' }
                ].map((method) => (
                  <label key={method.value} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-green-300 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="text-2xl">{method.icon}</span>
                    <span className="font-medium text-gray-900">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Coupon Code */}
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Coupon Code</h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={applyCoupon}
                  disabled={!couponCode.trim() || !!appliedCoupon}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">
                      Coupon "{appliedCoupon.code}" applied! You saved ₹{appliedCoupon.value}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {item.product_image ? (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-gray-400">📦</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{item.product_name}</p>
                      <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">₹{item.total_price}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{totals.subtotal}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{totals.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">₹{totals.shipping}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">₹{totals.tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-green-600">₹{totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={placeOrder}
                disabled={!selectedAddress || isProcessing}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                  <Shield className="w-4 h-4" />
                  Secure checkout with SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
