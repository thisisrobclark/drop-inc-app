/**
 * Demo Mode — Mock data for exploring the app without Supabase.
 * Types match the existing DB schema: profiles, orders, order_items, order_tracking.
 */

import { Profile, Order, OrderItem, OrderTracking, ORDER_STEPS } from './types'

let idCounter = 1000
export function generateId(): string {
  return `demo-${Date.now()}-${idCounter++}`
}

// ── Demo Users (mimics Supabase auth User shape) ──────────────

export const DEMO_PARTNER_USER = {
  id: 'demo-partner-001',
  email: 'sarah@prairiegold.ca',
  aud: 'authenticated',
  role: 'authenticated',
  created_at: '2024-11-15T09:00:00Z',
  app_metadata: {},
  user_metadata: {},
} as any

export const DEMO_ADMIN_USER = {
  id: 'demo-admin-001',
  email: 'admin@cropshield.ca',
  aud: 'authenticated',
  role: 'authenticated',
  created_at: '2024-01-01T00:00:00Z',
  app_metadata: {},
  user_metadata: {},
} as any

// ── Demo Profiles ─────────────────────────────────────────────

export const DEMO_PARTNER_PROFILE: Profile = {
  id: 'demo-partner-001',
  email: 'sarah@prairiegold.ca',
  full_name: 'Sarah Mitchell',
  farm_name: 'Prairie Gold Farms',
  phone: '306-555-0147',
  physical_address: 'SW 14-36-4 W3, Saskatoon, SK',
  mailing_address: 'Box 204, Saskatoon, SK S7K 3J6',
  delivery_directions: 'Take Grid Road 732 south, farm is 2 miles past the co-op elevator. Yellow bins on the east side.',
  is_admin: false,
  created_at: '2024-11-15T09:00:00Z',
}

export const DEMO_ADMIN_PROFILE: Profile = {
  id: 'demo-admin-001',
  email: 'admin@cropshield.ca',
  full_name: 'CropShield Admin',
  farm_name: 'CropShield Chemicals Ltd',
  phone: '306-555-0100',
  physical_address: 'Saskatoon, SK',
  mailing_address: 'Saskatoon, SK',
  delivery_directions: '',
  is_admin: true,
  created_at: '2024-01-01T00:00:00Z',
}

const PARTNER_JAMES: Profile = {
  id: 'demo-partner-002',
  email: 'james@blackwoodgrain.ca',
  full_name: 'James Blackwood',
  farm_name: 'Blackwood Grain Co.',
  phone: '306-555-0231',
  physical_address: 'NE 22-18-7 W3, Swift Current, SK',
  mailing_address: 'Box 88, Swift Current, SK S9H 3V5',
  delivery_directions: 'Follow the signs past the white church. Grain bins on the right.',
  is_admin: false,
  created_at: '2024-12-01T10:00:00Z',
}

const PARTNER_EMILY: Profile = {
  id: 'demo-partner-003',
  email: 'emily@sunriseorganics.ca',
  full_name: 'Emily Chen',
  farm_name: 'Sunrise Organics',
  phone: '306-555-0389',
  physical_address: 'SE 8-42-2 W3, Rosthern, SK',
  mailing_address: 'Box 12, Rosthern, SK S0K 3R0',
  delivery_directions: '',
  is_admin: false,
  created_at: '2025-01-20T15:00:00Z',
}

export const DEMO_PARTNERS: Profile[] = [
  DEMO_PARTNER_PROFILE,
  PARTNER_JAMES,
  PARTNER_EMILY,
]

// ── Helper: create full tracking rows for an order ────────────

function createTrackingRows(
  orderId: string,
  completedUpTo: number, // index in ORDER_STEPS (0-based)
  dates: string[],       // ISO dates for each completed step
  notes: (string | null)[]
): OrderTracking[] {
  return ORDER_STEPS.map((step, idx) => ({
    id: generateId(),
    order_id: orderId,
    step_name: step.key,
    completed: idx <= completedUpTo,
    completed_at: idx <= completedUpTo ? (dates[idx] || new Date().toISOString()) : null,
    notes: idx <= completedUpTo ? (notes[idx] || null) : null,
  }))
}

// ── Seed Orders ───────────────────────────────────────────────

export function createSeedOrders(): Order[] {
  const now = new Date().toISOString()

  return [
    // Order 1 — Sarah, DELIVERED (full lifecycle)
    {
      id: 'demo-order-001',
      user_id: 'demo-partner-001',
      status: 'delivered',
      notes: null,
      created_at: '2025-01-15T09:30:00Z',
      updated_at: '2025-02-05T16:00:00Z',
      profiles: DEMO_PARTNER_PROFILE,
      order_items: [
        { id: 'di-001', order_id: 'demo-order-001', product_id: 'gly-01', product_name: 'Roundup WeatherMAX', product_category: 'Glyphosate', quantity: 20, unit: 'L' },
        { id: 'di-002', order_id: 'demo-order-001', product_id: 'fun-01', product_name: 'Prosaro XTR', product_category: 'Fungicide', quantity: 10, unit: 'L' },
        { id: 'di-003', order_id: 'demo-order-001', product_id: 'wc-01', product_name: 'Ammonium Sulphate (liquid)', product_category: 'Water Conditioner', quantity: 50, unit: 'L' },
      ],
      order_tracking: createTrackingRows('demo-order-001', 5, [
        '2025-01-15T09:30:00Z',
        '2025-01-16T10:00:00Z',
        '2025-01-20T14:15:00Z',
        '2025-01-21T08:30:00Z',
        '2025-02-03T11:00:00Z',
        '2025-02-05T16:00:00Z',
      ], [
        'Order submitted',
        'Invoice #INV-2025-041 sent via email',
        'E-transfer received',
        'Placed with supplier — ETA 2 weeks',
        'Container unloaded at yard',
        'Delivered by flatbed, signed off by Sarah',
      ]),
    },

    // Order 2 — James, PAID (mid-pipeline)
    {
      id: 'demo-order-002',
      user_id: 'demo-partner-002',
      status: 'paid',
      notes: 'Please try to deliver before seeding begins mid-May.',
      created_at: '2025-01-28T11:00:00Z',
      updated_at: '2025-02-06T09:00:00Z',
      profiles: PARTNER_JAMES,
      order_items: [
        { id: 'di-004', order_id: 'demo-order-002', product_id: 'can-01', product_name: 'Liberty 200 SN', product_category: 'In-Crop Herbicides - Canola', quantity: 40, unit: 'L' },
        { id: 'di-005', order_id: 'demo-order-002', product_id: 'pre-01', product_name: 'Prowl H2O', product_category: 'Pre-Emerge Herbicides', quantity: 25, unit: 'L' },
      ],
      order_tracking: createTrackingRows('demo-order-002', 2, [
        '2025-01-28T11:00:00Z',
        '2025-01-29T09:00:00Z',
        '2025-02-06T09:00:00Z',
      ], [
        'Order submitted',
        'Invoice emailed',
        'Cheque received',
      ]),
    },

    // Order 3 — Sarah, RECEIVED (brand new, actionable)
    {
      id: 'demo-order-003',
      user_id: 'demo-partner-001',
      status: 'received',
      notes: null,
      created_at: now,
      updated_at: now,
      profiles: DEMO_PARTNER_PROFILE,
      order_items: [
        { id: 'di-006', order_id: 'demo-order-003', product_id: 'fun-03', product_name: 'Stratego PRO', product_category: 'Fungicide', quantity: 15, unit: 'L' },
        { id: 'di-007', order_id: 'demo-order-003', product_id: 'cer-01', product_name: 'Axial BIA', product_category: 'In-Crop Herbicides - Cereals', quantity: 10, unit: 'L' },
        { id: 'di-008', order_id: 'demo-order-003', product_id: 'des-01', product_name: 'Reglone', product_category: 'Desiccant', quantity: 30, unit: 'L' },
        { id: 'di-009', order_id: 'demo-order-003', product_id: 'ins-01', product_name: 'Silencer 120 EC', product_category: 'Insecticide', quantity: 5, unit: 'L' },
      ],
      order_tracking: createTrackingRows('demo-order-003', 0, [
        now,
      ], [
        'Order submitted',
      ]),
    },

    // Order 4 — Emily, RECEIVED (brand new)
    {
      id: 'demo-order-004',
      user_id: 'demo-partner-003',
      status: 'received',
      notes: 'Organic products only please.',
      created_at: now,
      updated_at: now,
      profiles: PARTNER_EMILY,
      order_items: [
        { id: 'di-010', order_id: 'demo-order-004', product_id: 'pul-01', product_name: 'Basagran Forte', product_category: 'In-Crop Herbicides - Pulses', quantity: 20, unit: 'L' },
        { id: 'di-011', order_id: 'demo-order-004', product_id: 'wc-03', product_name: 'LI 700', product_category: 'Water Conditioner', quantity: 10, unit: 'L' },
      ],
      order_tracking: createTrackingRows('demo-order-004', 0, [
        now,
      ], [
        'Order submitted',
      ]),
    },
  ]
}
