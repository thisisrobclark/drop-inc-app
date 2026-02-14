import { AlertTriangle, X } from 'lucide-react'
import { useDemo } from '../context/DemoContext'
import { useNavigate } from 'react-router-dom'

export default function DemoBanner() {
  const { isDemoMode, demoRole, exitDemo } = useDemo()
  const navigate = useNavigate()

  if (!isDemoMode) return null

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 flex items-center justify-between sticky top-0 z-[200]">
      <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>Demo Mode — Viewing as {demoRole === 'admin' ? 'Admin' : 'Partner'} with sample data</span>
      </div>
      <button
        onClick={() => {
          exitDemo()
          navigate('/login')
        }}
        className="flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg transition-colors"
      >
        <X className="w-3 h-3" />
        Exit Demo
      </button>
    </div>
  )
}
