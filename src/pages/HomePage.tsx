// src/pages/HomePage.tsx
// Domovská stránka aplikace AutoGaráž
//
// Zobrazuje grid 3 karet prémiových značek:
// Mercedes-Benz | BMW | Audi
//
// Každá karta obsahuje:
// - Logo značky (SVG inline)
// - Název značky
// - Tagline / slogan
// - Rok založení a zemi původu
// - Tlačítko "Prozkoumat"
//
// Kliknutí na kartu naviguje na seznam modelů dané značky

import { useNavigate } from 'react-router-dom'
import { ChevronRight, MapPin, Calendar } from 'lucide-react'
import { useApp } from '../context/AppContext'

// ─────────────────────────────────────────────────────────────────────────────
// KONFIGURACE ZNAČEK
// Statická data o každé značce (logo, barva, slogan)
// ─────────────────────────────────────────────────────────────────────────────
const BRANDS = [
  {
    id: 'mercedes-benz',
    display: 'Mercedes-Benz',
    tagline: 'Das Beste oder nichts',
    subtitle: 'Luxus. Elegance. Inovace.',
    founded: 1926,
    country: 'Německo',
    accentColor: '#c0c0c0',  // Stříbrná
    gradient: 'from-zinc-900 via-zinc-800 to-zinc-900',
    borderColor: 'border-zinc-600/30',
    // SVG logo Mercedes hvězda
    logo: (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="3" fill="none"/>
        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3"/>
        {/* Třípaprskový stylizovaný kruh */}
        <line x1="50" y1="4" x2="50" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <line x1="50" y1="50" x2="10.7" y2="72" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <line x1="50" y1="50" x2="89.3" y2="72" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="50" cy="50" r="4" fill="currentColor"/>
      </svg>
    ),
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
  },
  {
    id: 'bmw',
    display: 'BMW',
    tagline: 'Freude am Fahren',
    subtitle: 'Výkon. Dynamika. Preciznost.',
    founded: 1916,
    country: 'Německo',
    accentColor: '#1c69d4',  // BMW modrá
    gradient: 'from-blue-950 via-zinc-900 to-zinc-900',
    borderColor: 'border-blue-800/30',
    logo: (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="3" fill="none"/>
        {/* BMW logo čtyřkvadranty */}
        <path d="M50 4 A46 46 0 0 1 96 50 L50 50 Z" fill="#1c69d4" opacity="0.8"/>
        <path d="M50 50 L96 50 A46 46 0 0 1 50 96 Z" fill="white" opacity="0.15"/>
        <path d="M50 96 A46 46 0 0 1 4 50 L50 50 Z" fill="#1c69d4" opacity="0.8"/>
        <path d="M50 50 L4 50 A46 46 0 0 1 50 4 Z" fill="white" opacity="0.15"/>
        <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="2" fill="none"/>
        <text x="50" y="54" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="bold" fontFamily="sans-serif">BMW</text>
      </svg>
    ),
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
  },
  {
    id: 'audi',
    display: 'Audi',
    tagline: 'Vorsprung durch Technik',
    subtitle: 'Technologie. Tradice. Budoucnost.',
    founded: 1909,
    country: 'Německo',
    accentColor: '#bb0a1e',  // Audi červená
    gradient: 'from-red-950 via-zinc-900 to-zinc-900',
    borderColor: 'border-red-800/30',
    logo: (
      <svg viewBox="0 0 180 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Čtyři kruhy Audi */}
        {[15, 55, 95, 135].map((cx, i) => (
          <g key={i}>
            <circle cx={cx} cy="30" r="26" stroke="currentColor" strokeWidth="3" fill="none"/>
          </g>
        ))}
      </svg>
    ),
    image: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800&q=80',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// HOME PAGE KOMPONENTA
// ─────────────────────────────────────────────────────────────────────────────

export function HomePage() {
  const navigate = useNavigate()
  const { favorites, garageCars } = useApp()

  return (
    <div className="min-h-screen content-with-nav">
      {/* ── HERO SEKCE ──────────────────────────────────────────── */}
      <div className="px-4 pt-12 pb-6">
        {/* Malý label */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-px bg-accent-gold" />
          <span className="text-xs font-mono text-accent-gold tracking-widest uppercase">
            Prémiové automobily
          </span>
        </div>

        {/* Hlavní nadpis – Bebas Neue font */}
        <h1 className="font-display text-5xl tracking-widest leading-none uppercase">
          Auto<br />
          <span className="text-gradient-gold">Garáž</span>
        </h1>

        <p className="text-white/40 text-sm mt-3 max-w-xs leading-relaxed">
          Prohlížejte specifikace prémiových automobilů, ukládejte oblíbené a budujte svoji digitální garáž.
        </p>
      </div>

      {/* ── STATISTIKY ──────────────────────────────────────────── */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="card p-3 flex items-center gap-3">
            <div className="text-2xl">⭐</div>
            <div>
              <div className="font-display text-2xl text-accent-gold leading-none">
                {favorites.length}
              </div>
              <div className="text-xs text-white/40">Oblíbených</div>
            </div>
          </div>
          <div className="card p-3 flex items-center gap-3">
            <div className="text-2xl">🚗</div>
            <div>
              <div className="font-display text-2xl text-accent-gold leading-none">
                {garageCars.length}
              </div>
              <div className="text-xs text-white/40">V garáži</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ZLATÁ LINKA ─────────────────────────────────────────── */}
      <div className="gold-line mx-4 mb-6" />

      {/* ── SEKCE HEADER ────────────────────────────────────────── */}
      <div className="px-4 mb-4">
        <p className="text-xs font-mono text-white/30 uppercase tracking-widest">
          Vyberte značku
        </p>
      </div>

      {/* ── BRAND KARTY ─────────────────────────────────────────── */}
      <div className="px-4 space-y-4">
        {BRANDS.map((brand, index) => (
          <BrandCard
            key={brand.id}
            brand={brand}
            index={index}
            onClick={() => navigate(`/makes/${brand.id}/models`)}
          />
        ))}
      </div>

      {/* ── FOOTER INFO ─────────────────────────────────────────── */}
      <div className="px-4 py-8 text-center">
        <p className="text-xs text-white/20 font-mono">
          Data poskytuje CarQuery API · Firebase Firestore
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BRAND CARD KOMPONENTA
// ─────────────────────────────────────────────────────────────────────────────

interface BrandCardProps {
  brand: typeof BRANDS[0]
  index: number
  onClick: () => void
}

function BrandCard({ brand, index, onClick }: BrandCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left relative overflow-hidden rounded-3xl
        border ${brand.borderColor}
        bg-gradient-to-br ${brand.gradient}
        transition-all duration-300 active:scale-[0.98]
        hover:border-opacity-60 shadow-card hover:shadow-card-hover
        group
      `}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Background obrázek auta (jemný, přes opacity) */}
      <div
        className="absolute inset-0 bg-center bg-cover opacity-10 group-hover:opacity-20 transition-opacity duration-500"
        style={{ backgroundImage: `url(${brand.image})` }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

      {/* Obsah karty */}
      <div className="relative flex items-center gap-4 p-5">
        {/* Logo */}
        <div
          className="shrink-0 w-14 h-14 flex items-center justify-center rounded-2xl bg-black/40 border border-white/10 p-3"
          style={{ color: brand.accentColor }}
        >
          {brand.logo}
        </div>

        {/* Text info */}
        <div className="flex-1 min-w-0">
          {/* Název značky */}
          <h2 className="font-display text-2xl tracking-widest leading-none text-white">
            {brand.display}
          </h2>

          {/* Tagline */}
          <p className="text-xs font-mono italic mt-1" style={{ color: brand.accentColor }}>
            "{brand.tagline}"
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-white/30">
              <Calendar size={10} />
              od {brand.founded}
            </span>
            <span className="flex items-center gap-1 text-xs text-white/30">
              <MapPin size={10} />
              {brand.country}
            </span>
          </div>
        </div>

        {/* Šipka vpravo */}
        <div className="shrink-0">
          <ChevronRight
            size={20}
            className="text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all duration-200"
          />
        </div>
      </div>

      {/* Barevná linka dole */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px opacity-40"
        style={{ background: `linear-gradient(to right, transparent, ${brand.accentColor}, transparent)` }}
      />
    </button>
  )
}
