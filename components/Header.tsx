import Link from 'next/link'
import { ShoppingBag, Package, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCart } from '../lib/cart'
import Cart from './Cart'
import SearchBar from './SearchBar'

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { items } = useCart()

  useEffect(() => {
    setMounted(true)
  }, [])

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center h-14 sm:h-16">
            {/* Logo - Fixed Position */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <div className="text-black font-bold text-xl sm:text-2xl tracking-tight">
                Ady<span className="text-blue-600">Shop</span>
              </div>
            </Link>

            {/* Desktop Search Bar - Center Aligned */}
            <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
              <div 
                className={`transition-all duration-500 ease-in-out ${
                  isSearchExpanded ? 'w-[600px]' : 'w-80'
                }`}
                onClick={() => setIsSearchExpanded(true)}
              >
                <SearchBar 
                  expanded={isSearchExpanded}
                  onBlur={() => setIsSearchExpanded(false)}
                />
              </div>
            </div>

            {/* Navigation Icons - Absolutely Positioned Right */}
            <div className="absolute right-0 flex items-center space-x-1">
              {/* Mobile Search Button */}
              <button
                onClick={() => setIsMobileSearchOpen(true)}
                className="md:hidden text-gray-700 hover:text-black transition-colors p-2"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link 
                href="/products" 
                className="text-gray-700 hover:text-black transition-colors px-2 sm:px-3 py-2 font-medium text-sm sm:text-base hidden sm:block"
              >
                Products
              </Link>
              
              <Link 
                href="/orders" 
                className="text-gray-700 hover:text-black transition-colors p-2"
                title="Orders"
              >
                <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-700 hover:text-black transition-colors p-2"
                title="Cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-medium">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {isMobileSearchOpen && (
          <>
            {/* Backdrop - only dims content below header */}
            <div 
              className="md:hidden fixed inset-0 bg-black bg-opacity-25 z-30"
              style={{ top: '56px' }} // Start below the header
              onClick={() => setIsMobileSearchOpen(false)}
            />
            {/* Search Overlay */}
            <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-4 z-40 shadow-lg">
              <SearchBar 
                autoFocus={true}
                onClose={() => setIsMobileSearchOpen(false)}
                onBlur={() => setIsMobileSearchOpen(false)}
              />
            </div>
          </>
        )}
      </header>

      {/* Cart Sidebar */}
      {mounted && (
        <Cart 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)}
        />
      )}
    </>
  )
}