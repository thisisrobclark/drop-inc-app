import { createContext, useContext, useState, ReactNode } from 'react'
import { Product, CartItem } from '../lib/types'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

interface CartState {
  items: CartItem[]
  addToCart: (product: Product, qty: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, qty: number) => void
  clearCart: () => void
  totalItems: number
  submitOrder: (notes?: string) => Promise<{ orderId: string | null; error: string | null }>
}

const CartContext = createContext<CartState | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { user } = useAuth()

  const addToCart = (product: Product, qty: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        )
      }
      return [...prev, { product, quantity: qty }]
    })
  }

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId))
  }

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
    )
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  const submitOrder = async (notes?: string) => {
    if (!user) return { orderId: null, error: 'Not authenticated' }
    if (items.length === 0) return { orderId: null, error: 'Cart is empty' }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ user_id: user.id, notes: notes || null })
      .select()
      .single()

    if (orderError) return { orderId: null, error: orderError.message }

    const orderItems = items.map((i) => ({
      order_id: order.id,
      product_id: i.product.id,
      product_name: i.product.name,
      product_category: i.product.category,
      quantity: i.quantity,
      unit: i.product.unit,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
    if (itemsError) return { orderId: null, error: itemsError.message }

    clearCart()
    return { orderId: order.id, error: null }
  }

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, submitOrder }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
