import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Save, Package, User, MapPin, Truck, MessageSquare } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useDemo } from '../../context/DemoContext'
import { Order, OrderTracking, ORDER_STEPS } from '../../lib/types'

export default function AdminOrderDetail() {
  const { orderId } = useParams()
  const { profile } = useAuth()
  const { isDemoMode, demoOrders, updateDemoTracking } = useDemo()
  const [order, setOrder] = useState<Order | null>(null)
  const [tracking, setTracking] = useState<OrderTracking[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  if (profile && !profile.is_admin) return <Navigate to="/catalog" replace />

  useEffect(() => {
    if (!orderId) return

    if (isDemoMode) {
      const found = demoOrders.find(o => o.id === orderId)
      if (found) {
        setOrder(found)
        setTracking(found.order_tracking || [])
      }
      setLoading(false)
      return
    }

    fetchOrder()
  }, [orderId, isDemoMode, demoOrders])

  const fetchOrder = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, profiles(full_name, farm_name, email, phone, physical_address, mailing_address, delivery_directions), order_items(*), order_tracking(*)')
      .eq('id', orderId)
      .single()

    if (data) {
      setOrder(data)
      setTracking(data.order_tracking || [])
    }
    setLoading(false)
  }

  const toggleStep = (stepName: string) => {
    setTracking((prev) =>
      prev.map((t) =>
        t.step_name === stepName
          ? {
              ...t,
              completed: !t.completed,
              completed_at: !t.completed ? new Date().toISOString() : null,
            }
          : t
      )
    )
  }

  const updateStepDate = (stepName: string, date: string) => {
    setTracking((prev) =>
      prev.map((t) =>
        t.step_name === stepName
          ? { ...t, completed_at: date ? new Date(date).toISOString() : null }
          : t
      )
    )
  }

  const updateStepNotes = (stepName: string, notes: string) => {
    setTracking((prev) =>
      prev.map((t) => (t.step_name === stepName ? { ...t, notes } : t))
    )
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveMsg('')

    // Find highest completed step to set order status
    const completedSteps = tracking.filter((t) => t.completed)
    const lastStep = ORDER_STEPS.reduce((last, step) => {
      if (completedSteps.find((t) => t.step_name === step.key)) return step.key
      return last
    }, 'received')

    if (isDemoMode) {
      // Persist to demo context
      if (orderId) {
        updateDemoTracking(orderId, tracking)
      }
      setSaving(false)
      setSaveMsg('Saved!')
      setTimeout(() => setSaveMsg(''), 2000)
      return
    }

    // Update each tracking row in Supabase
    for (const track of tracking) {
      await supabase
        .from('order_tracking')
        .update({
          completed: track.completed,
          completed_at: track.completed_at,
          notes: track.notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', track.id)
    }

    // Update order status
    await supabase
      .from('orders')
      .update({ status: lastStep, updated_at: new Date().toISOString() })
      .eq('id', orderId)

    setSaving(false)
    setSaveMsg('Saved!')
    setTimeout(() => setSaveMsg(''), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Order not found</p>
        <Link to="/admin" className="text-brand-400 text-sm mt-2 inline-block">Back to dashboard</Link>
      </div>
    )
  }

  const prof = order.profiles as any

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/admin" className="p-2 hover:bg-dark-hover rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-gray-100">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="text-xs text-gray-500">
            {new Date(order.created_at).toLocaleDateString('en-CA', {
              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      {/* Customer info */}
      <div className="card space-y-3">
        <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <User className="w-4 h-4 text-brand-400" />
          Customer
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-500">Name</p>
            <p className="text-gray-200">{prof?.full_name || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Farm</p>
            <p className="text-gray-200">{prof?.farm_name || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-gray-200">{prof?.email || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="text-gray-200">{prof?.phone || '—'}</p>
          </div>
        </div>
        {prof?.physical_address && (
          <div className="text-sm">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Physical Address
            </p>
            <p className="text-gray-300">{prof.physical_address}</p>
          </div>
        )}
        {prof?.delivery_directions && (
          <div className="text-sm">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Truck className="w-3 h-3" /> Delivery Directions
            </p>
            <p className="text-gray-300">{prof.delivery_directions}</p>
          </div>
        )}
      </div>

      {/* Order items */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-3">
          <Package className="w-4 h-4 text-brand-400" />
          Items ({order.order_items?.length || 0})
        </h3>
        <div className="space-y-2">
          {order.order_items?.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-dark-border last:border-0">
              <div>
                <p className="text-gray-200">{item.product_name}</p>
                <p className="text-xs text-gray-500">{item.product_category}</p>
              </div>
              <span className="text-gray-100 font-medium shrink-0 ml-4">
                {item.quantity} {item.unit}
              </span>
            </div>
          ))}
        </div>
        {order.notes && (
          <div className="mt-3 pt-3 border-t border-dark-border">
            <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
              <MessageSquare className="w-3 h-3" /> Customer Notes
            </p>
            <p className="text-sm text-gray-300">{order.notes}</p>
          </div>
        )}
      </div>

      {/* Status tracking */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Order Status Tracking</h3>
        <div className="space-y-4">
          {ORDER_STEPS.map((step) => {
            const track = tracking.find((t) => t.step_name === step.key)
            if (!track) return null

            return (
              <div key={step.key} className="border border-dark-border rounded-xl p-3 space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={track.completed}
                    onChange={() => toggleStep(step.key)}
                    className="w-5 h-5 rounded border-dark-border bg-dark-surface text-brand-400
                               focus:ring-brand-400/20 cursor-pointer"
                  />
                  <span className={`font-medium text-sm ${track.completed ? 'text-brand-400' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                </label>

                <div className="flex gap-2 pl-8">
                  <input
                    type="date"
                    value={track.completed_at ? track.completed_at.slice(0, 10) : ''}
                    onChange={(e) => updateStepDate(step.key, e.target.value)}
                    className="bg-dark-surface border border-dark-border rounded-lg px-3 py-1.5
                               text-xs text-gray-300 focus:outline-none focus:border-brand-400/50
                               w-40"
                  />
                  <input
                    type="text"
                    placeholder="Notes..."
                    value={track.notes || ''}
                    onChange={(e) => updateStepNotes(step.key, e.target.value)}
                    className="flex-1 bg-dark-surface border border-dark-border rounded-lg px-3 py-1.5
                               text-xs text-gray-300 placeholder-gray-600
                               focus:outline-none focus:border-brand-400/50"
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-dark-border">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-brand flex items-center gap-2 text-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {saveMsg && <span className="text-sm text-brand-400">{saveMsg}</span>}
        </div>
      </div>
    </div>
  )
}
