/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  CategoryId,
  UnitDefinition,
  ExchangeRatesData,
  ConversionRecord,
  FavoritePair,
} from './types/converter';
import { CATEGORIES, STATIC_UNITS, DEFAULT_CATEGORY_PAIRS } from './data/units';
import { getCurrencyUnitDefinitions } from './data/currencies';
import { fetchLiveExchangeRates } from './services/currencyApi';
import {
  convertValue,
  parseNaturalLanguageQuery,
  PrecisionMode,
  formatResultNumber,
} from './utils/conversion';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { ConverterCard } from './components/ConverterCard';
import { CurrencyDashboard } from './components/CurrencyDashboard';
import { AllUnitsTable } from './components/AllUnitsTable';
import { UnitPickerModal } from './components/UnitPickerModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { UnitLearnMoreModal } from './components/UnitLearnMoreModal';
import { ArrowUpDown, HelpCircle } from 'lucide-react';

const HISTORY_KEY = 'omniconvert_history_v1';
const FAVORITES_KEY = 'omniconvert_favorites_v1';
const FAV_UNITS_KEY = 'omniconvert_fav_units_v1';

export default function App() {
  // Live rates state
  const [ratesData, setRatesData] = useState<ExchangeRatesData | null>(null);
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(true);

  // Active category & precision
  const [activeCategory, setActiveCategory] = useState<CategoryId>('currency');
  const [precision, setPrecision] = useState<PrecisionMode>('auto');

  // Input value
  const [fromValue, setFromValue] = useState<string>('100');

  // Active unit IDs per category
  const [unitPairs, setUnitPairs] = useState<Record<CategoryId, { from: string; to: string }>>(
    DEFAULT_CATEGORY_PAIRS
  );

  // Modals & UI state
  const [pickerModal, setPickerModal] = useState<{
    isOpen: boolean;
    type: 'from' | 'to';
  }>({ isOpen: false, type: 'from' });

  const [learnMoreUnit, setLearnMoreUnit] = useState<UnitDefinition | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<ConversionRecord[]>([]);
  const [favorites, setFavorites] = useState<FavoritePair[]>([
    { id: 'fav-1', category: 'currency', fromUnit: 'USD', toUnit: 'EUR' },
    { id: 'fav-2', category: 'temperature', fromUnit: 'c', toUnit: 'f' },
    { id: 'fav-3', category: 'length', fromUnit: 'm', toUnit: 'ft' },
  ]);
  const [favoriteUnitIds, setFavoriteUnitIds] = useState<string[]>([
    'USD', 'EUR', 'GBP', 'JPY', 'm', 'km', 'ft', 'mi', 'kg', 'lb', 'c', 'f'
  ]);

  // Search & NLP query
  const [searchQuery, setSearchQuery] = useState('');
  const [searchNotification, setSearchNotification] = useState<string | null>(null);

  // Fetch live exchange rates on mount
  const loadRates = useCallback(async (force = false) => {
    setIsLoadingRates(true);
    try {
      const data = await fetchLiveExchangeRates(force);
      setRatesData(data);
    } catch (err) {
      console.error('Failed to load rates:', err);
    } finally {
      setIsLoadingRates(false);
    }
  }, []);

  useEffect(() => {
    loadRates(false);
  }, [loadRates]);

  // Load history & favorites from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(HISTORY_KEY);
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      const savedFavs = localStorage.getItem(FAVORITES_KEY);
      if (savedFavs) setFavorites(JSON.parse(savedFavs));
      const savedFavUnits = localStorage.getItem(FAV_UNITS_KEY);
      if (savedFavUnits) setFavoriteUnitIds(JSON.parse(savedFavUnits));
    } catch {
      // ignore
    }
  }, []);

  // Save favorites to storage
  const saveFavorites = (newFavs: FavoritePair[]) => {
    setFavorites(newFavs);
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavs));
    } catch {
      // ignore
    }
  };

  const handleToggleFavoriteUnit = (unitId: string) => {
    setFavoriteUnitIds((prev) => {
      const updated = prev.includes(unitId)
        ? prev.filter((id) => id !== unitId)
        : [...prev, unitId];
      try {
        localStorage.setItem(FAV_UNITS_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Build current units for each category
  const currencyUnitDefs = useMemo(() => {
    const rates = ratesData?.rates || {};
    return getCurrencyUnitDefinitions(rates);
  }, [ratesData]);

  const allUnitsByCategory: Record<CategoryId, UnitDefinition[]> = useMemo(() => {
    return {
      currency: currencyUnitDefs,
      ...STATIC_UNITS,
    };
  }, [currencyUnitDefs]);

  // Current category unit list
  const currentCategoryUnits = useMemo(() => {
    return allUnitsByCategory[activeCategory] || [];
  }, [allUnitsByCategory, activeCategory]);

  // Current selected from/to units
  const currentPair = unitPairs[activeCategory] || DEFAULT_CATEGORY_PAIRS[activeCategory];

  const fromUnit = useMemo(() => {
    return (
      currentCategoryUnits.find((u) => u.id === currentPair.from) ||
      currentCategoryUnits[0] || {
        id: 'USD',
        name: 'US Dollar',
        symbol: '$',
        category: 'currency',
      }
    );
  }, [currentCategoryUnits, currentPair.from]);

  const toUnit = useMemo(() => {
    return (
      currentCategoryUnits.find((u) => u.id === currentPair.to) ||
      currentCategoryUnits[1] ||
      currentCategoryUnits[0] || {
        id: 'EUR',
        name: 'Euro',
        symbol: '€',
        category: 'currency',
      }
    );
  }, [currentCategoryUnits, currentPair.to]);

  // Converted value
  const numericFrom = parseFloat(fromValue) || 0;
  const convertedValue = useMemo(() => {
    return convertValue(numericFrom, fromUnit, toUnit);
  }, [numericFrom, fromUnit, toUnit]);

  // Debounced history recording
  const historyTimeoutRef = useRef<number | null>(null);
  useEffect(() => {
    if (isNaN(numericFrom) || numericFrom === 0) return;

    if (historyTimeoutRef.current) {
      window.clearTimeout(historyTimeoutRef.current);
    }

    historyTimeoutRef.current = window.setTimeout(() => {
      const newRecord: ConversionRecord = {
        id: `${Date.now()}-${Math.random()}`,
        category: activeCategory,
        fromAmount: numericFrom,
        fromUnit: fromUnit.symbol,
        toAmount: Number(formatResultNumber(convertedValue, '4').replace(/,/g, '')),
        toUnit: toUnit.symbol,
        timestamp: Date.now(),
      };

      setHistory((prev) => {
        // avoid immediate duplicate
        const last = prev[0];
        if (
          last &&
          last.category === newRecord.category &&
          last.fromAmount === newRecord.fromAmount &&
          last.fromUnit === newRecord.fromUnit &&
          last.toUnit === newRecord.toUnit
        ) {
          return prev;
        }
        const updated = [newRecord, ...prev.slice(0, 49)];
        try {
          localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    }, 1500);

    return () => {
      if (historyTimeoutRef.current) window.clearTimeout(historyTimeoutRef.current);
    };
  }, [numericFrom, convertedValue, activeCategory, fromUnit.symbol, toUnit.symbol]);

  // Handlers
  const handleSwapUnits = () => {
    setUnitPairs((prev) => ({
      ...prev,
      [activeCategory]: {
        from: currentPair.to,
        to: currentPair.from,
      },
    }));
  };

  const handleSelectFromUnit = (unit: UnitDefinition) => {
    setUnitPairs((prev) => ({
      ...prev,
      [activeCategory]: {
        ...prev[activeCategory],
        from: unit.id,
      },
    }));
  };

  const handleSelectToUnit = (unit: UnitDefinition) => {
    setUnitPairs((prev) => ({
      ...prev,
      [activeCategory]: {
        ...prev[activeCategory],
        to: unit.id,
      },
    }));
  };

  const handleSelectCategory = (catId: CategoryId) => {
    setActiveCategory(catId);
    // Sensible preset values when switching
    if (catId === 'temperature') {
      if (Number(fromValue) > 200 || Number(fromValue) === 100) setFromValue('25');
    }
  };

  // NLP Search handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const parsed = parseNaturalLanguageQuery(searchQuery, allUnitsByCategory);
    if (parsed) {
      setActiveCategory(parsed.category);
      setFromValue(parsed.amount.toString());
      setUnitPairs((prev) => ({
        ...prev,
        [parsed.category]: {
          from: parsed.fromUnitId,
          to: parsed.toUnitId,
        },
      }));
      setSearchNotification(`Applied: ${parsed.matchedText}`);
      setSearchQuery('');
      setTimeout(() => setSearchNotification(null), 4000);
    } else {
      setSearchNotification(
        `Could not recognize "${searchQuery}". Try format: "100 USD to EUR" or "5 ft to m"`
      );
      setTimeout(() => setSearchNotification(null), 4000);
    }
  };

  // Restore history record
  const handleRestoreRecord = (rec: ConversionRecord) => {
    setActiveCategory(rec.category);
    setFromValue(rec.fromAmount.toString());
    const units = allUnitsByCategory[rec.category] || [];
    const fromMatch = units.find((u) => u.symbol === rec.fromUnit || u.id === rec.fromUnit);
    const toMatch = units.find((u) => u.symbol === rec.toUnit || u.id === rec.toUnit);

    if (fromMatch && toMatch) {
      setUnitPairs((prev) => ({
        ...prev,
        [rec.category]: {
          from: fromMatch.id,
          to: toMatch.id,
        },
      }));
    }
    setIsHistoryOpen(false);
  };

  // Quick preset values
  const presets = useMemo(() => {
    if (activeCategory === 'currency') return [10, 50, 100, 500, 1000, 5000];
    if (activeCategory === 'temperature') return [0, 20, 37, 72, 100, 212];
    if (activeCategory === 'cooking') return [1, 2, 4, 8, 16, 32];
    return [1, 5, 10, 50, 100, 500];
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        ratesData={ratesData}
        isLoadingRates={isLoadingRates}
        onRefreshRates={() => loadRates(true)}
        precision={precision}
        onPrecisionChange={setPrecision}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Natural language notification banner */}
        {searchNotification && (
          <div className="p-3 bg-indigo-950/80 border border-indigo-500/40 rounded-xl text-xs text-indigo-200 flex items-center justify-between animate-in fade-in duration-150">
            <span>{searchNotification}</span>
            <button
              onClick={() => setSearchNotification(null)}
              className="text-indigo-400 hover:text-white text-xs underline ml-2 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Category Navigation Bar */}
        <div>
          <CategoryNav
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
          />
        </div>

        {/* Main tactile Converter Card */}
        <div>
          <ConverterCard
            category={activeCategory}
            fromUnit={fromUnit}
            toUnit={toUnit}
            fromValue={fromValue}
            toValue={convertedValue}
            onFromValueChange={setFromValue}
            onSwapUnits={handleSwapUnits}
            onOpenFromPicker={() => setPickerModal({ isOpen: true, type: 'from' })}
            onOpenToPicker={() => setPickerModal({ isOpen: true, type: 'to' })}
            precision={precision}
            presets={presets}
            onSelectPreset={(val) => setFromValue(val.toString())}
            onLearnMore={setLearnMoreUnit}
            allUnits={currentCategoryUnits}
            onSelectFromUnit={handleSelectFromUnit}
            onSelectToUnit={handleSelectToUnit}
          />
        </div>

        {/* Dynamic Section: Currency Dashboard when on Currency tab */}
        {activeCategory === 'currency' && ratesData && (
          <div>
            <CurrencyDashboard
              fromUnit={fromUnit}
              toUnit={toUnit}
              fromAmount={numericFrom}
              rates={ratesData.rates}
              onSelectTargetCurrency={(code) => {
                setUnitPairs((prev) => ({
                  ...prev,
                  currency: {
                    ...prev.currency,
                    to: code,
                  },
                }));
              }}
            />
          </div>
        )}

        {/* Dynamic Section: All Units Comparison Table */}
        <div>
          <AllUnitsTable
            category={activeCategory}
            fromUnit={fromUnit}
            fromAmount={numericFrom}
            allUnits={currentCategoryUnits}
            toUnit={toUnit}
            onSelectToUnit={handleSelectToUnit}
            precision={precision}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">OmniConvert</span>
            <span aria-hidden="true">·</span>
            <span>Live exchange rates updated directly via open global feeds</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>160+ Currencies</span>
            <span aria-hidden="true">·</span>
            <span>12 Categories</span>
            <span aria-hidden="true">·</span>
            <span>High Precision Math</span>
          </div>
        </div>
      </footer>

      {/* Unit / Currency Picker Modal */}
      <UnitPickerModal
        isOpen={pickerModal.isOpen}
        onClose={() => setPickerModal((prev) => ({ ...prev, isOpen: false }))}
        units={currentCategoryUnits}
        selectedUnitId={pickerModal.type === 'from' ? fromUnit.id : toUnit.id}
        onSelect={(u) => {
          if (pickerModal.type === 'from') {
            handleSelectFromUnit(u);
          } else {
            handleSelectToUnit(u);
          }
        }}
        title={`Select ${pickerModal.type === 'from' ? 'Source' : 'Target'} ${
          activeCategory === 'currency' ? 'Currency' : 'Unit'
        }`}
        favorites={favoriteUnitIds}
        onToggleFavorite={handleToggleFavoriteUnit}
      />

      {/* Unit Educational / Origin Modal */}
      <UnitLearnMoreModal
        isOpen={!!learnMoreUnit}
        onClose={() => setLearnMoreUnit(null)}
        unit={learnMoreUnit}
      />

      {/* History Slide Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={() => {
          setHistory([]);
          localStorage.removeItem(HISTORY_KEY);
        }}
        onRestoreRecord={handleRestoreRecord}
        favorites={favorites}
        onRemoveFavorite={(id) => saveFavorites(favorites.filter((f) => f.id !== id))}
        onSelectFavorite={(fav) => {
          setActiveCategory(fav.category);
          setUnitPairs((prev) => ({
            ...prev,
            [fav.category]: {
              from: fav.fromUnit,
              to: fav.toUnit,
            },
          }));
          setIsHistoryOpen(false);
        }}
      />
    </div>
  );
}
