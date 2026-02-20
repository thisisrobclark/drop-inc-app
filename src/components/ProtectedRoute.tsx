import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useDemo } from '../context/DemoContext'

export default function ProtectedRoute() {
  const { session, loading } = useAuth()
  const { isDemoMode } = useDemo()

  // Demo mode bypasses auth
  if (isDemoMode) return <Outlet />

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace />

  return <Outlet />
}
