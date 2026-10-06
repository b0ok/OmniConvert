# OmniConvert

> **Precision Unit & Live Currency Converter**  
> A high-precision, tactile measurement and foreign exchange conversion engine with live global rates, historical trends, unit movement bars, and encyclopedic unit origins.

---

## ✨ Features

### 💱 Live Foreign Exchange (FX) Engine
- **Real-Time Global Exchange Rates**: Live rates for **160+ world fiat currencies and cryptocurrencies** (USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, BTC, ETH, etc.) with country flags, ISO codes, and currency symbols.
- **7-Day Historical Sparkline & Volatility**: Interactive SVG line chart illustrating exchange rate movements, percentage volatility, spread (high/low), and date-by-date points.
- **Traveler & Card Fee Simulator**: Interactive bank/credit card foreign transaction surcharge calculator (0%, 1%, 2%, 3%) providing true net out-of-pocket costs.
- **Multi-Currency Basket**: Live simultaneous conversions across 8 major international currencies against the active base amount.
- **Background Synchronization & Manual Refresh**: Auto-updates in the background with timestamp indicators, provider attribution, and manual sync button.

### 📐 12 Comprehensive Measurement Categories
1. **Currency**: 160+ fiat currencies and major cryptocurrencies.
2. **Length & Distance**: Meter, kilometer, centimeter, millimeter, micrometer, nanometer, mile, yard, foot, inch, nautical mile, light-year, astronomical unit.
3. **Mass & Weight**: Kilogram, gram, milligram, microgram, metric ton, pound, ounce, stone, carat, troy ounce, short ton, long ton.
4. **Temperature**: Celsius, Fahrenheit, Kelvin, and Rankine with thermodynamic formulas.
5. **Volume & Capacity**: Liter, milliliter, cubic meter, US gallon, quart, pint, cup, fluid ounce, tablespoon, teaspoon, imperial gallon, oil barrel, cubic foot.
6. **Area**: Square meter, square kilometer, square centimeter, hectare, acre, square foot, square yard, square mile, square inch.
7. **Speed**: Meter/second, kilometer/hour, mile/hour, knot, foot/second, Mach (sound speed), speed of light.
8. **Digital Storage**: Bit, Byte, Kilobyte (KB), Megabyte (MB), Gigabyte (GB), Terabyte (TB), Petabyte (PB), Kibibyte (KiB), Mebibyte (MiB), Gibibyte (GiB), Tebibyte (TiB).
9. **Time**: Nanosecond, microsecond, millisecond, second, minute, hour, day, week, month, year, decade.
10. **Pressure**: Pascal, kilopascal, megapascal, bar, millibar, PSI, atmosphere (atm), Torr / mmHg, inHg.
11. **Energy & Work**: Joule, kilojoule, calorie, kilocalorie (food Cal), watt-hour, kilowatt-hour (kWh), BTU, electronvolt (eV), foot-pound.
12. **Cooking Units**: Teaspoon, tablespoon, US cup, metric cup, fluid ounce, milliliter, deciliter, liter, pinch, dash.

### 🎛️ Tactile UX & Controls
- **Horizontal Unit Movement Bars**: Dedicated unit scroll ribbons inside each input card with `<` and `>` arrow navigation buttons, smooth touch dragging, and instant 1-tap switching.
- **Continuous Value Movement Slider**: Responsive numeric scrubber allowing users to slide input values smoothly and watch the converted result update in real time.
- **Category Navigation Movement Bar**: Scrollable category bar with `<` and `>` glide buttons and edge fade masks so units like Energy & Watts are never clipped.
- **Complete All-Units Breakdown Table**: Instantly displays the entered value converted into every unit in the active category simultaneously, with a built-in search filter and quick-copy actions.
- **Natural Language Quick Converter**: Global search bar supporting direct expressions like `100 USD to EUR`, `5.5 ft to m`, `72 F in C`, or `500 MB in GB`.
- **Copy to Clipboard with Feedback**: Click the dedicated copy button or tap the converted number to copy, triggering an animated floating success toast notification.
- **'Learn More' Encyclopedic Modals**: Interactive modal for every unit explaining its scientific physical definition, historical origin, and real-world trivia.
- **Favorites Pinning & Star Toggles**: Star any unit or currency in the selector modal to pin it directly to the top of the list, saved in persistent storage.
- **Configurable Precision**: Choose between Auto, 2, 4, 6, 8 decimal places, or Scientific notation (`1e+`).
- **Conversion History Drawer**: Automatic logging of recent conversions with timestamps, quick 1-click restore, and clear history controls.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Typography**: Google Fonts (*Plus Jakarta Sans* & *JetBrains Mono* for tabular numerals)
- **Animations**: [Motion](https://motion.dev/) (Framer Motion v12)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🌐 Live FX Data Sources

1. **ExchangeRate-API**: Primary open feed providing live mid-market rates for 160+ fiat currencies and crypto.
2. **European Central Bank (via Frankfurter API)**: Secondary fallback provider backing major central bank currency pairs and historical time-series data.
3. **Bundled Offline Fallback**: Cached baseline rates guaranteeing full offline functionality even without network connectivity.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate into the project directory
cd omniconvert

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the Vite development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port specified in terminal) in your browser.

### Building for Production

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

### Code Quality & Type Checking

```bash
# Run TypeScript type check
npm run lint
```

---

## 📄 License

This project is licensed under the [Apache-2.0 License](LICENSE).
