import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  Globe2,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
} from 'lucide-react';
import { UnitDefinition, HistoricalRatePoint } from '../types/converter';
import { CURRENCY_LIST } from '../data/currencies';
import { fetchHistoricalRates } from '../services/currencyApi';
import { formatResultNumber } from '../utils/conversion';

interface CurrencyDashboardProps {
  fromUnit: UnitDefinition;
  toUnit: UnitDefinition;
  fromAmount: number;
  rates: Record<string, number>;
  onSelectTargetCurrency: (code: string) => void;
}

export const CurrencyDashboard: React.FC<CurrencyDashboardProps> = ({
  fromUnit,
  toUnit,
  fromAmount,
  rates,
  onSelectTargetCurrency,
}) => {
  const [historyPoints, setHistoryPoints] = useState<HistoricalRatePoint[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [cardFeePercent, setCardFeePercent] = useState<number>(1.5);
  const [hoveredPoint, setHoveredPoint] = useState<HistoricalRatePoint | null>(null);

  useEffect(() => {
    let isCancelled = false;
    async function loadTrend() {
      setIsLoadingHistory(true);
      try {
        const points = await fetchHistoricalRates(fromUnit.id, toUnit.id, 7);
        if (!isCancelled) {
          setHistoryPoints(points);
        }
      } catch (err) {
        console.error('Failed to load historical rates:', err);
      } finally {
        if (!isCancelled) {
          setIsLoadingHistory(false);
        }
      }
    }

    loadTrend();
    return () => {
      isCancelled = true;
    };
  }, [fromUnit.id, toUnit.id]);

  // Calculations for 7-day trend
  const firstRate = historyPoints[0]?.rate || 1;
  const lastRate = historyPoints[historyPoints.length - 1]?.rate || 1;
  const rateDiff = lastRate - firstRate;
  const percentChange = firstRate !== 0 ? (rateDiff / firstRate) * 100 : 0;
  const isUp = percentChange >= 0;

  const minRate = historyPoints.length ? Math.min(...historyPoints.map((p) => p.rate)) : 0;
  const maxRate = historyPoints.length ? Math.max(...historyPoints.map((p) => p.rate)) : 1;
  const range = maxRate - minRate || 1;

  // Travel card fee calculation
  const baseConverted = fromAmount * (rates[toUnit.id] / (rates[fromUnit.id] || 1));
  const feeAmount = baseConverted * (cardFeePercent / 100);
  const totalWithFee = baseConverted + feeAmount;

  // Basket of popular currencies
  const basketCodes = ['EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'SGD', 'MXN', 'BTC']
    .filter((c) => c !== fromUnit.id)
    .slice(0, 8);

  const basketData = basketCodes.map((code) => {
    const meta = CURRENCY_LIST.find((c) => c.code === code);
    const fromRateToUsd = rates[fromUnit.id] || 1;
    const toRateToUsd = rates[code] || 1;
    const rate = toRateToUsd / fromRateToUsd;
    const converted = fromAmount * rate;
    return {
      code,
      name: meta?.name || code,
      flag: meta?.flag || '🌐',
      symbol: meta?.symbol || code,
      rate,
      converted,
    };
  });

  return (
    <div className="space-y-6 mt-8">
      {/* Grid: 7-Day Chart & Travel Fee Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-Day Historical Trend */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-slate-100">
                  7-Day Rate Trend: {fromUnit.id}/{toUnit.id}
                </h3>
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-mono font-semibold ${
                  isUp ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isUp ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                <span>{percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Historical movement between {fromUnit.name} and {toUnit.name}
            </p>
          </div>

          {/* SVG Trend Line */}
          <div className="my-5 relative">
            {isLoadingHistory ? (
              <div className="h-32 flex items-center justify-center text-xs text-slate-400">
                Fetching historical exchange curve...
              </div>
            ) : historyPoints.length > 1 ? (
              <div className="h-32 w-full flex flex-col justify-end">
                <svg className="w-full h-24 overflow-visible" viewBox="0 0 300 70">
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={isUp ? '#10b981' : '#f43f5e'} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={isUp ? '#10b981' : '#f43f5e'} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Area fill */}
                  <polygon
                    points={`0,70 ${historyPoints
                      .map((p, idx) => {
                        const x = (idx / (historyPoints.length - 1)) * 300;
                        const y = 60 - ((p.rate - minRate) / range) * 50;
                        return `${x},${y}`;
                      })
                      .join(' ')} 300,70`}
                    fill="url(#trendGradient)"
                  />

                  {/* Line */}
                  <polyline
                    fill="none"
                    stroke={isUp ? '#10b981' : '#f43f5e'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={historyPoints
                      .map((p, idx) => {
                        const x = (idx / (historyPoints.length - 1)) * 300;
                        const y = 60 - ((p.rate - minRate) / range) * 50;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* Interactive Dots */}
                  {historyPoints.map((p, idx) => {
                    const x = (idx / (historyPoints.length - 1)) * 300;
                    const y = 60 - ((p.rate - minRate) / range) * 50;
                    const isHovered = hoveredPoint?.date === p.date;
                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r={isHovered ? 4.5 : 3}
                        className={`${
                          isUp ? 'fill-emerald-400 stroke-emerald-950' : 'fill-rose-400 stroke-rose-950'
                        } stroke-2 cursor-pointer transition-all`}
                        onMouseEnter={() => setHoveredPoint(p)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    );
                  })}
                </svg>

                {/* Date labels below */}
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-800/80">
                  <span>{historyPoints[0]?.date}</span>
                  <span>
                    {hoveredPoint
                      ? `${hoveredPoint.date}: ${hoveredPoint.rate}`
                      : `Range: ${minRate.toFixed(4)} - ${maxRate.toFixed(4)}`}
                  </span>
                  <span>{historyPoints[historyPoints.length - 1]?.date}</span>
                </div>
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-xs text-slate-400">
                Data unavailable for this specific pair
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
            <span className="font-mono">Low: {minRate.toFixed(4)}</span>
            <span className="font-mono">High: {maxRate.toFixed(4)}</span>
            <span className="font-mono">Current: {lastRate.toFixed(4)}</span>
          </div>
        </div>

        {/* Travel & Card Foreign Transaction Fee Simulator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-slate-100">
                  Travel & Foreign Card Fee Calculator
                </h3>
              </div>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/50">
                {cardFeePercent}% Fee
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Calculate actual cost after international bank or credit card exchange fees.
            </p>
          </div>

          {/* Fee preset buttons */}
          <div className="my-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Card FX Surcharge:</span>
              <span className="font-medium text-slate-200">
                {cardFeePercent === 0 ? 'No foreign fee (e.g. Wise/Revolut)' : `Standard Bank Fee (${cardFeePercent}%)`}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1.0, 2.0, 3.0].map((fee) => (
                <button
                  key={fee}
                  onClick={() => setCardFeePercent(fee)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-mono transition-all ${
                    cardFeePercent === fee
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {fee === 0 ? '0% (No Fee)' : `${fee}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Breakdown results */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-400">
              <span>Base Amount Converted:</span>
              <span className="font-mono text-slate-200 font-medium">
                {formatResultNumber(baseConverted, '2')} {toUnit.symbol}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>FX Fee ({cardFeePercent}%):</span>
              <span className="font-mono text-amber-400 font-medium">
                +{formatResultNumber(feeAmount, '2')} {toUnit.symbol}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-sm font-semibold text-slate-100">
              <span>Total You Pay:</span>
              <span className="font-mono text-indigo-300">
                {formatResultNumber(totalWithFee, '2')} {toUnit.symbol}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 mt-2 text-center">
            Calculated on {fromAmount} {fromUnit.id} converted to {toUnit.id}
          </div>
        </div>
      </div>

      {/* Multi-Currency Basket Comparison */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Multi-Currency Basket: {fromAmount} {fromUnit.id} in Major Currencies
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Click any currency to set as target converter
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {basketData.map((item) => {
            const isSelected = item.code === toUnit.id;
            return (
              <div
                key={item.code}
                onClick={() => onSelectTargetCurrency(item.code)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500/50 ring-1 ring-indigo-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.flag}</span>
                    <span className="font-bold text-xs text-slate-200">{item.code}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">
                    1={item.rate >= 100 ? item.rate.toFixed(1) : item.rate.toFixed(3)}
                  </span>
                </div>
                <div className="font-mono tabular-nums text-base font-bold text-slate-100 truncate">
                  {formatResultNumber(item.converted, '2')} {item.symbol}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {item.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
