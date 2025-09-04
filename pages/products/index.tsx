import { GetServerSideProps } from 'next'
import { useState, useEffect, useCallback } from 'react'
import { getProducts } from '../../lib/medusa'
import ProductCard from '../../components/ProductCard'
import { Filter, Grid, List, ChevronDown, X, Search } from 'lucide-react'

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

interface ProductsProps {
  products: Product[]
  category?: string
  search?: string
}

export default function Products({ products, category, search }: ProductsProps) {
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(category ? [category] : [])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  const [sortBy, setSortBy] = useState('relevance')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const brands = Array.from(new Set(products.map(p => p.brand))).sort()
  const categories = Array.from(new Set(products.map(p => p.category))).sort()
  const maxPrice = Math.max(...products.map(p => p.variants?.[0]?.price || p.price))

  const applyFilters = useCallback(() => {
    let filtered = products

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.brand.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      )
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand))
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category))
    }

    // Price filter
    filtered = filtered.filter(p => {
      const price = p.variants?.[0]?.price || p.price
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.variants?.[0]?.price || a.price) - (b.variants?.[0]?.price || b.price)
        case 'price-high':
          return (b.variants?.[0]?.price || b.price) - (a.variants?.[0]?.price || a.price)
        case 'name':
          return a.title.localeCompare(b.title)
        case 'brand':
          return a.brand.localeCompare(b.brand)
        case 'relevance':
        default:
          return 0
      }
    })

    setFilteredProducts(sorted)
  }, [products, selectedBrands, selectedCategories, priceRange, search, sortBy])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
  }

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) 
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    )
  }

  const clearFilters = () => {
    setSelectedBrands([])
    setSelectedCategories(category ? [category] : [])
    setPriceRange([0, maxPrice])
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {search ? `Search results for "${search}"` : 
               category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 
               'All Products'}
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">{filteredProducts.length} products found</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>

              {/* Sort Dropdown - Modern Design */}
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="brand">Brand A-Z</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>

            {/* View Mode Toggle - Hidden on mobile */}
            <div className="hidden sm:flex items-center bg-white border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-l-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-r-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>



        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 fixed top-20 sm:top-24 left-2 right-2 sm:left-4 sm:w-80 max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-7rem)] overflow-y-auto z-10 lg:relative lg:top-0 lg:left-0 lg:right-auto lg:max-h-none lg:overflow-visible lg:z-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>

              {/* Active Filters */}
              {(selectedBrands.length > 0 || selectedCategories.length > 0) && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Active Filters</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBrands.map(brand => (
                      <span key={brand} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {brand}
                        <button onClick={() => toggleBrand(brand)} className="ml-2">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {selectedCategories.filter(cat => cat !== category).map(cat => (
                      <span key={cat} className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        {cat}
                        <button onClick={() => toggleCategory(cat)} className="ml-2">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Categories Filter */}
              {!category && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <label key={cat} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">{cat}</span>
                        <span className="ml-auto text-xs text-gray-500">
                          ({products.filter(p => p.category === cat).length})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Brands</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{brand}</span>
                      <span className="ml-auto text-xs text-gray-500">
                        ({products.filter(p => p.brand === brand).length})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || maxPrice])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-4 sm:gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const products = await getProducts()
  const category = query.category as string || null
  const search = query.search as string || null
  
  let filteredProducts = products
  if (category) {
    filteredProducts = products.filter(p => p.category === category)
  }

  return {
    props: {
      products: filteredProducts,
      category,
      search,
    },
  }
}