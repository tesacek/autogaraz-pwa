// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  tailwind.config.js                                                          ║
// ║  Tailwind CSS konfigurace – zde jsou definovány VŠECHNY barvy aplikace       ║
// ║                                                                              ║
// ║  Co je Tailwind?                                                             ║
// ║  Je to CSS framework – místo psání vlastního CSS píšeš třídy přímo do JSX.  ║
// ║  Např. className="bg-accent-gold text-black" = zlaté pozadí, černý text.    ║
// ║                                                                              ║
// ║  Jak změnit barvu?                                                           ║
// ║  Uprav hodnoty v objektu `colors` níže, ulož soubor, Vite automaticky       ║
// ║  znovu vygeneruje CSS. Barvy jsou hexadecimální (#rrggbb).                  ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

/** @type {import('tailwindcss').Config} */
export default {

  // ── CONTENT ────────────────────────────────────────────────────────────────
  // Tailwind prochází tyto soubory a hledá použité třídy (např. "bg-accent-gold").
  // Třídy, které se v těchto souborech NEobjeví, se do výsledného CSS NEZAHRNOU.
  // Tím je výsledný CSS soubor malý (tree-shaking / purging).
  content: [
    './index.html',           // Kořenový HTML soubor
    './src/**/*.{js,ts,jsx,tsx}', // Všechny JS/TS/JSX/TSX soubory v src/
  ],

  // ── DARK MODE ──────────────────────────────────────────────────────────────
  // 'class' = dark mode se zapíná přidáním třídy 'dark' na element <html>.
  // Viz AppContext.tsx: html.classList.add('dark') / remove('dark')
  // Alternativa je 'media' (respektuje systémové nastavení OS) – to nepoužíváme.
  darkMode: 'class',

  theme: {
    extend: {
      // ════════════════════════════════════════════════════════════════════════
      // BARVY – ZDE MĚNÍŠ BARVY CELÉ APLIKACE
      // ════════════════════════════════════════════════════════════════════════
      // Jak barvy používat v JSX?
      // bg-garage-bg        → tmavé pozadí stránky
      // bg-garage-surface   → pozadí karet
      // border-garage-border → jemný rámeček karet
      // text-accent-gold    → zlatý text
      // bg-accent-gold      → zlaté pozadí (tlačítka, aktivní prvky)
      colors: {

        // ── GARAGE PALETTE – tmavé odstíny pro celou UI ──────────────────────
        garage: {
          bg:       '#0a0a0a',  // ← NEJHLUBŠÍ POZADÍ celé stránky (skoro černá)
                                //   Kde se používá: App.tsx → className="bg-garage-bg"
          surface:  '#141414',  // ← Pozadí karet (.card třída v index.css)
                                //   O trochu světlejší než bg, aby karty "vyskočily"
          elevated: '#1e1e1e',  // ← Zvýšené plochy uvnitř karet (inputy, hover stavy)
                                //   Ještě světlejší vrstva pro hloubku designu
          border:   '#2a2a2a',  // ← Barva čar/rámečků oddělujících prvky
                                //   Velmi jemná – sotva viditelná, jen naznačuje strukturu
          muted:    '#3a3a3a',  // ← Šedá pro méně důležité prvky (badge počtu v nav)
                                //   Světlejší než border, ale stále tmavá
        },

        // ── ACCENT PALETTE – barvy pro zvýraznění důležitých věcí ────────────
        accent: {
          gold:         '#c9a84c', // ← HLAVNÍ ZLATÁ BARVA – používá se všude
                                   //   Aktivní nav ikony, tlačítka "Do oblíbených",
                                   //   zvýrazněné specifikace, logická čára (gold-line)
                                   //   → Chceš jiné zlato? Změň jen tuto hodnotu.
          'gold-light': '#e8c76a', // ← Světlejší zlatá pro hover efekty
                                   //   Tlačítko .btn-primary při najetí myší
          'gold-dark':  '#a07830', // ← Tmavší zlatá (gradients, stíny)
                                   //   Používá se v gradientu text-gradient-gold v CSS
          red:          '#e03030', // ← Červená – zatím připravená pro sportovní auta
          blue:         '#3b82f6', // ← Modrá – připravená pro BMW akcent
          silver:       '#94a3b8', // ← Stříbrná pro .badge třídu (tech spec štítky)
        },
      },

      // ════════════════════════════════════════════════════════════════════════
      // FONTY – ZDE MĚNÍŠ PÍSMA
      // ════════════════════════════════════════════════════════════════════════
      // Jak fonty používat?
      // font-display → velké nadpisy (AUTOGARÁŽ, MÁ GARÁŽ...)
      // font-body    → běžný text
      // font-mono    → čísla, specifikace, kódy
      fontFamily: {
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
        //         ↑ Google Font – kondenzované velké písmo, automobilový styl
        //           Je načten v index.html přes <link> tag
        //           Fallback: Impact (běžný ve Windows), pak sans-serif
        body:    ['DM Sans', 'system-ui', 'sans-serif'],
        //         ↑ Moderní čisté písmo pro odstavce
        mono:    ['JetBrains Mono', 'monospace'],
        //         ↑ Monospace font pro číselné specifikace (výkon, spotřeba...)
        //           Čísla jsou stejně široká → tabulky jsou zarovnané
      },

      // ════════════════════════════════════════════════════════════════════════
      // ANIMACE – ZDE MĚNÍŠ ANIMACE
      // ════════════════════════════════════════════════════════════════════════
      keyframes: {
        // slide-up: prvky se "vyjedou" zespodu při načtení (karty aut)
        'slide-up': {
          '0%':   { transform: 'translateY(20px)', opacity: '0' }, // Začátek: 20px pod, neviditelný
          '100%': { transform: 'translateY(0)',    opacity: '1' }, // Konec: na místě, viditelný
        },
        // fade-in: jednoduché zobrazení přes průhlednost (stránky)
        'fade-in': {
          '0%':   { opacity: '0' }, // Začátek: neviditelný
          '100%': { opacity: '1' }, // Konec: plně viditelný
        },
        // shimmer: efekt "přejíždějícího světla" pro skeleton loading placeholdery
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' }, // Světlo je vlevo mimo obrazovku
          '100%': { backgroundPosition:  '200% 0' }, // Světlo odjelo vpravo mimo obrazovku
        },
        // pulse-gold: zlatý pulzující záblesk pro oblíbené auto (aktivní stav)
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201, 168, 76, 0)'     }, // Žádný stín
          '50%':      { boxShadow: '0 0 0 8px rgba(201, 168, 76, 0.15)' }, // Zlatý kroužek 8px
        },
      },

      // Pojmenování animací (doba trvání + easing)
      animation: {
        'slide-up':   'slide-up 0.4s ease-out',           // 0.4s → rychlé ale viditelné
        'fade-in':    'fade-in 0.3s ease-out',             // 0.3s → ještě rychlejší
        'shimmer':    'shimmer 2s infinite linear',         // donekonečna lineárně
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite', // donekonečna, plynule
      },

      // ════════════════════════════════════════════════════════════════════════
      // STÍNY – ZDE MĚNÍŠ HLOUBKU/STÍNY KARET
      // ════════════════════════════════════════════════════════════════════════
      // rgba(0,0,0,0.4) = černý stín s 40% průhledností
      // Větší 3. číslo = větší rozptyl stínu (karta "víc plovoucí")
      boxShadow: {
        'card':       '0 4px 24px rgba(0,0,0,0.4)',        // Normální karta
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',        // Karta po najetí myší
        'gold':       '0 0 20px rgba(201, 168, 76, 0.3)',  // Zlatá záře (vybrané auto v garáži)
        'nav':        '0 -1px 30px rgba(0,0,0,0.8)',       // Stín bottom nav (směřuje nahoru)
      },
    },
  },

  // Žádné extra Tailwind pluginy (forms, typography...) – vše vlastní
  plugins: [],
}