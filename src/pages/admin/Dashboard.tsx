import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { LayoutDashboard, ChevronRight, Search, Filter } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { Order, ORDER_STEPS, OrderStatus } from '../../lib/types'

export default function AdminDashboard() {
  const { profile } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')

  if (profile && !profile.is_admin) return <Navigate to="/catalog" replace />

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, profiles(full_name, farm_name, email, phone), order_items(*), order_tracking(*)')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  const filtered = orders.filter((o) => {
    const prof = o.profiles as any
    const matchSearch =
      search === '' ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      prof?.farm_name?.toLowerCase().includes(search.toLowerCase()) ||
      prof?.full_name?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const statusCounts = ORDER_STEPS.map((step) => ({
    ...step,
    count: orders.filter((o) => o.status === step.key).length,
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-lime-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="w-5 h-5 text-lime-500" />
        <h1 className="text-xl font-bold text-gray-100">Admin Dashboard</h1>
        <span className="text-xs text-gray-500 bg-dark-surface px-2 py-0.5 rounded-md">
          {orders.length} orders
        </span>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {statusCounts.map((s) => (
          <button
            key={s.key}
            onClick={() => setStatusFilter(statusFilter === s.key ? 'all' : s.key)}
            className={`card py-3 px-3 text-center transition-colors cursor-pointer ${
              statusFilter === s.key ? 'border-lime-500/40 bg-lime-500/5' : ''
            }`}
          >
            <p className="text-lg font-bold text-gray-100">{s.count}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 text-sm"
            placeholder="Search by farm, name, or order ID..."
          />
        </div>
        {statusFilter !== 'all' && (
          <button
            onClick={() => setStatusFilter('all')}
            className="btn-outline text-xs px-3 flex items-center gap-1"
          >
            <Filter className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Orders list */}
      <div className="space-y-2">
        {filtered.map((order) => {
          const prof = order.profiles as any
          const tracking = order.order_tracking || []
          const completedSteps = tracking.filter((t) => t.completed).length
          const itemCount = order.order_items?.length || 0

          return (
            <Link
              key={order.id}
              to={`/admin/orders/${order.id}`}
              className="card flex items-center gap-4 hover:border-lime-500/20 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-gray-100 truncate">
                    {prof?.farm_name || prof?.full_name || 'Unknown'}
                  </p>
                  <span className="text-[10px] text-gray-600 font-mono">
                    #{order.id.slice(0, 8)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>
                    {new Date(order.created_at).toLocaleDateString('en-CA', {
                      month: 'short', day: 'numeric',
                    })}
                  </span>
                  <span>{itemCount} items</span>
                  <span className="capitalize text-lime-500/70">{order.status}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {ORDER_STEPS.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-4 rounded-sm ${
                        idx < completedSteps ? 'bg-lime-500' : 'bg-dark-border'
                      }`}
                    />
                  ))}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-lime-500 transition-colors" />
              </div>
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-gray-500 py-10">No orders match your filters</p>
      )}
    </div>
  )
}
