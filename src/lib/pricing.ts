import { PriceTier, Product, Profile } from './types'

/** Pick the right price tier for a given user. Falls back to retail if unknown. */
export function tierForUser(product: Product, profile: Profile | null): PriceTier {
  return profile?.is_shareholder ? product.shareholder : product.retail
}

const currencyFormatter = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  maximumFractionDigits: 2,
})

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

/** Short summary string for a tier — used on product cards. */
export function summarizeTier(tier: PriceTier): { headline: string; sub: string | null } {
  if (tier.byRequest) return { headline: 'By request', sub: null }
  if (tier.unitPrice == null && tier.acrePrice == null) return { headline: '—', sub: null }
  const headline = tier.unitPrice != null ? formatCurrency(tier.unitPrice) : '—'
  const sub = tier.acrePrice != null ? `${formatCurrency(tier.acrePrice)} / acre` : null
  return { headline, sub }
}
