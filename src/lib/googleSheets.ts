import { Product, ProductCategory, PriceTier } from './types'
import { fallbackProducts } from '../data/products'

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_ID
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY
// Columns: A=ID  B=Category  C=Name  D=Branded-comparable  E=Active-ingredients
//          F=Rate  G=Unit-size  H=Acres-per-unit  I=Units-per-skid
//          J=Shareholder-unit  K=Shareholder-per-acre  L=Retail-unit  M=Retail-per-acre
const RANGE = 'products!A2:M200'

function parseNumberCell(raw: string | undefined): number | null {
  const trimmed = (raw ?? '').trim()
  if (!trimmed) return null
  const cleaned = trimmed.replace(/[$,\s]/g, '')
  const n = parseFloat(cleaned)
  return Number.isFinite(n) ? n : null
}

function parsePriceTier(unitCell: string | undefined, acreCell: string | undefined): PriceTier {
  const unit = (unitCell ?? '').trim()
  const acre = (acreCell ?? '').trim()
  // "by request" can appear in either cell; treat the whole tier as quoted-on-request.
  const byRequest = /by\s*request/i.test(unit) || /by\s*request/i.test(acre)
  return {
    unitPrice: byRequest ? null : parseNumberCell(unit),
    acrePrice: byRequest ? null : parseNumberCell(acre),
    byRequest,
  }
}

function parseRow(row: string[]): Product | null {
  const id = row[0]?.trim() ?? ''
  const category = row[1]?.trim() ?? ''
  const name = row[2]?.trim() ?? ''
  if (!id || !name) return null
  const branded = row[3]?.trim() ?? ''
  const ingredients = row[4]?.trim() ?? ''
  const unit = row[6]?.trim() ?? ''
  const acresPerUnit = parseNumberCell(row[7])
  const shareholder = parsePriceTier(row[9], row[10])
  const retail = parsePriceTier(row[11], row[12])
  const description = [branded ? `Like ${branded}` : '', ingredients]
    .filter(Boolean)
    .join(' • ')
  return {
    id,
    name,
    category: category as ProductCategory,
    unit,
    description,
    shareholder,
    retail,
    acresPerUnit,
  }
}

let cachedProducts: Product[] | null = null
const subscribers = new Set<(products: Product[]) => void>()

export function subscribeToProducts(cb: (products: Product[]) => void): () => void {
  subscribers.add(cb)
  return () => {
    subscribers.delete(cb)
  }
}

async function loadFromSheets(bypassHttpCache: boolean): Promise<Product[]> {
  if (!SHEET_ID || !API_KEY) {
    console.log('Google Sheets not configured, using fallback product data')
    return fallbackProducts
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}${
    bypassHttpCache ? `&_=${Date.now()}` : ''
  }`
  const res = await fetch(url, bypassHttpCache ? { cache: 'no-store' } : undefined)
  if (!res.ok) throw new Error(`Sheets API error: ${res.status}`)

  const data = await res.json()
  const rows: string[][] = data.values || []

  const products: Product[] = rows
    .map(parseRow)
    .filter((p): p is Product => p !== null)

  return products.length > 0 ? products : fallbackProducts
}

export async function fetchProductsFromSheets(): Promise<Product[]> {
  if (cachedProducts) return cachedProducts
  try {
    const products = await loadFromSheets(false)
    cachedProducts = products
    return products
  } catch (err) {
    console.warn('Failed to fetch from Google Sheets, using fallback:', err)
    return fallbackProducts
  }
}

export async function refreshProductsFromSheets(): Promise<Product[]> {
  const products = await loadFromSheets(true)
  cachedProducts = products
  subscribers.forEach((cb) => cb(products))
  return products
}
