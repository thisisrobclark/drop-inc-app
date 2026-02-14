import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Verify2FA() {
  const { sendPhoneOtp, verifyPhoneOtp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const phoneFromState = (location.state as { phone?: string })?.phone || ''
  const fromRegister = (location.state as { fromRegister?: boolean })?.fromRegister || false

  const [phone, setPhone] = useState(phoneFromState)
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'send' | 'verify'>(fromRegister ? 'send' : 'send')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!phone.trim()) {
      setError('Enter your phone number')
      return
    }
    setError('')
    setLoading(true)
    const { error } = await sendPhoneOtp(phone)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    setStep('verify')
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) {
      setError('Enter the verification code')
      return
    }
    setError('')
    setLoading(true)
    const { error } = await verifyPhoneOtp(phone, code)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    navigate('/catalog')
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-lime-500/10 rounded-2xl flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-lime-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-100">Phone Verification</h1>
          <p className="text-sm text-gray-500 mt-1">
            {step === 'send'
              ? 'We\'ll send a code to verify your phone'
              : 'Enter the 6-digit code sent to your phone'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {step === 'send' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
                placeholder="+1 (306) 555-0123"
              />
            </div>
            <button onClick={handleSend} disabled={loading} className="btn-lime w-full">
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
            <button
              onClick={() => navigate('/catalog')}
              className="btn-outline w-full text-sm"
            >
              Skip for now
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Verification Code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="input-field text-center text-2xl tracking-[0.5em] font-mono"
                placeholder="000000"
                autoFocus
              />
            </div>
            <button type="submit" disabled={loading} className="btn-lime w-full">
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={loading}
              className="btn-outline w-full text-sm"
            >
              Resend Code
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
