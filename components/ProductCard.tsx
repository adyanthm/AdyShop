import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '../lib/medusa'
import { useCart } from '../lib/cart'
import { ShoppingBag, Heart, Star } from 'lucide-react'
import { useState } from 'react'

interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  category: string
  brand: string
  variants?: Array<{
    id: string
    title: string
    price: number
  }>
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, items, updateQuantity } = useCart()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [quantity, setQuantity] = useState(1)

  // Get current quantity in cart for this product
  const cartItemId = product.variants?.[0]?.id || product.id
  const cartItem = items.find(item => 
    item.productId === product.id && 
    item.variantId === (product.variants?.[0]?.id || undefined)
  )
  const currentCartQuantity = cartItem?.quantity || 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (quantity > 0) {
      if (cartItem) {
        // Update existing cart item quantity
        updateQuantity(cartItem.id, currentCartQuantity + quantity)
      } else {
        // Add new item with specified quantity
        addItem({
          id: cartItemId,
          productId: product.id,
          variantId: product.variants?.[0]?.id,
          title: product.title,
          price: product.variants?.[0]?.price || product.price,
          image: product.images[0],
          variant: product.variants?.[0]?.title
        })
        
        // Set the correct quantity if more than 1
        if (quantity > 1) {
          setTimeout(() => {
            updateQuantity(cartItemId, quantity)
          }, 100)
        }
      }

      // Show feedback
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
      
      // Reset quantity to 1 after adding
      setQuantity(1)
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 0) {
      setQuantity(newQuantity)
    }
  }

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  // Generate consistent rating based on product ID to avoid hydration issues
  const rating = 4 + (product.id.charCodeAt(0) % 2) // Consistent 4-5 stars based on ID
  const reviews = 50 + ((product.id.charCodeAt(0) + product.id.charCodeAt(product.id.length - 1)) % 450) // Consistent review count

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 pb-20 sm:pb-24">
      {/* Image and upper content - clickable link */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.images[0]}
            alt={product.title}
            width={400}
            height={400}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Brand badge */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <span className="text-xs font-medium text-gray-700">
              {product.brand}
            </span>
          </div>
        </div>
      </Link>

      {/* Wishlist button - outside link */}
      <button
        onClick={toggleWishlist}
        className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full backdrop-blur-sm transition-all duration-200 z-10 ${
          isWishlisted 
            ? 'bg-red-500 text-white' 
            : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
        }`}
      >
        <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>
      
      {/* Card content */}
      <div className="p-3 sm:p-4">
        <Link href={`/products/${product.id}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                    i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1 hidden sm:inline">({reviews})</span>
            </div>
            <span className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-1 rounded-full hidden sm:inline">
              {product.category}
            </span>
          </div>
          
          <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-black transition-colors">
            {product.title}
          </h3>
          
          <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2 hidden sm:block">
            {product.description}
          </p>
        </Link>
        
        {/* Price section - positioned above fixed controls */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              {formatPrice(product.variants?.[0]?.price || product.price)}
            </span>
            {product.variants && product.variants.length > 1 && (
              <span className="text-xs text-gray-500 hidden sm:inline">
                {product.variants.length} variants
              </span>
            )}
          </div>
          
          {currentCartQuantity > 0 && (
            <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
              {currentCartQuantity} in cart
            </div>
          )}
        </div>
      </div>

      {/* Fixed position controls at bottom - outside of scrollable content */}
      <div className="absolute bottom-8 sm:bottom-10 left-3 right-3 sm:left-4 sm:right-4">
        <div className="flex items-center justify-center space-x-2 sm:space-x-3">
          {/* Quantity Controls - Matched height with add to cart button */}
          <div className="flex items-center border border-gray-200 rounded-lg flex-shrink-0 bg-gray-50 h-10 sm:h-12">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleQuantityChange(quantity - 1)
              }}
              className="flex items-center justify-center w-8 sm:w-10 h-full hover:bg-gray-100 transition-colors rounded-l-lg"
              disabled={quantity <= 0}
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleQuantityChange(parseInt(e.target.value) || 0)
              }}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              className="w-10 sm:w-14 h-full text-center text-sm sm:text-base border-0 focus:outline-none bg-transparent font-medium"
              min="0"
            />
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleQuantityChange(quantity + 1)
              }}
              className="flex items-center justify-center w-8 sm:w-10 h-full hover:bg-gray-100 transition-colors rounded-r-lg"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          {/* Add to Cart Button - Matched height with quantity controls */}
          <button
            onClick={handleAddToCart}
            disabled={quantity <= 0}
            title={addedToCart ? "Added to cart!" : "Add to cart"}
            className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
              quantity <= 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : addedToCart
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
            }`}
          >
            {addedToCart ? (
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}