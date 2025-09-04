// Order management system
export interface OrderItem {
  id: string
  productId: string
  variantId?: string
  title: string
  price: number
  quantity: number
  image: string
  variant?: string
}

export interface ShippingAddress {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  country: string
}

export interface Order {
  id: string
  items: OrderItem[]
  subtotal: number
  discount: number
  couponCode?: string
  shipping: number
  tax: number
  total: number
  currency: string
  shippingAddress: ShippingAddress
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  createdAt: number
  updatedAt: number
  estimatedDelivery?: number
  trackingNumber?: string
}

class OrderManager {
  private storageKey = 'orders'

  // Create a new order
  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
    const order: Order = {
      ...orderData,
      id: this.generateOrderId(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    const orders = this.getOrders()
    orders.push(order)
    this.saveOrders(orders)

    return order
  }

  // Get all orders
  getOrders(): Order[] {
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  // Get order by ID
  getOrder(id: string): Order | null {
    const orders = this.getOrders()
    return orders.find(order => order.id === id) || null
  }

  // Update order status
  updateOrderStatus(id: string, status: Order['status'], paymentStatus?: Order['paymentStatus']): boolean {
    const orders = this.getOrders()
    const orderIndex = orders.findIndex(order => order.id === id)
    
    if (orderIndex === -1) return false

    orders[orderIndex].status = status
    if (paymentStatus) {
      orders[orderIndex].paymentStatus = paymentStatus
    }
    orders[orderIndex].updatedAt = Date.now()

    // Set estimated delivery for shipped orders
    if (status === 'shipped' && !orders[orderIndex].estimatedDelivery) {
      orders[orderIndex].estimatedDelivery = Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
      orders[orderIndex].trackingNumber = this.generateTrackingNumber()
    }

    this.saveOrders(orders)
    return true
  }

  // Get orders by status
  getOrdersByStatus(status: Order['status']): Order[] {
    return this.getOrders().filter(order => order.status === status)
  }

  // Get recent orders
  getRecentOrders(limit: number = 10): Order[] {
    return this.getOrders()
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit)
  }

  // Calculate order statistics
  getOrderStats(): {
    totalOrders: number
    totalSpent: number
    averageOrderValue: number
    ordersByStatus: Record<Order['status'], number>
  } {
    const orders = this.getOrders()
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0

    const ordersByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<Order['status'], number>)

    return {
      totalOrders,
      totalSpent,
      averageOrderValue,
      ordersByStatus
    }
  }

  private saveOrders(orders: Order[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(orders))
  }

  private generateOrderId(): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    return `ORD-${timestamp}-${random}`.toUpperCase()
  }

  private generateTrackingNumber(): string {
    const prefix = 'ADY'
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substr(2, 6).toUpperCase()
    return `${prefix}${timestamp}${random}`
  }

  // Simulate order status updates (for demo)
  simulateOrderProgress(orderId: string): void {
    const statusFlow: Order['status'][] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
    let currentIndex = 0

    const updateStatus = () => {
      if (currentIndex < statusFlow.length) {
        this.updateOrderStatus(orderId, statusFlow[currentIndex])
        currentIndex++
        
        if (currentIndex < statusFlow.length) {
          // Random delay between 5-15 seconds for demo
          setTimeout(updateStatus, Math.random() * 10000 + 5000)
        }
      }
    }

    // Start after 2 seconds
    setTimeout(updateStatus, 2000)
  }
}

export const orderManager = new OrderManager()

// Order status helpers
export const getStatusColor = (status: Order['status']): string => {
  const colors = {
    pending: 'text-yellow-600 bg-yellow-100',
    confirmed: 'text-blue-600 bg-blue-100',
    processing: 'text-purple-600 bg-purple-100',
    shipped: 'text-indigo-600 bg-indigo-100',
    delivered: 'text-green-600 bg-green-100',
    cancelled: 'text-red-600 bg-red-100'
  }
  return colors[status] || 'text-gray-600 bg-gray-100'
}

export const getStatusText = (status: Order['status']): string => {
  const texts = {
    pending: 'Order Pending',
    confirmed: 'Order Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  }
  return texts[status] || status
}

export const getPaymentStatusColor = (status: Order['paymentStatus']): string => {
  const colors = {
    pending: 'text-yellow-600 bg-yellow-100',
    paid: 'text-green-600 bg-green-100',
    failed: 'text-red-600 bg-red-100',
    refunded: 'text-gray-600 bg-gray-100'
  }
  return colors[status] || 'text-gray-600 bg-gray-100'
}