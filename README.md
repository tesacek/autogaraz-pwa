#  AutoGaráž — PWA aplikace

Prémiová mobilní PWA aplikace pro prohlížení, ukládání a porovnávání automobilů značek Mercedes-Benz, BMW a Audi.

## Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** s vlastní tmavou paletou
- **React Router v6**
- **Firebase v10** (Firestore real-time databáze)
- **PWA** (Service Worker, offline mód, installable)
- **CarQuery API** (zdarma data o autech)
- **Framer Motion** / CSS animace

---

##  Instalace a spuštění

```bash
# 1. Instalace závislostí
npm install

# 2. Spuštění vývojového serveru
npm run dev

# 3. Build pro produkci
npm run build

# 4. Preview produkčního buildu
npm run preview
```

---

##  Firebase Setup (POVINNÉ)

Bez Firebase nastavení nebude ukládání fungovat. Data nebudou persistovat.

### Krok 1: Vytvořte Firebase projekt
1. Jděte na [https://console.firebase.google.com](https://console.firebase.google.com)
2. Klikněte **"Add project"** → pojmenujte `autogaraz`
3. Vypněte Google Analytics (volitelné)

### Krok 2: Přidejte Web aplikaci
1. V Project Overview klikněte **"</>"** (Web app)
2. Pojmenujte `AutoGaráž Web`
3. **Zkopírujte** config objekt

### Krok 3: Aktivujte Firestore
1. V levém menu: **Build → Firestore Database**
2. Klikněte **"Create database"**
3. Vyberte **"Start in test mode"** (pro vývoj)
4. Vyberte region (např. `europe-west1`)

### Krok 4: Nahraďte config v kódu
Otevřete `src/lib/firebase.ts` a nahraďte:

```typescript
const firebaseConfig = {
  apiKey: "VAŠE-API-KEY",
  authDomain: "VÁŠE-PROJECT.firebaseapp.com",
  projectId: "VÁŠE-PROJECT-ID",
  storageBucket: "VÁŠE-PROJECT.appspot.com",
  messagingSenderId: "VAŠE-SENDER-ID",
  appId: "VAŠE-APP-ID",
}
```

### Firestore Security Rules (produkce)
V Firebase Console → Firestore → Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      // Pro vývoj – v produkci přidat autentizaci!
      allow read, write: if true;
    }
  }
}
```

---



##  Struktura projektu

```
autogaraz/
├── public/
│   └── icons/              # PWA ikony
│       ├── favicon.svg
│       ├── icon-192.png    ← VYTVOŘIT
│       └── icon-512.png    ← VYTVOŘIT
├── src/
│   ├── context/
│   │   └── AppContext.tsx  # Globální stav (theme, favorites, garage)
│   ├── lib/
│   │   └── firebase.ts     # Firebase inicializace ← NASTAVIT
│   ├── pages/
│   │   ├── HomePage.tsx    # Brand karty (Merc, BMW, Audi)
│   │   ├── ModelsPage.tsx  # Seznam modelů + YearsPage
│   │   ├── TrimsPage.tsx   # Seznam výbav
│   │   ├── CarDetailPage.tsx # Plné specifikace + ukládání
│   │   ├── FavoritesPage.tsx # Oblíbená auta
│   │   ├── GaragePage.tsx  # Garáž + porovnání
│   │   └── SettingsPage.tsx # Nastavení / dark mode
│   ├── services/
│   │   ├── carQueryApi.ts  # CarQuery API volání
│   │   └── firebaseService.ts # Firestore CRUD operace
│   ├── components/
│   │   ├── BottomNav.tsx   # Fixní spodní navigace
│   │   └── ui/index.tsx    # Sdílené UI komponenty
│   ├── types/index.ts      # TypeScript typy
│   ├── App.tsx             # Router + layout
│   ├── main.tsx            # Entry point
│   └── index.css           # Globální styly + Tailwind
├── index.html
├── package.json
├── vite.config.ts          # PWA plugin konfigurace
├── tailwind.config.js      # Vlastní paleta a fonty
└── tsconfig.json
```

---

##  CarQuery API

Aplikace používá [CarQuery API](http://www.carqueryapi.com/api/0.3/) – zdarma, bez API klíče.

| Endpoint | Popis |
|----------|-------|
| `?cmd=getMakes` | Všechny výrobce |
| `?cmd=getModels&make=bmw` | Modely BMW |
| `?cmd=getYears&make=bmw&model=3+Series` | Dostupné roky |
| `?cmd=getTrims&make=bmw&model=3+Series&year=2022` | Výbavy |
| `?cmd=getVehicle&id=<id>` | Plné specifikace |

**CORS:** API funguje bez CORS proxy. Při problémech je v kódu fallback na `allorigins.win` proxy.

**Převod MPG → l/100km:** `l100km = 235.215 / mpg` (viz `carQueryApi.ts`)

---

##  Design systém

| Token | Hodnota | Použití |
|-------|---------|---------|
| `garage-bg` | `#0a0a0a` | Pozadí stránky |
| `garage-surface` | `#141414` | Karty |
| `garage-elevated` | `#1e1e1e` | Zvýšené elementy |
| `accent-gold` | `#c9a84c` | Primární akcent |
| `accent-gold-light` | `#e8c76a` | Hover stavy |
| Font display | Bebas Neue | Nadpisy |
| Font body | DM Sans | Text |
| Font mono | JetBrains Mono | Specifikace |

---

##  Produkční build

```bash
npm run build
```

Výstup je v `/dist`. Obsahuje:
- Komprimované JS/CSS bundles
- Service Worker s Workbox cache
- PWA manifest
- Precached assets pro offline mód

Pro deployment doporučujeme **Vercel** nebo **Firebase Hosting**:
```bash
# Firebase Hosting
npm install -g firebase-tools
firebase init hosting
firebase deploy
```
