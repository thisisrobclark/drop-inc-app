import { useEffect, useState } from 'react'
import { ClipboardList, Package, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Order, ORDER_STEPS } from '../lib/types'

export default function MyOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    supabase
      .from('orders')
      .select('*, order_items(*), order_tracking(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data || [])
        setLoading(false)
      })
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-lime-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <ClipboardList className="w-12 h-12 mx-auto mb-4 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-300 mb-2">No orders yet</h2>
        <p className="text-sm text-gray-500">Your order history will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-100">My Orders</h1>

      <div className="space-y-3">
        {orders.map((order) => {
          const tracking = order.order_tracking || []
          const completedSteps = tracking.filter((t) => t.completed).length
          const isExpanded = expanded === order.id

          return (
            <div key={order.id} className="card">
              <button
                onClick={() => setExpanded(isExpanded ? null : order.id)}
                className="w-full flex items-center justify-between"
              >
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-100">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-CA', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {ORDER_STEPS.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full ${
                          idx < completedSteps ? 'bg-lime-500' : 'bg-dark-border'
                        }`}
                      />
                    ))}
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  />
                </div>
              </button>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-dark-border space-y-4">
                  {/* Status tracker */}
                  <div className="space-y-2">
                    {ORDER_STEPS.map((step) => {
                      const track = tracking.find((t) => t.step_name === step.key)
                      return (
                        <div key={step.key} className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                              track?.completed
                                ? 'bg-lime-500 text-dark'
                                : 'border border-dark-border'
                            }`}
                          >
                            {track?.completed && (
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm ${track?.completed ? 'text-gray-200' : 'text-gray-500'}`}>
                              {step.label}
                            </p>
                          </div>
                          {track?.completed_at && (
                            <span className="text-[10px] text-gray-600">
                              {new Date(track.completed_at).toLocaleDateString('en-CA')}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Items */}
                  {order.order_items && order.order_items.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Items</h4>
                      <div className="space-y-1">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-400 flex items-center gap-1.5">
                              <Package className="w-3 h-3" />
                              {item.product_name}
                            </span>
                            <span className="text-gray-300">
                              {item.quantity} {item.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
