import { GetStaticProps, GetStaticPaths } from 'next'
import { useState } from 'react'
import Image from 'next/image'
import { getProduct, getProducts, formatPrice } from '../../lib/medusa'
import { useCart } from '../../lib/cart'
import { ShoppingBag, Heart, Share, Star } from 'lucide-react'

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

interface ProductPageProps {
  product: Product
}

export default function ProductPage({ product }: ProductPageProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const currentPrice = selectedVariant?.price || product.price

  const handleAddToCart = () => {
    addItem({
      id: selectedVariant?.id || product.id,
      productId: product.id,
      variantId: selectedVariant?.id,
      title: product.title,
      price: currentPrice,
      image: product.images[0],
      variant: selectedVariant?.title
    })
  }

  const handleBuyNow = () => {
    // Add item to cart first
    addItem({
      id: selectedVariant?.id || product.id,
      productId: product.id,
      variantId: selectedVariant?.id,
      title: product.title,
      price: currentPrice,
      image: product.images[0],
      variant: selectedVariant?.title
    })
    
    // Redirect to checkout page
    window.location.href = '/checkout'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.images[selectedImage] || '/placeholder-product.jpg'}
              alt={product.title}
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 ${
                    selectedImage === index ? 'border-black' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {product.brand}
              </span>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Share className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-sm text-gray-600">(4.8) 124 reviews</span>
              </div>
            </div>
            
            <p className="text-4xl font-bold text-gray-900 mb-6">
              {formatPrice(currentPrice)}
            </p>
          </div>

          <div className="prose prose-sm text-gray-600">
            <p>{product.description}</p>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                {product.category === 'shoes' ? 'Size' : 'Storage'}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`p-3 text-center border rounded-lg transition-colors ${
                      selectedVariant?.id === variant.id
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium">{variant.title}</div>
                    {variant.price !== product.price && (
                      <div className="text-sm text-gray-500">
                        {formatPrice(variant.price)}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <span className="text-xl font-medium w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-4 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
            
            <button 
              onClick={handleBuyNow}
              className="w-full border border-black text-black py-4 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Buy Now
            </button>
          </div>

          {/* Product Details */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-gray-600">Category</dt>
                <dd className="text-gray-900 capitalize">{product.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Brand</dt>
                <dd className="text-gray-900">{product.brand}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">SKU</dt>
                <dd className="text-gray-900">{product.id.toUpperCase()}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const products = await getProducts()
  const paths = products.map((product) => ({
    params: { id: product.id },
  }))

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const product = await getProduct(params?.id as string)

  if (!product) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      product,
    },
  }
}