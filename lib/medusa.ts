import Medusa from "@medusajs/medusa-js"

// For demo purposes, we'll use mock data instead of a real Medusa backend
// In production, you'd connect to your Medusa server
export const medusaClient = new Medusa({ 
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  maxRetries: 3,
})

// Mock product data - 5 products per category with different brands
export const mockProducts = [
  // Smartphones - 5 different brands
  {
    id: "iphone-15-pro",
    title: "iPhone 15 Pro",
    description: "The most advanced iPhone yet with titanium design and A17 Pro chip",
    price: 99999,
    images: ["/placeholder-product.png"],
    category: "smartphones",
    brand: "Apple"
  },
  {
    id: "samsung-galaxy-s24",
    title: "Samsung Galaxy S24 Ultra",
    description: "The ultimate Galaxy experience with S Pen and AI-powered features",
    price: 119999,
    images: ["/placeholder-product.png"],
    category: "smartphones",
    brand: "Samsung"
  },
  {
    id: "google-pixel-8",
    title: "Google Pixel 8 Pro",
    description: "AI-powered photography and pure Android experience",
    price: 84999,
    images: ["/placeholder-product.png"],
    category: "smartphones",
    brand: "Google"
  },
  {
    id: "oneplus-12",
    title: "OnePlus 12",
    description: "Flagship performance with OxygenOS and fast charging",
    price: 64999,
    images: ["/placeholder-product.png"],
    category: "smartphones",
    brand: "OnePlus"
  },
  {
    id: "xiaomi-14-ultra",
    title: "Xiaomi 14 Ultra",
    description: "Professional photography with Leica cameras",
    price: 79999,
    images: ["/placeholder-product.png"],
    category: "smartphones",
    brand: "Xiaomi"
  },

  // Laptops - 5 different brands
  {
    id: "macbook-pro-16",
    title: "MacBook Pro 16-inch",
    description: "Supercharged by M3 Pro and M3 Max chips for demanding workflows",
    price: 249999,
    images: ["/placeholder-product.png"],
    category: "laptops",
    brand: "Apple"
  },
  {
    id: "dell-xps-13",
    title: "Dell XPS 13",
    description: "Premium ultrabook with InfinityEdge display and 12th Gen Intel processors",
    price: 99999,
    images: ["/placeholder-product.png"],
    category: "laptops",
    brand: "Dell"
  },
  {
    id: "surface-laptop-5",
    title: "Microsoft Surface Laptop 5",
    description: "Sleek, ultra-thin laptop with premium materials",
    price: 129999,
    images: ["/placeholder-product.png"],
    category: "laptops",
    brand: "Microsoft"
  },
  {
    id: "lenovo-thinkpad-x1",
    title: "Lenovo ThinkPad X1 Carbon",
    description: "Business laptop with legendary ThinkPad reliability",
    price: 149999,
    images: ["/placeholder-product.png"],
    category: "laptops",
    brand: "Lenovo"
  },
  {
    id: "hp-spectre-x360",
    title: "HP Spectre x360",
    description: "Premium 2-in-1 laptop with stunning design",
    price: 119999,
    images: ["/placeholder-product.png"],
    category: "laptops",
    brand: "HP"
  },

  // Shoes - 5 different brands
  {
    id: "air-jordan-1",
    title: "Air Jordan 1 Retro High OG",
    description: "The original that started it all. Classic basketball style meets street culture",
    price: 17000,
    images: ["/placeholder-product.png"],
    category: "shoes",
    brand: "Nike"
  },
  {
    id: "adidas-ultraboost-22",
    title: "Adidas Ultraboost 22",
    description: "Made with Primeblue, a high-performance recycled material",
    price: 18000,
    images: ["/placeholder-product.png"],
    category: "shoes",
    brand: "Adidas"
  },
  {
    id: "converse-chuck-taylor",
    title: "Converse Chuck Taylor All Star",
    description: "The original basketball shoe, an American icon",
    price: 5500,
    images: ["/placeholder-product.png"],
    category: "shoes",
    brand: "Converse"
  },
  {
    id: "vans-old-skool",
    title: "Vans Old Skool",
    description: "The classic skate shoe with the iconic side stripe",
    price: 6500,
    images: ["/placeholder-product.png"],
    category: "shoes",
    brand: "Vans"
  },
  {
    id: "puma-suede-classic",
    title: "Puma Suede Classic",
    description: "Iconic basketball shoe turned street style staple",
    price: 7000,
    images: ["/placeholder-product.png"],
    category: "shoes",
    brand: "Puma"
  },

  // Audio - 5 different brands
  {
    id: "airpods-pro-2",
    title: "AirPods Pro (2nd generation)",
    description: "Up to 2x more Active Noise Cancellation",
    price: 24999,
    images: ["/placeholder-product.png"],
    category: "audio",
    brand: "Apple"
  },
  {
    id: "sony-wh1000xm5",
    title: "Sony WH-1000XM5",
    description: "Industry-leading noise canceling headphones with crystal clear hands-free calling",
    price: 39999,
    images: ["/placeholder-product.png"],
    category: "audio",
    brand: "Sony"
  },
  {
    id: "bose-quietcomfort-45",
    title: "Bose QuietComfort 45",
    description: "World-class noise cancellation in a comfortable design",
    price: 32999,
    images: ["/placeholder-product.png"],
    category: "audio",
    brand: "Bose"
  },
  {
    id: "sennheiser-momentum-4",
    title: "Sennheiser Momentum 4",
    description: "Audiophile sound with adaptive noise cancellation",
    price: 34999,
    images: ["/placeholder-product.png"],
    category: "audio",
    brand: "Sennheiser"
  },
  {
    id: "beats-studio-3",
    title: "Beats Studio3 Wireless",
    description: "Premium sound with Pure Adaptive Noise Canceling",
    price: 34999,
    images: ["/placeholder-product.png"],
    category: "audio",
    brand: "Beats"
  }
]

export const getProducts = async () => {
  // In a real app, this would fetch from Medusa backend
  return mockProducts
}

export const getProduct = async (id: string) => {
  return mockProducts.find(product => product.id === id)
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price)
}