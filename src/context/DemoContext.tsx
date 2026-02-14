import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react'
import {
  DEMO_PARTNER_USER,
  DEMO_PARTNER_PROFILE,
  DEMO_ADMIN_USER,
  DEMO_ADMIN_PROFILE,
  DEMO_PARTNERS,
  createSeedOrders,
  generateId,
} from '../lib/demoData'
import { Order, OrderTracking, ORDER_STEPS, Profile } from '../lib/types'

interface DemoState {
  isDemoMode: boolean
  demoRole: 'partner' | 'admin' | null
  demoOrders: Order[]
  demoPartners: Profile[]
  enterDemo: (role: 'partner' | 'admin') => void
  exitDemo: () => void
  getDemoUser: () => any
  getDemoProfile: () => Profile | null
  getDemoSession: () => any
  addDemoOrder: (userId: string, items: Order['order_items']) => Order
  updateDemoTracking: (orderId: string, tracking: OrderTracking[]) => void
  updateDemoOrderStatus: (orderId: string, status: string) => void
}

const DemoContext = createContext<DemoState | undefined>(undefined)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [demoRole, setDemoRole] = useState<'partner' | 'admin' | null>(null)
  const [demoOrders, setDemoOrders] = useState<Order[]>([])

  function enterDemo(role: 'partner' | 'admin') {
    setDemoRole(role)
    setDemoOrders(createSeedOrders())
    setIsDemoMode(true)
  }

  function exitDemo() {
    setIsDemoMode(false)
    setDemoRole(null)
    setDemoOrders([])
  }

  function getDemoUser() {
    if (!isDemoMode) return null
    return demoRole === 'admin' ? DEMO_ADMIN_USER : DEMO_PARTNER_USER
  }

  function getDemoProfile(): Profile | null {
    if (!isDemoMode) return null
    return demoRole === 'admin' ? DEMO_ADMIN_PROFILE : DEMO_PARTNER_PROFILE
  }

  function getDemoSession() {
    if (!isDemoMode) return null
    return { user: getDemoUser(), access_token: 'demo-token' }
  }

  const addDemoOrder = useCallback((userId: string, items: Order['order_items']) => {
    const now = new Date().toISOString()
    const id = generateId()
    const partner = DEMO_PARTNERS.find(p => p.id === userId) || DEMO_PARTNER_PROFILE

    const newOrder: Order = {
      id,
      user_id: userId,
      status: 'received',
      notes: null,
      created_at: now,
      updated_at: now,
      profiles: partner,
      order_items: items,
      order_tracking: ORDER_STEPS.map((step, idx) => ({
        id: generateId(),
        order_id: id,
        step_name: step.key,
        completed: idx === 0,
        completed_at: idx === 0 ? now : null,
        notes: idx === 0 ? 'Order submitted' : null,
      })),
    }

    setDemoOrders(prev => [newOrder, ...prev])
    return newOrder
  }, [])

  const updateDemoTracking = useCallback((orderId: string, tracking: OrderTracking[]) => {
    setDemoOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order
        // Determine the new status from tracking
        const completedSteps = tracking.filter(t => t.completed)
        const lastStep = ORDER_STEPS.reduce((last, step) => {
          if (completedSteps.find(t => t.step_name === step.key)) return step.key
          return last
        }, 'received' as string)

        return {
          ...order,
          status: lastStep as Order['status'],
          updated_at: new Date().toISOString(),
          order_tracking: tracking,
        }
      })
    )
  }, [])

  const updateDemoOrderStatus = useCallback((orderId: string, status: string) => {
    setDemoOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status: status as Order['status'], updated_at: new Date().toISOString() }
          : order
      )
    )
  }, [])

  const demoPartners = useMemo(() => {
    if (!isDemoMode) return []
    return DEMO_PARTNERS
  }, [isDemoMode])

  return (
    <DemoContext.Provider
      value={{
        isDemoMode,
        demoRole,
        demoOrders,
        demoPartners,
        enterDemo,
        exitDemo,
        getDemoUser,
        getDemoProfile,
        getDemoSession,
        addDemoOrder,
        updateDemoTracking,
        updateDemoOrderStatus,
      }}
    >
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used within DemoProvider')
  return ctx
}
