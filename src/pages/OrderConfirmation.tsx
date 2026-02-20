import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, ClipboardList, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { OrderItem } from '../lib/types'

export default function OrderConfirmation() {
  const { orderId } = useParams()
  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) return
    supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)
      .then(({ data }) => {
        setItems(data || [])
        setLoading(false)
      })
  }, [orderId])

  return (
    <div className="max-w-lg mx-auto py-8 text-center">
      <div className="w-16 h-16 bg-brand-400/10 rounded-full flex items-center justify-center mx-auto mb-5">
        <CheckCircle className="w-9 h-9 text-brand-400" />
      </div>

      <h1 className="text-2xl font-bold text-gray-100 mb-2">Order Submitted!</h1>
      <p className="text-sm text-gray-400 mb-1">Your order has been received and is being processed.</p>
      <p className="text-xs text-gray-600 font-mono mb-6">Order ID: {orderId?.slice(0, 8)}</p>

      {!loading && items.length > 0 && (
        <div className="card text-left mb-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Order Summary</h3>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-400">{item.product_name}</span>
                <span className="text-gray-200 font-medium">
                  {item.quantity} {item.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/my-orders" className="btn-brand inline-flex items-center justify-center gap-2">
          <ClipboardList className="w-4 h-4" />
          View My Orders
        </Link>
        <Link to="/catalog" className="btn-outline inline-flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
