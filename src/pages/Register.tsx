import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [fullName, setFullName] = useState('')
  const [farmName, setFarmName] = useState('')
  const [phone, setPhone] = useState('')
  const [physicalAddress, setPhysicalAddress] = useState('')
  const [mailingAddress, setMailingAddress] = useState('')
  const [deliveryDirections, setDeliveryDirections] = useState('')
  const [sameAddress, setSameAddress] = useState(true)
  const [showOptional, setShowOptional] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    const { error } = await signUp(email, password, {
      full_name: fullName,
      farm_name: farmName,
      phone,
      physical_address: physicalAddress,
      mailing_address: sameAddress ? physicalAddress : mailingAddress,
      delivery_directions: deliveryDirections,
    })
    setLoading(false)

    if (error) {
      setError(error)
      return
    }

    navigate('/verify-2fa', { state: { phone, fromRegister: true } })
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-lime-500/10 rounded-2xl flex items-center justify-center mb-3">
            <Leaf className="w-7 h-7 text-lime-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-100">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1">Register your farm for ordering</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Full Name *</label>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-field text-sm py-2.5"
                placeholder="John Smith"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Farm Name *</label>
              <input
                required
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="input-field text-sm py-2.5"
                placeholder="Smith Farms"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field text-sm py-2.5"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Cell Phone *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field text-sm py-2.5"
              placeholder="+1 (306) 555-0123"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Password *</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field text-sm py-2.5 pr-9"
                  placeholder="Min 6 chars"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Confirm *</label>
              <input
                type={showPw ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field text-sm py-2.5"
                placeholder="Confirm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Physical Address *</label>
            <textarea
              required
              value={physicalAddress}
              onChange={(e) => setPhysicalAddress(e.target.value)}
              className="input-field text-sm py-2.5 resize-none"
              rows={2}
              placeholder="Box 123, Rural Route 1, Town, SK S0A 0A0"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sameAddress}
              onChange={(e) => setSameAddress(e.target.checked)}
              className="w-4 h-4 rounded border-dark-border bg-dark-surface text-lime-500 focus:ring-lime-500/20"
            />
            <span className="text-xs text-gray-400">Mailing address same as physical</span>
          </label>

          {!sameAddress && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Mailing Address</label>
              <textarea
                value={mailingAddress}
                onChange={(e) => setMailingAddress(e.target.value)}
                className="input-field text-sm py-2.5 resize-none"
                rows={2}
                placeholder="PO Box 456, Town, SK S0A 0A0"
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowOptional(!showOptional)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            {showOptional ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            Delivery directions (optional)
          </button>

          {showOptional && (
            <div>
              <textarea
                value={deliveryDirections}
                onChange={(e) => setDeliveryDirections(e.target.value)}
                className="input-field text-sm py-2.5 resize-none"
                rows={3}
                placeholder="Turn left at the grain elevator, 2 miles north on gravel road, yard is on the east side..."
              />
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-lime w-full mt-2">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-lime-500 hover:text-lime-400 font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
