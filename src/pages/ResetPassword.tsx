import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

/**
 * Landing page for the Supabase password-recovery email link. The link looks like
 *   https://drop-inc-app.vercel.app/reset-password#access_token=...&type=recovery
 * Supabase's JS client picks up the tokens from the URL hash and creates a temporary
 * recovery session automatically. We just need to show a "set new password" form and
 * call updateUser, then send the user on their way.
 */
export default function ResetPassword() {
  const navigate = useNavigate()
  const { updatePassword } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [done, setDone] = useState(false)

  // Wait for Supabase to either hand us a recovery session (from the email link hash)
  // or confirm there's no usable session. If there's no session by the time we render,
  // we tell the user the link is invalid/expired rather than silently failing.
  useEffect(() => {
    let cancelled = false
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return
      if (session) setReady(true)
      else setError('Reset link is invalid or has expired. Request a new one.')
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') setReady(true)
    })
    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError("Passwords don't match.")
      return
    }
    setLoading(true)
    const { error } = await updatePassword(password)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    setDone(true)
    setTimeout(() => navigate('/catalog', { replace: true }), 1500)
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <img src="/cropshield-logo.png" alt="CropShield" className="w-48 object-contain mb-4" />
          <p className="text-sm text-gray-500">Set a new password</p>
        </div>

        {done ? (
          <div className="bg-brand-400/10 border border-brand-400/20 text-brand-300 text-sm px-4 py-4 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Password updated</p>
              <p className="text-xs text-brand-300/80 mt-1">Signing you in...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">New password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  disabled={!ready}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Confirm new password
              </label>
              <input
                type={showPw ? 'text' : 'password'}
                required
                disabled={!ready}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="input-field"
                placeholder="Re-enter the same password"
              />
            </div>

            <button type="submit" disabled={loading || !ready} className="btn-brand w-full">
              {loading ? 'Updating...' : 'Update password'}
            </button>

            <p className="text-center text-sm text-gray-500 mt-2">
              <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">
                Back to sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
