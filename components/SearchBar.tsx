import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/router'
import { mockProducts } from '../lib/medusa'

interface SearchResult {
  id: string
  title: string
  brand: string
  category: string
  price: number
}

interface SearchBarProps {
  onClose?: () => void
  autoFocus?: boolean
  expanded?: boolean
  onBlur?: () => void
}

export default function SearchBar({ onClose, autoFocus = false, expanded = false, onBlur }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  useEffect(() => {
    if (query.trim().length > 0) {
      const searchResults = searchProducts(query)
      setResults(searchResults)
      setIsOpen(true)
      setSelectedIndex(-1)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query])

  const searchProducts = (searchQuery: string): SearchResult[] => {
    const lowercaseQuery = searchQuery.toLowerCase()
    
    return mockProducts
      .filter(product => 
        product.title.toLowerCase().includes(lowercaseQuery) ||
        product.brand.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery)
      )
      .slice(0, 8)
      .map(product => ({
        id: product.id,
        title: product.title,
        brand: product.brand,
        category: product.category,
        price: product.price
      }))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex])
        } else if (query.trim()) {
          handleSearch()
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        if (onClose) onClose()
        break
    }
  }

  const handleResultClick = (result: SearchResult) => {
    router.push(`/products/${result.id}`)
    setQuery('')
    setIsOpen(false)
    if (onClose) onClose()
  }

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setIsOpen(false)
      if (onClose) onClose()
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price)
  }

  return (
    <div className="relative flex-1 max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={onBlur}
          placeholder="Search products, brands..."
          className={`w-full pl-9 sm:pl-10 pr-10 py-2 sm:py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-0 focus:border-gray-400 bg-white shadow-sm text-sm sm:text-base ${
            expanded ? 'bg-gray-50' : ''
          }`}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setIsOpen(false)
              if (onClose) onClose()
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-96 overflow-y-auto">
            <div className="p-2">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-gray-50 rounded-md transition-colors ${
                    index === selectedIndex ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {result.brand.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {result.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {result.brand} • {result.category}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(result.price)}
                  </div>
                </button>
              ))}
              
              {query.trim() && (
                <button
                  onClick={handleSearch}
                  className="w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-gray-50 rounded-md transition-colors border-t border-gray-100 mt-2 pt-3"
                >
                  <Search className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    Search for &quot;<span className="font-medium">{query}</span>&quot;
                  </span>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}