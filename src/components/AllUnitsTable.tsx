import React, { useState, useMemo } from 'react';
import { UnitDefinition, CategoryId } from '../types/converter';
import { convertValue, formatResultNumber, PrecisionMode } from '../utils/conversion';
import { Search, Copy, Check, ArrowRight, Table } from 'lucide-react';

interface AllUnitsTableProps {
  category: CategoryId;
  fromUnit: UnitDefinition;
  fromAmount: number;
  allUnits: UnitDefinition[];
  toUnit: UnitDefinition;
  onSelectToUnit: (unit: UnitDefinition) => void;
  precision: PrecisionMode;
}

export const AllUnitsTable: React.FC<AllUnitsTableProps> = ({
  category,
  fromUnit,
  fromAmount,
  allUnits,
  toUnit,
  onSelectToUnit,
  precision,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const conversions = useMemo(() => {
    return allUnits.map((u) => {
      const val = convertValue(fromAmount, fromUnit, u);
      return {
        unit: u,
        value: val,
        formatted: formatResultNumber(val, precision),
      };
    });
  }, [allUnits, fromAmount, fromUnit, precision]);

  const filtered = useMemo(() => {
    if (!filterQuery.trim()) return conversions;
    const q = filterQuery.toLowerCase();
    return conversions.filter(
      (c) =>
        c.unit.name.toLowerCase().includes(q) ||
        c.unit.symbol.toLowerCase().includes(q) ||
        c.unit.id.toLowerCase().includes(q) ||
        (c.unit.country && c.unit.country.toLowerCase().includes(q))
    );
  }, [conversions, filterQuery]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Complete {category.charAt(0).toUpperCase() + category.slice(1)} Breakdown
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time conversion of <span className="text-slate-200 font-mono font-medium">{fromAmount} {fromUnit.symbol}</span> across all units
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter units..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-800/80 border border-slate-700/70 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Unit Name</th>
              <th className="py-3 px-4">Symbol</th>
              <th className="py-3 px-4 text-right">Converted Value</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-950/30">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400">
                  No matching units found
                </td>
              </tr>
            ) : (
              filtered.map(({ unit, formatted }) => {
                const isSelected = unit.id === toUnit.id;
                const isBase = unit.id === fromUnit.id;

                return (
                  <tr
                    key={unit.id}
                    className={`transition-colors ${
                      isBase
                        ? 'bg-indigo-950/20 font-medium'
                        : isSelected
                        ? 'bg-slate-800/40'
                        : 'hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {unit.flag ? (
                          <span className="text-base">{unit.flag}</span>
                        ) : null}
                        <span className="text-slate-200 font-medium">{unit.name}</span>
                        {isBase && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-900/50 text-indigo-300 border border-indigo-700/40">
                            Source
                          </span>
                        )}
                        {isSelected && !isBase && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/50">
                            Current
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-400 font-semibold">
                      {unit.symbol}
                    </td>

                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-100 font-semibold text-sm">
                      {formatted}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleCopy(unit.id, `${formatted} ${unit.symbol}`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                          title="Copy value"
                        >
                          {copiedId === unit.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        {!isSelected && !isBase && (
                          <button
                            onClick={() => onSelectToUnit(unit)}
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                            title="Set as target unit"
                          >
                            <span>Convert</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
