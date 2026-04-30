import { useEffect, useState } from 'react'
import { Search, ChevronRight, Package } from 'lucide-react'
import { Product, CATEGORIES, ProductCategory } from '../lib/types'
import { fetchProductsFromSheets, subscribeToProducts } from '../lib/googleSheets'
import ProductCard from '../components/ProductCard'

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all')

  useEffect(() => {
    fetchProductsFromSheets().then((p) => {
      setProducts(p)
      setLoading(false)
    })
    return subscribeToProducts((p) => setProducts(p))
  }, [])

  const filtered = products.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const groupedByCategory: Record<string, Product[]> = {}
  for (const p of filtered) {
    const key = (p.category && p.category.trim()) || 'Uncategorized'
    if (!groupedByCategory[key]) groupedByCategory[key] = []
    groupedByCategory[key].push(p)
  }

  const knownCategories = CATEGORIES.filter((c) => groupedByCategory[c])
  const unknownCategories = Object.keys(groupedByCategory)
    .filter((c) => !CATEGORIES.includes(c as ProductCategory))
    .sort()
  const orderedCategories = [...knownCategories, ...unknownCategories]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-gray-100">Product Catalog</h1>
        <span className="text-xs text-gray-500 bg-dark-surface px-2 py-0.5 rounded-md">
          {products.length} products
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10 text-sm"
          placeholder="Search products..."
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <button
          onClick={() => setActiveCategory('all')}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-brand-800 text-white'
              : 'bg-dark-surface text-gray-400 hover:text-gray-200'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-brand-800 text-white'
                : 'bg-dark-surface text-gray-400 hover:text-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      {orderedCategories.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No products found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orderedCategories.map((category) => {
            const items = groupedByCategory[category]
            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <ChevronRight className="w-4 h-4 text-brand-400" />
                  <h2 className="text-sm font-semibold text-gray-300">{category}</h2>
                  <span className="text-[10px] text-gray-600">({items.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
