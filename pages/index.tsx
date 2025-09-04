import { GetStaticProps } from 'next'
import Link from 'next/link'
import { getProducts } from '../lib/medusa'
import ProductCard from '../components/ProductCard'
import { ArrowRight, Smartphone, Laptop, Headphones } from 'lucide-react'

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

interface HomeProps {
  featuredProducts: Product[]
}

export default function Home({ featuredProducts }: HomeProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gray-800 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              🎉 New arrivals with up to 20% off
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Premium Tech & Fashion
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-gray-300 max-w-3xl mx-auto px-4">
              Discover the latest iPhones, MacBooks, Nike shoes and more with AdyShop!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base"
              >
                Shop Now
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                href="/products?category=smartphones"
                className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-white hover:text-black transition-all text-sm sm:text-base"
              >
                View Phones
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Link href="/products?category=smartphones" className="group">
              <div className="bg-white rounded-xl p-4 sm:p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 group-hover:text-black transition-colors">Smartphones</h3>
                <p className="text-gray-600 text-xs sm:text-sm hidden sm:block">Latest iPhones and Android devices</p>
              </div>
            </Link>
            <Link href="/products?category=laptops" className="group">
              <div className="bg-white rounded-xl p-4 sm:p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <Laptop className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 group-hover:text-gray-800 transition-colors">Laptops</h3>
                <p className="text-gray-600 text-xs sm:text-sm hidden sm:block">MacBooks and premium laptops</p>
              </div>
            </Link>
            <Link href="/products?category=shoes" className="group">
              <div className="bg-white rounded-xl p-4 sm:p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 18.5c0-.8.7-1.5 1.5-1.5h17c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-17c-.8 0-1.5-.7-1.5-1.5z"/>
                    <path d="M3 17h18c.6 0 1-.4 1-1v-1c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v1c0 .6.4 1 1 1z"/>
                    <path d="M4 13h16l-1-3H5l-1 3z"/>
                    <path d="M6 10h12c.6 0 1-.4 1-1V8c0-1.7-1.3-3-3-3H8c-1.7 0-3 1.3-3 3v1c0 .6.4 1 1 1z"/>
                    <path d="M8 7h8c.6 0 1 .4 1 1s-.4 1-1 1H8c-.6 0-1-.4-1-1s.4-1 1-1z"/>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 group-hover:text-gray-700 transition-colors">Shoes</h3>
                <p className="text-gray-600 text-xs sm:text-sm hidden sm:block">Nike, Adidas and premium footwear</p>
              </div>
            </Link>
            <Link href="/products?category=audio" className="group">
              <div className="bg-white rounded-xl p-4 sm:p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <Headphones className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 group-hover:text-gray-600 transition-colors">Audio</h3>
                <p className="text-gray-600 text-xs sm:text-sm hidden sm:block">Premium headphones and speakers</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold">Featured Products</h2>
            <Link
              href="/products"
              className="text-black hover:text-gray-700 font-medium flex items-center text-sm sm:text-base"
            >
              View All
              <ArrowRight className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-16 sm:py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
            ✨ Join our community
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Stay Updated
          </h2>
          
          <p className="text-gray-300 mb-8 sm:mb-10 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Get notified about new products, exclusive deals, and special offers before anyone else
          </p>
          
          <div className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row bg-white/10 backdrop-blur-sm rounded-2xl p-2 gap-2 sm:gap-0 border border-white/20">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 text-white placeholder-gray-300 bg-transparent focus:outline-none rounded-xl sm:rounded-l-xl sm:rounded-r-none text-base border-0 focus:ring-2 focus:ring-white/30"
              />
              <button className="bg-white text-black px-6 sm:px-8 py-4 rounded-xl sm:rounded-r-xl sm:rounded-l-none font-semibold hover:bg-gray-100 transition-all text-base whitespace-nowrap shadow-lg hover:shadow-xl transform hover:scale-105">
                Subscribe Now
              </button>
            </div>
            
            <div className="flex items-center justify-center mt-6 space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No spam
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unsubscribe anytime
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                10,000+ subscribers
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const products = await getProducts()
  const featuredProducts = products.slice(0, 8)

  return {
    props: {
      featuredProducts,
    },
  }
}