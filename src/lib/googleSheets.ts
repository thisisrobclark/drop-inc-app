import { Product, ProductCategory } from './types'
import { fallbackProducts } from '../data/products'

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_ID
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY
const RANGE = 'Sheet1!A2:E200'

interface SheetRow {
  id: string
  name: string
  category: string
  unit: string
  description: string
}

function parseRow(row: string[]): SheetRow | null {
  if (row.length < 4) return null
  return {
    id: row[0]?.trim(),
    name: row[1]?.trim(),
    category: row[2]?.trim(),
    unit: row[3]?.trim(),
    description: row[4]?.trim() || '',
  }
}

export async function fetchProductsFromSheets(): Promise<Product[]> {
  if (!SHEET_ID || !API_KEY) {
    console.log('Google Sheets not configured, using fallback product data')
    return fallbackProducts
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
    const res = await fetch(url)
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
  } catch (err) {
    console.warn('Failed to fetch from Google Sheets, using fallback:', err)
    return fallbackProducts
  }
}
