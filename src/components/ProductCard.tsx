import { useState } from 'react'
import { Plus, Check } from 'lucide-react'
import { Product } from '../lib/types'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }: { product: Product }) {
  const { items, addToCart } = useCart()
  const [qty, setQty] = useState('')
  const [added, setAdded] = useState(false)

  const inCart = items.find((i) => i.product.id === product.id)

  const handleAdd = () => {
    const n = parseInt(qty) || 1
    if (n <= 0) return
    addToCart(product, n)
    setQty('')
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="card flex flex-col gap-2 group hover:border-dark-hover transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-100 text-sm leading-tight truncate">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{product.description}</p>
        </div>
        <span className="text-[10px] font-medium text-lime-500/70 bg-lime-500/10 px-2 py-0.5 rounded-md shrink-0 uppercase">
          {product.unit}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-auto pt-1">
        <input
          type="number"
          inputMode="numeric"
          min="1"
          placeholder="Qty"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="w-16 bg-dark-surface border border-dark-border rounded-lg px-2 py-1.5 text-sm text-center
                     text-gray-100 placeholder-gray-600 focus:outline-none focus:border-lime-500/50
                     transition-colors"
        />
        <button
          onClick={handleAdd}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            added
              ? 'bg-lime-500/20 text-lime-400'
              : 'bg-lime-500/10 text-lime-500 hover:bg-lime-500/20 active:bg-lime-500/30'
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Added
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              Add
            </>
          )}
        </button>
      </div>

      {inCart && (
        <p className="text-[10px] text-lime-500/60 text-center">
          {inCart.quantity} {product.unit} in cart
        </p>
      )}
    </div>
  )
}
