import React, { useRef, useEffect } from 'react';
import { UnitDefinition } from '../types/converter';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface UnitMovementBarProps {
  units: UnitDefinition[];
  selectedUnitId: string;
  onSelectUnit: (unit: UnitDefinition) => void;
  label?: string;
}

export const UnitMovementBar: React.FC<UnitMovementBarProps> = ({
  units,
  selectedUnitId,
  onSelectUnit,
  label,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll selected unit into view without affecting ancestor elements
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const activeEl = container.querySelector<HTMLElement>(
      `[data-unit-id="${selectedUnitId}"]`
    );
    if (activeEl) {
      const containerRect = container.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      const scrollOffset = elRect.left - containerRect.left + container.scrollLeft;
      const targetScroll = scrollOffset - container.clientWidth / 2 + elRect.width / 2;
      container.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
    }
  }, [selectedUnitId]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const offset = direction === 'left' ? -220 : 220;
    scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  if (!units || units.length === 0) return null;

  return (
    <div className="w-full mt-3 pt-2.5 border-t border-slate-800/60">
      {label && (
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 px-0.5">
          <span className="font-medium">{label}</span>
          <span className="font-mono text-[10px] text-slate-400">
            Scroll or drag units ⇄
          </span>
        </div>
      )}

      <div className="relative group/bar flex items-center">
        {/* Scroll Left Button */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="absolute left-0 z-10 w-6 h-6 -ml-2 rounded-full bg-slate-800/90 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-700/80 shadow-md flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover/bar:opacity-100 cursor-pointer"
          title="Scroll left"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Scrollable Unit Track */}
        <div
          ref={scrollContainerRef}
          className="w-full flex items-center gap-1.5 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700/50 scrollbar-track-transparent py-1 px-1 scroll-smooth"
        >
          {units.map((unit) => {
            const isSelected = unit.id === selectedUnitId;
            return (
              <button
                key={unit.id}
                data-unit-id={unit.id}
                type="button"
                onClick={() => onSelectUnit(unit)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400 scale-[1.02]'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
                title={`${unit.name} (${unit.symbol})`}
              >
                {unit.flag ? (
                  <span className="text-sm leading-none">{unit.flag}</span>
                ) : (
                  <span
                    className={`font-mono text-[11px] font-bold ${
                      isSelected ? 'text-white' : 'text-indigo-400'
                    }`}
                  >
                    {unit.symbol}
                  </span>
                )}
                <span className="truncate max-w-[85px] text-[11px]">
                  {unit.symbol}
                </span>
              </button>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="absolute right-0 z-10 w-6 h-6 -mr-2 rounded-full bg-slate-800/90 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-700/80 shadow-md flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover/bar:opacity-100 cursor-pointer"
          title="Scroll right"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
