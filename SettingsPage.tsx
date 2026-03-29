// src/pages/SettingsPage.tsx
// Stránka nastavení aplikace
//
// Dostupná z menu nebo jako modální drawer
// Funkce:
// - Přepínač Dark/Light mode (uloženo do localStorage)
// - Informace o aplikaci
// - Odkaz na Firebase Console
// - Verze aplikace
//
// Nastavení tema je globální a okamžitě se projeví přidáním/
// odebráním třídy 'dark' z <html> elementu (viz AppContext)

import { useNavigate } from 'react-router-dom'
import {
  Moon,
  Sun,
  ChevronRight,
  Info,
  Database,
  X,
  Smartphone,
  Star,
  Car,
  Trash2,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

export function SettingsPage() {
  const navigate = useNavigate()
  const {
    theme,
    toggleTheme,
    favorites,
    garageCars,
  } = useApp()

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
        <button
          onClick={() => navigate(-1)}
          className="btn-icon"
        >
          <X size={20} className="text-white/50" />
        </button>
      </div>

      <div className="px-4 space-y-6">

        {/* ── VZHLED ───────────────────────────────────────────── */}
        <SettingsSection title="Vzhled">
          <SettingsRow
            icon={theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            label="Tmavý režim"
            description={theme === 'dark' ? 'Tmavé pozadí aktivní' : 'Světlé pozadí aktivní'}
          >
            {/* Toggle switch */}
            <button
              onClick={toggleTheme}
              className={`
                relative w-12 h-6 rounded-full transition-all duration-300
                ${theme === 'dark' ? 'bg-accent-gold' : 'bg-garage-muted'}
              `}
              role="switch"
              aria-checked={theme === 'dark'}
            >
              <span className={`
                absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm
                transition-all duration-300
                ${theme === 'dark' ? 'left-7' : 'left-1'}
              `} />
            </button>
          </SettingsRow>
        </SettingsSection>

        {/* ── STATISTIKY ───────────────────────────────────────── */}
        <SettingsSection title="Vaše data">
          <div className="grid grid-cols-2 gap-3 py-1">
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

        {/* ── PWA ──────────────────────────────────────────────── */}
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
            <div className="space-y-1.5 text-xs text-white/40">
              <p>React 18 · TypeScript · Vite</p>
              <p>Firebase v10 Firestore</p>
              <p>CarQuery API · Tailwind CSS</p>
              <p>PWA (offline schopné)</p>
            </div>
          </div>
        </SettingsSection>

        {/* ── DATABÁZE SETUP ───────────────────────────────────── */}
        <SettingsSection title="Firebase Setup">
          <div className="card p-4">
            <div className="flex items-start gap-2 mb-3">
              <Info size={14} className="text-accent-gold shrink-0 mt-0.5" />
              <p className="text-xs text-white/60 leading-relaxed">
                Pro ukládání dat je potřeba nastavit Firebase. Upravte soubor{' '}
                <code className="text-accent-gold font-mono">src/lib/firebase.ts</code>{' '}
                s vaším Firebase config objektem.
              </p>
            </div>
            <div className="bg-black/40 rounded-xl p-3 font-mono text-xs text-green-400/80">
              <p className="text-white/30 mb-1">{'// firebase.ts'}</p>
              <p>{'const firebaseConfig = {'}</p>
              <p className="pl-4">apiKey: <span className="text-yellow-400">"your-api-key"</span>,</p>
              <p className="pl-4">projectId: <span className="text-yellow-400">"your-project"</span>,</p>
              <p className="pl-4">{'...'}</p>
              <p>{'}'}</p>
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

function SettingsSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">{title}</p>
      <div className="card overflow-hidden divide-y divide-garage-border/50">
        {children}
      </div>
    </div>
  )
}

function SettingsRow({
  icon,
  label,
  description,
  children,
}: {
  icon: React.ReactNode
  label: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="text-white/50 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{label}</p>
        {description && (
          <p className="text-xs text-white/30 mt-0.5">{description}</p>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  )
}
