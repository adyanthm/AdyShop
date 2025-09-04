import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '../lib/cart'
import { formatPrice } from '../lib/medusa'
import Link from 'next/link'
import Image from 'next/image'

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const { items, updateQuantity, removeItem } = useCart()

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0)
  const shipping = subtotal > 2000 ? 0 : 200 // Free shipping above ₹2000
  const tax = Math.round(subtotal * 0.18) // 18% GST
  const total = subtotal + shipping + tax

  return (
    <Dialog open={isOpen || false} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel className="pointer-events-auto w-screen max-w-md transform transition-transform duration-500 ease-in-out data-[closed]:translate-x-full">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <DialogTitle className="text-lg font-medium text-gray-900 flex items-center">
                          <ShoppingBag className="w-5 h-5 mr-2" />
                          Shopping Cart ({items.length})
                        </DialogTitle>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={onClose}
                          >
                            <X className="h-6 w-6" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          {items.length === 0 ? (
                            <div className="text-center py-12">
                              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                              <p className="text-gray-500 mb-4">Your cart is empty</p>
                              <Link
                                href="/products"
                                className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-all"
                                onClick={onClose}
                              >
                                Continue Shopping
                              </Link>
                            </div>
                          ) : (
                            <ul className="-my-6 divide-y divide-gray-200">
                              {items.map((item) => (
                                <li key={item.id} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <Image
                                      src={item.image || '/placeholder-product.jpg'}
                                      alt={item.title}
                                      width={96}
                                      height={96}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3 className="line-clamp-2">{item.title}</h3>
                                        <p className="ml-4">{formatPrice(item.price)}</p>
                                      </div>
                                      {item.variant && (
                                        <p className="mt-1 text-sm text-gray-500">{item.variant}</p>
                                      )}
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <div className="flex items-center space-x-2">
                                        <button
                                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                          className="p-1 hover:bg-gray-100 rounded"
                                        >
                                          <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="text-gray-500">Qty {item.quantity}</span>
                                        <button
                                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                          className="p-1 hover:bg-gray-100 rounded"
                                        >
                                          <Plus className="w-4 h-4" />
                                        </button>
                                      </div>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          className="font-medium text-red-600 hover:text-red-500"
                                          onClick={() => removeItem(item.id)}
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>

                    {items.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        {/* Order Summary */}
                        <div className="space-y-2 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="text-gray-900">{formatPrice(subtotal)}</span>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shipping</span>
                            <span className="text-gray-900">
                              {shipping === 0 ? 'Free' : formatPrice(shipping)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tax (GST)</span>
                            <span className="text-gray-900">{formatPrice(tax)}</span>
                          </div>
                          
                          <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                          </div>
                          
                          {shipping > 0 && (
                            <p className="text-xs text-gray-500">
                              Add {formatPrice(2000 - subtotal)} more for free shipping
                            </p>
                          )}
                        </div>

                        <div className="space-y-3">
                          <Link
                            href="/checkout"
                            className="flex items-center justify-center rounded-lg bg-black px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800 transition-all"
                            onClick={onClose}
                          >
                            Proceed to Checkout
                          </Link>
                          
                          <button
                            type="button"
                            className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
                            onClick={onClose}
                          >
                            Continue Shopping →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}