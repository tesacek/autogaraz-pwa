// src/pages/SettingsPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Moon, Sun, ChevronRight, Info, Database,
  X, Smartphone, Star, Car, LogIn, LogOut,
  Mail, Lock, User as UserIcon, Eye, EyeOff,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE SVG ICON
// ─────────────────────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
      <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH SEKCE – přihlášení / registrace / profil
// ─────────────────────────────────────────────────────────────────────────────

type AuthMode = 'login' | 'register'

function AuthSection() {
  const { user, loginWithGoogle, loginWithEmail, register, logout, authLoading } = useApp()
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Přihlášený uživatel – zobrazíme profil
  if (authLoading) {
    return (
        <div className="card p-4 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-accent-gold/30 border-t-accent-gold rounded-full animate-spin" />
        </div>
    )
  }

  if (user) {
    return (
        <div className="card overflow-hidden">
          {/* Profil uživatele */}
          <div className="p-4 flex items-center gap-3">
            {user.photoURL ? (
                <img src={user.photoURL} alt="avatar" className="w-10 h-10 rounded-full border border-accent-gold/30" />
            ) : (
                <div className="w-10 h-10 rounded-full bg-accent-gold/20 border border-accent-gold/30 flex items-center justify-center">
                  <UserIcon size={18} className="text-accent-gold" />
                </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user.displayName ?? 'Uživatel'}
              </p>
              <p className="text-xs text-white/40 truncate">{user.email}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>

          <div className="border-t border-garage-border/50" />

          {/* Odhlášení */}
          <button
              onClick={logout}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors"
          >
            <LogOut size={18} className="text-red-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-400">Odhlásit se</p>
            </div>
          </button>
        </div>
    )
  }

  // Nepřihlášený – zobrazíme login/registrace formulář
  async function handleSubmit() {
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await loginWithEmail(email, password)
      } else {
        await register(email, password, name)
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Chyba')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Chyba')
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="card overflow-hidden">
        {/* Tabs: Přihlásit / Registrovat */}
        <div className="flex border-b border-garage-border/50">
          {(['login', 'register'] as AuthMode[]).map(m => (
              <button
                  key={m}
                  onClick={() => { setMode(m); setError('') }}
                  className={`
              flex-1 py-3 text-sm font-medium transition-colors
              ${mode === m
                      ? 'text-accent-gold border-b-2 border-accent-gold'
                      : 'text-white/40 hover:text-white/70'}
            `}
              >
                {m === 'login' ? 'Přihlásit se' : 'Registrovat'}
              </button>
          ))}
        </div>

        <div className="p-4 space-y-3">
          {/* Google tlačítko */}
          <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-garage-border/70 bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium text-white disabled:opacity-50"
          >
            <GoogleIcon />
            Pokračovat přes Google
          </button>

          {/* Oddělovač */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-garage-border/50" />
            <span className="text-xs text-white/30">nebo</span>
            <div className="flex-1 h-px bg-garage-border/50" />
          </div>

          {/* Jméno (pouze registrace) */}
          {mode === 'register' && (
              <div className="relative">
                <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                    type="text"
                    placeholder="Jméno"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-black/40 border border-garage-border/60 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent-gold/50"
                />
              </div>
          )}

          {/* Email */}
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-garage-border/60 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent-gold/50"
            />
          </div>

          {/* Heslo */}
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Heslo"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full bg-black/40 border border-garage-border/60 rounded-xl py-2.5 pl-9 pr-10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent-gold/50"
            />
            <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Error zpráva */}
          {error && (
              <p className="text-xs text-red-400 bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2">
                {error}
              </p>
          )}

          {/* Submit tlačítko */}
          <button
              onClick={handleSubmit}
              disabled={loading || !email || !password}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-accent-gold text-black font-semibold text-sm hover:bg-accent-gold/90 transition-colors disabled:opacity-50"
          >
            {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
                <LogIn size={16} />
            )}
            {mode === 'login' ? 'Přihlásit se' : 'Vytvořit účet'}
          </button>
        </div>
      </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HLAVNÍ STRÁNKA NASTAVENÍ
// ─────────────────────────────────────────────────────────────────────────────

export function SettingsPage() {
  const navigate = useNavigate()
  const { theme, toggleTheme, favorites, garageCars } = useApp()

  return (
      <div className="min-h-screen content-with-nav animate-fade-in">
        {/* Záhlaví */}
        <div className="flex items-center justify-between px-4 pt-10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-px bg-accent-gold" />
              <span className="text-xs font-mono text-accent-gold tracking-widest uppercase">Menu</span>
            </div>
            <h1 className="font-display text-3xl tracking-widest">NASTAVENÍ</h1>
          </div>
          <button onClick={() => navigate(-1)} className="btn-icon">
            <X size={20} className="text-white/50" />
          </button>
        </div>

        <div className="px-4 space-y-6">

          {/* ── ÚČET ─────────────────────────────────────────────── */}
          <div>
            <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Účet</p>
            <AuthSection />
          </div>

          {/* ── VZHLED ───────────────────────────────────────────── */}
          <SettingsSection title="Vzhled">
            <SettingsRow
                icon={theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                label="Tmavý režim"
                description={theme === 'dark' ? 'Tmavé pozadí aktivní' : 'Světlé pozadí aktivní'}
            >
              <button
                  onClick={toggleTheme}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-accent-gold' : 'bg-garage-muted'}`}
                  role="switch"
                  aria-checked={theme === 'dark'}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${theme === 'dark' ? 'left-7' : 'left-1'}`} />
              </button>
            </SettingsRow>
          </SettingsSection>

          {/* ── STATISTIKY ───────────────────────────────────────── */}
          <SettingsSection title="Vaše data">
            <div className="grid grid-cols-2 gap-3 py-1 px-1">
              <div className="card p-3 flex items-center gap-3">
                <Star size={16} className="text-accent-gold" />
                <div>
                  <div className="font-display text-2xl text-white leading-none">{favorites.length}</div>
                  <div className="text-xs text-white/40">Oblíbených</div>
                </div>
              </div>
              <div className="card p-3 flex items-center gap-3">
                <Car size={16} className="text-accent-gold" />
                <div>
                  <div className="font-display text-2xl text-white leading-none">{garageCars.length}</div>
                  <div className="text-xs text-white/40">V garáži</div>
                </div>
              </div>
            </div>
          </SettingsSection>

          {/* ── APLIKACE ─────────────────────────────────────────── */}
          <SettingsSection title="Aplikace">
            <SettingsRow
                icon={<Smartphone size={18} />}
                label="Nainstalovat aplikaci"
                description="Přidat na plochu jako PWA"
            >
              <ChevronRight size={16} className="text-white/20" />
            </SettingsRow>
            <SettingsRow
                icon={<Database size={18} />}
                label="Firebase Firestore"
                description="Data jsou ukládána v cloudu"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </SettingsRow>
          </SettingsSection>

          {/* ── O APLIKACI ───────────────────────────────────────── */}
          <SettingsSection title="O aplikaci">
            <div className="card p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-accent-gold/20 border border-accent-gold/30 flex items-center justify-center">
                  <Car size={18} className="text-accent-gold" />
                </div>
                <div>
                  <p className="font-semibold text-white">AutoGaráž</p>
                  <p className="text-xs text-white/40 font-mono">verze 1.0.0</p>
                </div>
              </div>
              <div className="gold-line" />
              <div className="space-y-1 text-xs text-white/40">
                <p>React 18 · TypeScript · Vite</p>
                <p>Firebase v10 Auth + Firestore</p>
                <p>CarQuery API · Tailwind CSS · PWA</p>
              </div>
            </div>
          </SettingsSection>

          {/* ── FIREBASE INFO ─────────────────────────────────────── */}
          <SettingsSection title="Firebase Setup">
            <div className="card p-4">
              <div className="flex items-start gap-2">
                <Info size={14} className="text-accent-gold shrink-0 mt-0.5" />
                <p className="text-xs text-white/60 leading-relaxed">
                  Data jsou uložena odděleně pro každého uživatele. Pro přihlášení přes Google
                  je potřeba povolit Google provider v{' '}
                  <span className="text-accent-gold font-mono">Firebase Console → Authentication → Sign-in method</span>.
                </p>
              </div>
            </div>
          </SettingsSection>

        </div>

        <div className="h-8" />
      </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-KOMPONENTY
// ─────────────────────────────────────────────────────────────────────────────

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
      <div>
        <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">{title}</p>
        <div className="card overflow-hidden divide-y divide-garage-border/50">{children}</div>
      </div>
  )
}

function SettingsRow({
                       icon, label, description, children,
                     }: {
  icon: React.ReactNode; label: string; description?: string; children?: React.ReactNode
}) {
  return (
      <div className="flex items-center gap-3 p-4">
        <div className="text-white/50 shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">{label}</p>
          {description && <p className="text-xs text-white/30 mt-0.5">{description}</p>}
        </div>
        {children && <div className="shrink-0">{children}</div>}
      </div>
  )
}