import React, { useRef, useState, useEffect } from 'react';
import { CategoryId, CategoryInfo } from '../types/converter';
import {
  Coins,
  Ruler,
  Scale,
  Thermometer,
  Droplets,
  Square,
  Gauge,
  HardDrive,
  Clock,
  Activity,
  Zap,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface CategoryNavProps {
  categories: CategoryInfo[];
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Coins,
  Ruler,
  Scale,
  Thermometer,
  Droplets,
  Square,
  Gauge,
  HardDrive,
  Clock,
  Activity,
  Zap,
  UtensilsCrossed,
};

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  // Auto-scroll active category into view without affecting ancestor elements
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const activeEl = container.querySelector<HTMLElement>(
      `[data-category-id="${activeCategory}"]`
    );
    if (activeEl) {
      const containerRect = container.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      const scrollOffset = elRect.left - containerRect.left + container.scrollLeft;
      const targetScroll = scrollOffset - container.clientWidth / 2 + elRect.width / 2;
      container.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
    }
    setTimeout(checkScroll, 350);
  }, [activeCategory]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const offset = direction === 'left' ? -280 : 280;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    setTimeout(checkScroll, 350);
  };

  return (
    <div className="w-full relative group">
      {/* Scroll Navigation Header & Movement hint */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 px-1">
        <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
          Categories ({categories.length})
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-slate-400 hidden sm:inline mr-1">
            Scroll to explore all categories
          </span>
          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className={`p-1 rounded-lg border border-slate-800 transition-all ${
              canScrollLeft
                ? 'bg-slate-900 text-slate-200 hover:bg-indigo-600 hover:text-white cursor-pointer'
                : 'bg-slate-950 text-slate-700 opacity-40 cursor-not-allowed'
            }`}
            title="Scroll categories left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className={`p-1 rounded-lg border border-slate-800 transition-all ${
              canScrollRight
                ? 'bg-slate-900 text-slate-200 hover:bg-indigo-600 hover:text-white cursor-pointer'
                : 'bg-slate-950 text-slate-700 opacity-40 cursor-not-allowed'
            }`}
            title="Scroll categories right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Movement / Scroll Container */}
      <div className="relative flex items-center">
        {/* Left fade indicator */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none rounded-l-2xl" />
        )}

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="w-full flex items-center gap-1.5 overflow-x-auto py-1 px-1 bg-slate-900/90 border border-slate-800/80 rounded-2xl shadow-inner scroll-smooth scrollbar-thin scrollbar-thumb-slate-700/60 scrollbar-track-transparent"
        >
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Coins;
            const isActive = cat.id === activeCategory;

            return (
              <button
                key={cat.id}
                data-category-id={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all select-none cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{cat.name}</span>
                {cat.id === 'currency' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right fade indicator */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none rounded-r-2xl" />
        )}
      </div>
    </div>
  );
};

