import { useState } from 'react'
import { useRouter } from 'next/router'
import { useCart } from '../lib/cart'
import { formatPrice } from '../lib/medusa'
import { orderManager, ShippingAddress } from '../lib/orders'
// Inline coupon system (simplified)
const COUPONS = [
  { code: 'FIRST10', type: 'percentage' as const, value: 10, description: '10% off for first-time customers', minAmount: 1000 },
  { code: 'SAVE15', type: 'percentage' as const, value: 15, description: '15% off on orders above ₹10000', minAmount: 10000, maxDiscount: 2000 }
]

const validateCoupon = (code: string, cartTotal: number) => {
  const coupon = COUPONS.find(c => c.code.toLowerCase() === code.toLowerCase())
  if (!coupon) return { valid: false, error: 'Invalid coupon code' }
  if (coupon.minAmount && cartTotal < coupon.minAmount) {
    return { valid: false, error: `Minimum order amount ₹${coupon.minAmount} required` }
  }
  return { valid: true, coupon }
}

const calculateDiscount = (coupon: typeof COUPONS[0], cartTotal: number) => {
  if (coupon.type === 'percentage') {
    const discount = (cartTotal * coupon.value) / 100
    return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount
  }
  return coupon.value
}
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CreditCard, Truck, Shield, Tag, X } from 'lucide-react'

export default function Checkout() {
  const { items, clearCart } = useCart()
  const router = useRouter()
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping')
  const [orderId, setOrderId] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<typeof COUPONS[0] | null>(null)
  const [couponError, setCouponError] = useState('')
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  })

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0)
  const discount = appliedCoupon ? calculateDiscount(appliedCoupon, subtotal) : 0
  const shipping = subtotal > 2000 ? 0 : 200
  const tax = Math.round((subtotal - discount) * 0.18) // 18% GST
  const total = subtotal - discount + shipping + tax

  interface FormData {
    email: string
    name: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
    country: string
    cardNumber: string
    expiryDate: string
    cvv: string
    nameOnCard: string
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev: FormData) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleApplyCoupon = () => {
    setCouponError('')
    const result = validateCoupon(couponCode, subtotal)
    
    if (result.valid && result.coupon) {
      setAppliedCoupon(result.coupon)
      setCouponCode('')
    } else {
      setCouponError(result.error || 'Invalid coupon')
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 'shipping') {
      setStep('payment')
    } else if (step === 'payment') {
      setIsProcessing(true)
      
      // Simulate payment processing
      setTimeout(() => {
        // Create order
        const shippingAddress: ShippingAddress = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country
        }

        const order = orderManager.createOrder({
          items: items.map(item => ({
            id: item.id,
            productId: item.productId,
            variantId: item.variantId,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image || '',
            variant: item.variant
          })),
          subtotal,
          discount,
          couponCode: appliedCoupon?.code,
          shipping,
          tax,
          total,
          currency: 'INR',
          shippingAddress,
          status: 'pending',
          paymentStatus: 'paid'
        })

        setOrderId(order.id)
        setStep('confirmation')
        clearCart()
        
        // Simulate order status updates
        orderManager.simulateOrderProgress(order.id)
        
        setIsProcessing(false)
      }, 3000)
    }
  }

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">Add some products to your cart before checking out.</p>
        <Link
          href="/products"
          className="inline-flex items-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Continue Shopping
        </Link>
      </div>
    )
  }

  if (step === 'confirmation') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <Shield className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been confirmed and will be processed soon.
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold mb-2 text-lg">Order #{orderId}</h3>
          <p className="text-sm text-gray-600 mb-4">
            You will receive an email confirmation shortly with tracking information.
          </p>
          <div className="text-2xl font-bold text-green-600">
            {formatPrice(total)}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/orders')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Track Order
          </button>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <Link
          href="/products"
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Checkout Form */}
        <div>
          <div className="flex items-center mb-8">
            <div className={`flex items-center ${step === 'shipping' ? 'text-black' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'shipping' ? 'bg-black text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Shipping</span>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-4"></div>
            <div className={`flex items-center ${step === 'payment' ? 'text-black' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'payment' ? 'bg-black text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 'shipping' && (
              <>
                <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {step === 'payment' && (
              <>
                <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    name="nameOnCard"
                    value={formData.nameOnCard}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  {step === 'shipping' && (
                    <>
                      <Truck className="w-5 h-5 mr-2" />
                      Continue to Payment
                    </>
                  )}
                  {step === 'payment' && (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Complete Order - {formatPrice(total)}
                    </>
                  )}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={item.image || '/placeholder-product.jpg'}
                      alt={item.title}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                    {item.variant && (
                      <p className="text-xs text-gray-500">{item.variant}</p>
                    )}
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Section */}
            <div className="border-t border-b py-4 mb-4">
              <div className="flex items-center mb-3">
                <Tag className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Coupon Code</span>
              </div>
              
              {!appliedCoupon ? (
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim()}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Apply
                    </button>
                  </div>
                  
                  {couponError && (
                    <p className="text-red-600 text-sm">{couponError}</p>
                  )}

                  <div className="text-xs text-gray-500">
                    Available: {COUPONS.slice(0, 2).map(c => c.code).join(', ')}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-3">
                  <div>
                    <span className="text-sm font-medium text-green-800">{appliedCoupon.code}</span>
                    <p className="text-xs text-green-600">{appliedCoupon.description}</p>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-green-600 hover:text-green-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Tax (GST 18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-blue-600">{formatPrice(total)}</span>
              </div>
              
              {shipping > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Add {formatPrice(2000 - subtotal)} more for free shipping
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}