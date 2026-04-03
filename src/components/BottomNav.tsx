// src/components/BottomNav.tsx
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Star, Car, Settings } from 'lucide-react'
import { useApp } from '../context/AppContext'

const NAV_ITEMS = [
  { id: 'home',      label: 'Domů',     icon: Home,     path: '/' },
  { id: 'favorites', label: 'Oblíbené', icon: Star,     path: '/favorites' },
  { id: 'garage',    label: 'Garáž',    icon: Car,      path: '/garage' },
  { id: 'settings',  label: 'Nastavení',icon: Settings, path: '/settings' },
] as const

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { favorites, garageCars } = useApp()

  const counts: Record<string, number> = {
    favorites: favorites.length,
    garage: garageCars.length,
  }

  return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-garage-border shadow-nav">
        <div className="flex items-center justify-around px-2 py-2 pb-safe" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.5rem)' }}>
          {NAV_ITEMS.map(({ id, label, icon: Icon, path }) => {
            const isActive = id === 'home'
                ? location.pathname === '/'
                : location.pathname.startsWith(path)

            const count = counts[id] ?? 0

            return (
                <button
                    key={id}
                    onClick={() => navigate(path)}
                    className={`
                relative flex flex-col items-center gap-1 px-4 py-2 rounded-2xl
                transition-all duration-200 active:scale-90
                ${isActive ? 'text-accent-gold' : 'text-white/40 hover:text-white/70'}
              `}
                    aria-label={label}
                    aria-current={isActive ? 'page' : undefined}
                >
                  {isActive && (
                      <span className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-gold animate-pulse" />
                  )}

                  <div className="relative">
                    <Icon
                        size={22}
                        strokeWidth={isActive ? 2.5 : 1.5}
                        className={`transition-all duration-200 ${isActive ? 'drop-shadow-[0_0_6px_rgba(201,168,76,0.6)]' : ''}`}
                    />
                    {count > 0 && (
                        <span className={`
                    absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1
                    flex items-center justify-center
                    text-[9px] font-bold rounded-full
                    ${isActive ? 'bg-accent-gold text-black' : 'bg-garage-muted text-white/70'}
                  `}>
                    {count > 99 ? '99+' : count}
                  </span>
                    )}
                  </div>

                  <span className={`text-[10px] font-medium transition-all ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                {label}
              </span>
                </button>
            )
          })}
        </div>
      </nav>
  )
}
