import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2, Send, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalItems, submitOrder } = useCart()
  const navigate = useNavigate()
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    setSubmitting(true)
    const { orderId, error } = await submitOrder(notes)
    setSubmitting(false)

    if (error) {
      setError(error)
      return
    }

    navigate(`/order-confirmation/${orderId}`)
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-300 mb-2">Cart is empty</h2>
        <p className="text-sm text-gray-500 mb-6">Add products from the catalog to get started</p>
        <button onClick={() => navigate('/catalog')} className="btn-brand">
          <ArrowLeft className="w-4 h-4 inline mr-2" />
          Browse Catalog
        </button>
      </div>
    )
  }

  // Group by category
  const grouped = items.reduce(
    (acc, item) => {
      const cat = item.product.category
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(item)
      return acc
    },
    {} as Record<string, typeof items>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-100">Your Cart</h1>
        <span className="text-sm text-gray-400">{totalItems} items</span>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {Object.entries(grouped).map(([category, categoryItems]) => (
          <div key={category}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {category}
            </h3>
            <div className="space-y-2">
              {categoryItems.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="card flex items-center gap-3 py-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-100 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.unit}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      min="1"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        if (!isNaN(val)) updateQuantity(product.id, val)
                      }}
                      className="w-16 bg-dark-surface border border-dark-border rounded-lg px-2 py-1.5
                                 text-sm text-center text-gray-100 focus:outline-none focus:border-brand-400/50"
                    />
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Order notes */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1.5">
          Order Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input-field text-sm resize-none"
          rows={3}
          placeholder="Any special instructions or delivery notes..."
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="btn-brand w-full flex items-center justify-center gap-2"
      >
        <Send className="w-4 h-4" />
        {submitting ? 'Submitting Order...' : 'Submit Order'}
      </button>
    </div>
  )
}
