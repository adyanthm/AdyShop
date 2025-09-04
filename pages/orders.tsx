import { useState, useEffect } from 'react'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { orderManager, Order, getStatusColor, getStatusText, getPaymentStatusColor } from '../lib/orders'
import { formatPrice } from '../lib/medusa'
import { Package, Truck, CheckCircle, Clock, XCircle, Eye, ArrowLeft } from 'lucide-react'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filter, setFilter] = useState<'all' | Order['status']>('all')

  useEffect(() => {
    setOrders(orderManager.getOrders())
  }, [])

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter)

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'confirmed':
      case 'processing':
        return <Package className="w-4 h-4" />
      case 'shipped':
        return <Truck className="w-4 h-4" />
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 sm:mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </button>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Order #{selectedOrder.id}
                  </h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    Placed on {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <div className="flex flex-col space-y-2 sm:text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium self-start sm:self-end ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-2">{getStatusText(selectedOrder.status)}</span>
                  </div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium self-start sm:self-end ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                    Payment: {selectedOrder.paymentStatus}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-start sm:items-center space-x-3 sm:space-x-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base">{item.title}</h3>
                      {item.variant && (
                        <p className="text-xs sm:text-sm text-gray-600">{item.variant}</p>
                      )}
                      <p className="text-xs sm:text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-green-600 text-sm sm:text-base">
                    <span>Discount {selectedOrder.couponCode && `(${selectedOrder.couponCode})`}</span>
                    <span>-{formatPrice(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">{formatPrice(selectedOrder.shipping)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">{formatPrice(selectedOrder.tax)}</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-semibold border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
              <div className="text-gray-600 text-sm sm:text-base">
                <p className="font-medium text-gray-900">{selectedOrder.shippingAddress.name}</p>
                <p>{selectedOrder.shippingAddress.address}</p>
                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.pincode}</p>
                <p>{selectedOrder.shippingAddress.country}</p>
                <p className="mt-2">
                  <span className="font-medium">Email:</span> {selectedOrder.shippingAddress.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {selectedOrder.shippingAddress.phone}
                </p>
              </div>
            </div>

            {/* Tracking Info */}
            {selectedOrder.trackingNumber && (
              <div className="p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tracking Information</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm sm:text-base">
                    <span className="font-medium">Tracking Number:</span> {selectedOrder.trackingNumber}
                  </p>
                  {selectedOrder.estimatedDelivery && (
                    <p className="text-blue-800 mt-1 text-sm sm:text-base">
                      <span className="font-medium">Estimated Delivery:</span> {formatDate(selectedOrder.estimatedDelivery)}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Track and manage your orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="flex overflow-x-auto scrollbar-hide">
            {[
              { key: 'all', label: 'All Orders' },
              { key: 'pending', label: 'Pending' },
              { key: 'confirmed', label: 'Confirmed' },
              { key: 'processing', label: 'Processing' },
              { key: 'shipped', label: 'Shipped' },
              { key: 'delivered', label: 'Delivered' },
              { key: 'cancelled', label: 'Cancelled' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as 'all' | Order['status'])}
                className={`flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  filter === tab.key
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center">
                  {tab.label}
                  {tab.key !== 'all' && (
                    <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs min-w-[1.5rem] text-center">
                      {orders.filter(o => o.status === tab.key).length}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
          {/* Scroll indicator for mobile */}
          <div className="sm:hidden bg-gray-100 h-1">
            <div className="h-full bg-blue-600 w-1/7 transition-transform duration-300" style={{
              transform: `translateX(${['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].indexOf(filter) * 100}%)`
            }}></div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't placed any orders yet." 
                : `No ${filter} orders found.`
              }
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {formatDate(order.createdAt)} • {order.items.length} items
                      </p>
                    </div>
                    <div className="flex flex-col sm:text-right space-y-2">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium self-start sm:self-end ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-2">{getStatusText(order.status)}</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center"
                        >
                          <span className="text-xs font-medium text-gray-600">
                            {item.title.charAt(0)}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            +{order.items.length - 3}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center justify-center sm:justify-start px-4 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  }
}