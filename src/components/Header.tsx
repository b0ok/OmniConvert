import React from 'react';
import {
  RotateCw,
  Clock,
  History,
  Search,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { PrecisionMode } from '../utils/conversion';
import { ExchangeRatesData } from '../types/converter';

interface HeaderProps {
  ratesData: ExchangeRatesData | null;
  isLoadingRates: boolean;
  onRefreshRates: () => void;
  precision: PrecisionMode;
  onPrecisionChange: (p: PrecisionMode) => void;
  onOpenHistory: () => void;
  historyCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const Header: React.FC<HeaderProps> = ({
  ratesData,
  isLoadingRates,
  onRefreshRates,
  precision,
  onPrecisionChange,
  onOpenHistory,
  historyCount,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}) => {
  const lastUpdatedTime = ratesData?.timeLastUpdateUnix
    ? new Date(ratesData.timeLastUpdateUnix).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5">
          {/* Brand & Live Rates status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-semibold tracking-tight text-slate-100">
                    OmniConvert
                  </h1>
                  <span className="text-[11px] font-medium text-slate-400 bg-slate-850 px-2 py-0.5 rounded border border-slate-800">
                    Precision Engine
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20 animate-pulse" />
                  <span>Live FX Feed</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="truncate max-w-[140px] sm:max-w-none">
                    {ratesData ? ratesData.provider : 'Loading rates...'}
                  </span>
                  {lastUpdatedTime && (
                    <>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {lastUpdatedTime}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Refresh button mobile */}
            <button
              onClick={onRefreshRates}
              disabled={isLoadingRates}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 border border-slate-800 transition-all disabled:opacity-50"
              title="Refresh live exchange rates"
            >
              <RotateCw className={`w-4 h-4 ${isLoadingRates ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>

          {/* Quick NLP search input */}
          <form
            onSubmit={onSearchSubmit}
            className="flex-1 max-w-xl relative"
          >
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Quick convert: e.g. 100 USD to EUR or 5.5 ft to m"
                className="w-full pl-10 pr-24 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/80 transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700/60">
                  Enter ↵
                </kbd>
              </div>
            </div>
          </form>

          {/* Controls: Precision, Refresh & History */}
          <div className="flex items-center gap-2.5 justify-end">
            {/* Precision dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 hidden sm:inline">Decimals:</span>
              <select
                value={precision}
                onChange={(e) => onPrecisionChange(e.target.value as PrecisionMode)}
                aria-label="Precision decimals selector"
                className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
              >
                <option value="auto" className="bg-slate-900 text-slate-100">Auto</option>
                <option value="2" className="bg-slate-900 text-slate-100">2 Decimals</option>
                <option value="4" className="bg-slate-900 text-slate-100">4 Decimals</option>
                <option value="6" className="bg-slate-900 text-slate-100">6 Decimals</option>
                <option value="8" className="bg-slate-900 text-slate-100">8 Decimals</option>
                <option value="scientific" className="bg-slate-900 text-slate-100">Scientific (1e+)</option>
              </select>
            </div>

            {/* Refresh Desktop */}
            <button
              onClick={onRefreshRates}
              disabled={isLoadingRates}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-50"
              title="Refresh live exchange rates"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isLoadingRates ? 'animate-spin text-indigo-400' : ''}`} />
              <span>{isLoadingRates ? 'Updating...' : 'Sync FX'}</span>
            </button>

            {/* History Button */}
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all relative"
              title="View conversion history"
            >
              <History className="w-3.5 h-3.5 text-indigo-400" />
              <span>History</span>
              {historyCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-[10px] font-mono text-white flex items-center justify-center font-bold">
                  {historyCount > 9 ? '9+' : historyCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
