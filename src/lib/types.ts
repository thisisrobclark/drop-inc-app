export interface PriceTier {
  /** Per-unit price in dollars (null if unknown or quoted on request). */
  unitPrice: number | null
  /** Per-acre price in dollars (null if unknown). */
  acrePrice: number | null
  /** True if the sheet says "by request" for this tier — pricing is custom-quoted. */
  byRequest: boolean
}

export interface Product {
  id: string
  name: string
  category: ProductCategory
  unit: string
  description: string
  /** Pricing visible to CropShield shareholders (lower tier). */
  shareholder: PriceTier
  /** Pricing visible to non-shareholders (retail). */
  retail: PriceTier
  /** Acres covered per unit, if known. Useful for explaining per-acre price. */
  acresPerUnit: number | null
}

export type ProductCategory =
  | 'Glyphosate'
  | 'Glufosinate'
  | 'Pre-Emerge Herbicides'
  | 'Seed Treatment'
  | 'In-Crop Herbicides - Cereals'
  | 'In-Crop Herbicides - Canola'
  | 'In-Crop Herbicides - Pulses'
  | 'Fungicide'
  | 'Desiccant'
  | 'Diquat'
  | 'Insecticide'
  | 'Surfactant'
  | 'Water Conditioner'

export const CATEGORIES: ProductCategory[] = [
  'Glyphosate',
  'Glufosinate',
  'Pre-Emerge Herbicides',
  'Seed Treatment',
  'In-Crop Herbicides - Cereals',
  'In-Crop Herbicides - Canola',
  'In-Crop Herbicides - Pulses',
  'Fungicide',
  'Desiccant',
  'Diquat',
  'Insecticide',
  'Surfactant',
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
  /** True if the user is a CropShield shareholder and should see the discounted price tier. */
  is_shareholder: boolean
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
