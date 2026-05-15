import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await resetPassword(email.trim())
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <img src="/cropshield-logo.png" alt="CropShield" className="w-48 object-contain mb-4" />
          <p className="text-sm text-gray-500">Reset your password</p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="bg-brand-400/10 border border-brand-400/20 text-brand-300 text-sm px-4 py-4 rounded-xl flex items-start gap-3">
              <Mail className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Check your email</p>
                <p className="text-xs text-brand-300/80 mt-1">
                  If an account exists for <span className="font-medium">{email}</span>, we sent a link
                  to reset your password. The link expires in 1 hour.
                </p>
              </div>
            </div>
            <Link
              to="/login"
              className="btn-outline w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@example.com"
                />
                <p className="text-xs text-gray-500 mt-2">
                  We'll email you a link to set a new password.
                </p>
              </div>

              <button type="submit" disabled={loading} className="btn-brand w-full">
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Remembered it?{' '}
              <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
