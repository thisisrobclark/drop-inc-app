export interface Product {
  id: string
  name: string
  category: ProductCategory
  unit: string
  description: string
}

export type ProductCategory =
  | 'Glyphosate'
  | 'Pre-Emerge Herbicides'
  | 'Seed Treatment'
  | 'In-Crop Herbicides - Cereals'
  | 'In-Crop Herbicides - Canola'
  | 'In-Crop Herbicides - Pulses'
  | 'Fungicide'
  | 'Desiccant'
  | 'Insecticide'
  | 'Water Conditioner'

export const CATEGORIES: ProductCategory[] = [
  'Glyphosate',
  'Pre-Emerge Herbicides',
  'Seed Treatment',
  'In-Crop Herbicides - Cereals',
  'In-Crop Herbicides - Canola',
  'In-Crop Herbicides - Pulses',
  'Fungicide',
  'Desiccant',
  'Insecticide',
  'Water Conditioner',
]

export interface CartItem {
  product: Product
  quantity: number
}

export interface Profile {
  id: string
  email: string
  full_name: string
  farm_name: string
  phone: string
  physical_address: string
  mailing_address: string
  delivery_directions: string
  is_admin: boolean
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  status: OrderStatus
  notes: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
  order_items?: OrderItem[]
  order_tracking?: OrderTracking[]
}

export type OrderStatus = 'received' | 'invoiced' | 'paid' | 'ordered' | 'arrived' | 'delivered'

export const ORDER_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'received', label: 'Received' },
  { key: 'invoiced', label: 'Invoiced' },
  { key: 'paid', label: 'Paid' },
  { key: 'ordered', label: 'Ordered' },
  { key: 'arrived', label: 'Arrived' },
  { key: 'delivered', label: 'Delivered' },
]

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_category: string
  quantity: number
  unit: string
}

export interface OrderTracking {
  id: string
  order_id: string
  step_name: OrderStatus
  completed: boolean
  completed_at: string | null
  notes: string | null
}
