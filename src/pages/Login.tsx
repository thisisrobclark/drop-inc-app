import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, Eye, EyeOff, Play } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useDemo } from '../context/DemoContext'

export default function Login() {
  const { signIn } = useAuth()
  const { enterDemo } = useDemo()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)
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
            <Leaf className="w-8 h-8 text-lime-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-100">Drop Inc</h1>
          <p className="text-sm text-gray-500 mt-1">Agricultural Input Ordering</p>
        </div>

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-10"
                placeholder="Enter your password"
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

          <button type="submit" disabled={loading} className="btn-lime w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-lime-500 hover:text-lime-400 font-medium">
            Register
          </Link>
        </p>

        {/* Demo buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              enterDemo('partner')
              navigate('/catalog')
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-lime-500 rounded-xl text-sm font-bold text-lime-500 hover:bg-lime-500/10 transition-colors"
          >
            <Play className="w-4 h-4" />
            Try Partner Demo
          </button>
          <button
            onClick={() => {
              enterDemo('admin')
              navigate('/admin')
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-lime-500 rounded-xl text-sm font-bold text-lime-500 hover:bg-lime-500/10 transition-colors"
          >
            <Play className="w-4 h-4" />
            Try Admin Demo
          </button>
        </div>
      </div>
    </div>
  )
}
