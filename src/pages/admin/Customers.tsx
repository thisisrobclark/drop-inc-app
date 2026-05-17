import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Users, ArrowLeft, Search, ShieldCheck, Coins } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useDemo } from '../../context/DemoContext'
import { Profile } from '../../lib/types'

type ToggleField = 'is_admin' | 'is_shareholder'

export default function AdminCustomers() {
  const { profile } = useAuth()
  const { isDemoMode, demoPartners } = useDemo()
  const [customers, setCustomers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (profile && !profile.is_admin) return <Navigate to="/catalog" replace />

  useEffect(() => {
    if (isDemoMode) {
      setCustomers(demoPartners)
      setLoading(false)
      return
    }
    fetchCustomers()
  }, [isDemoMode, demoPartners])

  async function fetchCustomers() {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setCustomers((data ?? []) as Profile[])
    setLoading(false)
  }

  /**
   * Optimistic toggle of an is_admin / is_shareholder flag. We flip locally first so
   * the checkbox feels instant, then write to Supabase; if the write fails we revert
   * and surface the error. Demo mode just flips locally — no network call.
   */
  async function toggle(c: Profile, field: ToggleField) {
    const next = !c[field]
    setCustomers((prev) => prev.map((p) => (p.id === c.id ? { ...p, [field]: next } : p)))
    if (isDemoMode) return
    setSavingId(c.id)
    setError(null)
    const { error } = await supabase
      .from('profiles')
      .update({ [field]: next })
      .eq('id', c.id)
    setSavingId(null)
    if (error) {
      setCustomers((prev) => prev.map((p) => (p.id === c.id ? { ...p, [field]: !next } : p)))
      setError(`Failed to update ${field}: ${error.message}`)
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return customers
    return customers.filter(
      (c) =>
        c.email?.toLowerCase().includes(q) ||
        c.full_name?.toLowerCase().includes(q) ||
        c.farm_name?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q)
    )
  }, [customers, search])

  const shareholderCount = customers.filter((c) => c.is_shareholder).length
  const adminCount = customers.filter((c) => c.is_admin).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Link
          to="/admin"
          className="text-gray-500 hover:text-gray-300 transition-colors"
          title="Back to admin dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <Users className="w-5 h-5 text-brand-400" />
        <h1 className="text-xl font-bold text-gray-100">Customers</h1>
        <span className="text-xs text-gray-500 bg-dark-surface px-2 py-0.5 rounded-md">
          {customers.length} total
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="card py-3 px-3">
          <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider">
            <Coins className="w-3 h-3" />
            Shareholders
          </div>
          <p className="text-lg font-bold text-gray-100 mt-1">{shareholderCount}</p>
        </div>
        <div className="card py-3 px-3">
          <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" />
            Admins
          </div>
          <p className="text-lg font-bold text-gray-100 mt-1">{adminCount}</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10 text-sm"
          placeholder="Search by name, farm, email, or phone..."
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="card flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-gray-100 truncate">
                  {c.farm_name || c.full_name || c.email || 'Unknown'}
                </p>
                {c.is_admin && (
                  <span className="text-[9px] uppercase tracking-wider text-gold-500/80 bg-gold-500/10 px-1.5 py-0.5 rounded">
                    Admin
                  </span>
                )}
                {c.is_shareholder && (
                  <span className="text-[9px] uppercase tracking-wider text-brand-400/80 bg-brand-400/10 px-1.5 py-0.5 rounded">
                    Shareholder
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-500 mt-0.5">
                {c.full_name && c.farm_name && <span>{c.full_name}</span>}
                {c.email && <span className="truncate">{c.email}</span>}
                {c.phone && <span>{c.phone}</span>}
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-5 shrink-0">
              <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!!c.is_shareholder}
                  disabled={savingId === c.id}
                  onChange={() => toggle(c, 'is_shareholder')}
                  className="w-4 h-4 accent-brand-400 cursor-pointer disabled:opacity-50"
                />
                Shareholder
              </label>
              <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!!c.is_admin}
                  disabled={savingId === c.id || c.id === profile?.id}
                  onChange={() => toggle(c, 'is_admin')}
                  className="w-4 h-4 accent-gold-500 cursor-pointer disabled:opacity-50"
                  title={c.id === profile?.id ? "You can't remove your own admin status" : ''}
                />
                Admin
              </label>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-gray-500 py-10">
          {customers.length === 0 ? 'No customers yet.' : 'No customers match your search.'}
        </p>
      )}
    </div>
  )
}
