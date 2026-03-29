// src/components/ui/index.tsx
// Sdílené UI komponenty používané napříč celou aplikací
//
// Obsahuje:
// - LoadingSpinner – animovaný spinner pro loading stavy
// - SkeletonCard – placeholder karta pro načítání obsahu
// - ErrorState – chybový stav s možností opakovat
// - PageHeader – záhlaví stránky s tlačítkem zpět
// - EmptyState – prázdný stav (žádná data)

import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// ─────────────────────────────────────────────────────────────────────────────
// LOADING SPINNER
// ─────────────────────────────────────────────────────────────────────────────

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  }

  return (
    <div
      className={`
        ${sizes[size]} rounded-full
        border-garage-border border-t-accent-gold
        animate-spin ${className}
      `}
      role="status"
      aria-label="Načítání..."
    />
  )
}

/** Celostránkový loading stav */
export function PageLoading({ message = 'Načítání...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-white/40 text-sm font-body">{message}</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON KARTA
// ─────────────────────────────────────────────────────────────────────────────

/** Skeleton placeholder pro načítání karet aut */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`card overflow-hidden ${className}`}>
      {/* Obrázek placeholder */}
      <div className="skeleton h-40 rounded-none" />
      <div className="p-4 space-y-3">
        {/* Nadpis placeholder */}
        <div className="skeleton h-5 w-3/4 rounded-lg" />
        {/* Podnadpis placeholder */}
        <div className="skeleton h-4 w-1/2 rounded-lg" />
        {/* Badge placeholders */}
        <div className="flex gap-2">
          <div className="skeleton h-6 w-16 rounded-lg" />
          <div className="skeleton h-6 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ERROR STATE
// ─────────────────────────────────────────────────────────────────────────────

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  message = 'Něco se pokazilo',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 px-6 text-center">
      {/* Chybová ikona */}
      <div className="w-16 h-16 rounded-full bg-red-900/20 border border-red-800/30 flex items-center justify-center">
        <AlertCircle className="text-red-400" size={32} />
      </div>

      <div>
        <h3 className="text-white font-semibold mb-1">Chyba</h3>
        <p className="text-white/50 text-sm">{message}</p>
      </div>

      {/* Tlačítko pro opakování */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Zkusit znovu
        </button>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE HEADER
// ─────────────────────────────────────────────────────────────────────────────

interface PageHeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  rightElement?: React.ReactNode
}

export function PageHeader({
  title,
  subtitle,
  showBack = true,
  rightElement,
}: PageHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="flex items-center gap-3 px-4 pt-4 pb-2">
      {/* Tlačítko zpět */}
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="btn-icon shrink-0"
          aria-label="Zpět"
        >
          <ArrowLeft size={20} className="text-white/70" />
        </button>
      )}

      {/* Titulek */}
      <div className="flex-1 min-w-0">
        <h1 className="section-title text-2xl truncate">{title}</h1>
        {subtitle && (
          <p className="text-white/40 text-xs mt-0.5 truncate">{subtitle}</p>
        )}
      </div>

      {/* Pravý element (volitelný) */}
      {rightElement && (
        <div className="shrink-0">{rightElement}</div>
      )}
    </header>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: string         // Emoji ikona
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon = '🚗', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-6 text-center animate-fade-in">
      {/* Velká emoji ikona */}
      <div className="text-6xl mb-2 opacity-30">{icon}</div>

      <div>
        <h3 className="text-white/70 font-semibold text-lg">{title}</h3>
        {description && (
          <p className="text-white/30 text-sm mt-1 max-w-xs">{description}</p>
        )}
      </div>

      {action && (
        <button onClick={action.onClick} className="btn-primary mt-2">
          {action.label}
        </button>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SPEC ROW
// Řádek v tabulce specifikací
// ─────────────────────────────────────────────────────────────────────────────

interface SpecRowProps {
  label: string
  value: string | number | null | undefined
  unit?: string
  highlight?: boolean
}

export function SpecRow({ label, value, unit, highlight }: SpecRowProps) {
  const displayValue = value ?? '—'

  return (
    <div className={`spec-row ${highlight ? 'bg-accent-gold/5 -mx-4 px-4 rounded-lg' : ''}`}>
      <span className="spec-label">{label}</span>
      <span className={`spec-value ${highlight ? 'text-accent-gold' : ''}`}>
        {displayValue !== '—' ? `${displayValue}${unit ? ` ${unit}` : ''}` : '—'}
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION TITLE
// ─────────────────────────────────────────────────────────────────────────────

export function SectionTitle({ children, className = '' }: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2 className={`text-xs font-semibold uppercase tracking-widest text-white/30 mb-3 ${className}`}>
      {children}
    </h2>
  )
}
