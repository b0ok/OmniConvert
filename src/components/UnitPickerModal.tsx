import React, { useState, useMemo, useEffect, useRef } from 'react';
import { UnitDefinition } from '../types/converter';
import { Search, X, Star, Check, Sparkles, Filter } from 'lucide-react';

interface UnitPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: UnitDefinition[];
  selectedUnitId: string;
  onSelect: (unit: UnitDefinition) => void;
  title: string;
  favorites: string[];
  onToggleFavorite?: (unitId: string) => void;
}

export const UnitPickerModal: React.FC<UnitPickerModalProps> = ({
  isOpen,
  onClose,
  units,
  selectedUnitId,
  onSelect,
  title,
  favorites,
  onToggleFavorite,
}) => {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'popular' | 'favorites'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset search & autofocus on modal open
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setFilterMode('all');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredUnits = useMemo(() => {
    let list = units;

    if (filterMode === 'popular') {
      list = list.filter((u) => u.popular);
    } else if (filterMode === 'favorites') {
      list = list.filter((u) => favorites.includes(u.id));
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.symbol.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q) ||
          (u.country && u.country.toLowerCase().includes(q)) ||
          (u.description && u.description.toLowerCase().includes(q))
      );
    }

    // Always sort favorites to the top of the list
    const sorted = [...list].sort((a, b) => {
      const aFav = favorites.includes(a.id);
      const bFav = favorites.includes(b.id);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });

    return sorted;
  }, [units, search, filterMode, favorites]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredUnits.length > 0) {
      onSelect(filteredUnits[0]);
      onClose();
    } else if (e.key === 'Escape') {
      if (search) {
        setSearch('');
      } else {
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  const hasFavorites = units.some((u) => favorites.includes(u.id));
  const hasPopular = units.some((u) => u.popular);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-100">{title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Filter by name or symbol to choose a unit
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Enhanced Search Bar */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by name, symbol, or code (e.g. km, ft, USD, °C)..."
              className="w-full pl-10 pr-20 py-2.5 bg-slate-800/90 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-sans"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {search ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    inputRef.current?.focus();
                  }}
                  className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-md transition-colors"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700/60">
                  ↵ Enter
                </kbd>
              )}
            </div>
          </div>

          {/* Quick Filter Tags & Results Counter */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  filterMode === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                All ({units.length})
              </button>

              {hasPopular && (
                <button
                  type="button"
                  onClick={() => setFilterMode('popular')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    filterMode === 'popular'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Popular</span>
                </button>
              )}

              {hasFavorites && (
                <button
                  type="button"
                  onClick={() => setFilterMode('favorites')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    filterMode === 'favorites'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>Favorites</span>
                </button>
              )}
            </div>

            <span className="text-[11px] font-mono text-slate-400">
              {filteredUnits.length} {filteredUnits.length === 1 ? 'unit' : 'units'}
            </span>
          </div>
        </div>

        {/* Units List */}
        <div className="overflow-y-auto p-3 space-y-1 flex-1 divide-y divide-slate-800/30">
          {filteredUnits.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <p className="text-slate-300 text-sm font-medium mb-1">
                No units match &ldquo;{search}&rdquo;
              </p>
              <p className="text-xs text-slate-400 mb-4">
                Try searching with a different unit name, country, or symbol (e.g. &ldquo;meter&rdquo;, &ldquo;oz&rdquo;, &ldquo;USD&rdquo;).
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setFilterMode('all');
                  inputRef.current?.focus();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredUnits.map((unit, index) => {
              const isSelected = unit.id === selectedUnitId;
              const isFav = favorites.includes(unit.id);
              const prevIsFav = index > 0 && favorites.includes(filteredUnits[index - 1].id);
              const showAllHeader = !isFav && prevIsFav;
              const showFavHeader = index === 0 && isFav && !search.trim();

              return (
                <React.Fragment key={unit.id}>
                  {showFavHeader && (
                    <div className="pt-1 pb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>Favorites ({favorites.filter((id) => units.some((u) => u.id === id)).length})</span>
                      <div className="flex-1 h-px bg-slate-800/80 ml-1" />
                    </div>
                  )}

                  {showAllHeader && (
                    <div className="pt-3 pb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <span>All Units</span>
                      <div className="flex-1 h-px bg-slate-800/80 ml-1" />
                    </div>
                  )}

                  <div
                    onClick={() => {
                      onSelect(unit);
                      onClose();
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border border-indigo-500/40 text-slate-100 shadow-sm'
                        : isFav
                        ? 'bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 text-slate-200'
                        : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {unit.flag ? (
                        <span className="text-2xl flex-shrink-0" role="img" aria-label={unit.name}>
                          {unit.flag}
                        </span>
                      ) : (
                        <span className="w-8 h-8 rounded-lg bg-slate-800 text-indigo-400 font-mono text-xs font-semibold flex items-center justify-center flex-shrink-0 border border-slate-700/60">
                          {unit.symbol}
                        </span>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-slate-200 truncate">
                            {unit.name}
                          </span>
                          <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50 font-bold">
                            {unit.symbol}
                          </span>
                        </div>
                        {unit.description && (
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {unit.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                      {onToggleFavorite && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(unit.id);
                          }}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                            isFav
                              ? 'text-amber-400 bg-amber-500/15 hover:bg-amber-500/25 ring-1 ring-amber-400/40'
                              : 'text-slate-500 hover:text-amber-400 hover:bg-slate-800'
                          }`}
                          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                        </button>
                      )}

                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white flex-shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

