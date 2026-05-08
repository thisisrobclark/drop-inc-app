import { Product, ProductCategory } from './types'
import { fallbackProducts } from '../data/products'

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_ID
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY
const RANGE = 'products!A2:G200'

interface SheetRow {
  id: string
  name: string
  category: string
  unit: string
  description: string
}

function parseRow(row: string[]): SheetRow | null {
  const id = row[0]?.trim() ?? ''
  const category = row[1]?.trim() ?? ''
  const name = row[2]?.trim() ?? ''
  if (!id || !name) return null
  const branded = row[3]?.trim() ?? ''
  const ingredients = row[4]?.trim() ?? ''
  const unit = row[6]?.trim() ?? ''
  const description = [branded ? `Like ${branded}` : '', ingredients]
    .filter(Boolean)
    .join(' • ')
  return { id, name, category, unit, description }
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
    .filter((r): r is SheetRow => r !== null)
    .map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category as ProductCategory,
      unit: r.unit,
      description: r.description,
    }))

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
