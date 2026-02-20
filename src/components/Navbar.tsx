import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Sprout, ClipboardList, LayoutDashboard, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { profile, signOut } = useAuth()
  const { totalItems } = useCart()
  const location = useLocation()

  const navItems = [
    { to: '/catalog', icon: Sprout, label: 'Catalog' },
    { to: '/cart', icon: ShoppingCart, label: 'Cart', badge: totalItems },
    { to: '/my-orders', icon: ClipboardList, label: 'Orders' },
  ]

  if (profile?.is_admin) {
    navItems.push({ to: '/admin', icon: LayoutDashboard, label: 'Admin', badge: 0 })
  }

  const isActive = (path: string) => location.pathname.startsWith(path)

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex items-center justify-between px-6 py-4 border-b border-dark-border safe-top bg-dark-card/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/catalog" className="flex items-center gap-2">
          <img src="/cropshield-logo.png" alt="CropShield" className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold text-gray-100">CropShield</span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive(item.to)
                  ? 'bg-brand-400/10 text-brand-400'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-dark-hover'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {item.badge ? (
                <span className="bg-gold-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          ))}

          <div className="ml-4 pl-4 border-l border-dark-border flex items-center gap-3">
            <span className="text-sm text-gray-500">{profile?.farm_name || profile?.email}</span>
            <button
              onClick={signOut}
              className="text-gray-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-dark-hover"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-card/95 backdrop-blur-md border-t border-dark-border safe-bottom z-50">
        <div className="flex justify-around items-center py-2 px-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl min-w-[60px] transition-colors ${
                isActive(item.to) ? 'text-brand-400' : 'text-gray-500'
              }`}
            >
              <div className="relative">
                <item.icon className="w-5 h-5" />
                {item.badge ? (
                  <span className="absolute -top-1.5 -right-2.5 bg-gold-500 text-white text-[10px] font-bold px-1 py-0.5 rounded-full min-w-[16px] text-center leading-none">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={signOut}
            className="flex flex-col items-center gap-1 px-3 py-1.5 text-gray-500"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] font-medium">Exit</span>
          </button>
        </div>
      </nav>
    </>
  )
}
