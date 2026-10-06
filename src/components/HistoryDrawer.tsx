import React from 'react';
import { ConversionRecord, FavoritePair, CategoryId } from '../types/converter';
import { X, Trash2, ArrowRight, Clock, Star, History } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: ConversionRecord[];
  onClearHistory: () => void;
  onRestoreRecord: (record: ConversionRecord) => void;
  favorites: FavoritePair[];
  onRemoveFavorite: (id: string) => void;
  onSelectFavorite: (fav: FavoritePair) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onRestoreRecord,
  favorites,
  onRemoveFavorite,
  onSelectFavorite,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-semibold text-slate-100">
              Conversion Log
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Favorite pairs section if any */}
          {favorites.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>Pinned Favorites</span>
              </div>
              <div className="space-y-1.5">
                {favorites.map((fav) => (
                  <div
                    key={fav.id}
                    onClick={() => onSelectFavorite(fav)}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer group transition-all"
                  >
                    <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-200">
                      <span>{fav.fromUnit}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{fav.toUnit}</span>
                      <span className="text-[10px] text-slate-400 font-sans font-normal ml-2">
                        ({fav.category})
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFavorite(fav.id);
                      }}
                      className="text-slate-400 hover:text-rose-400 p-1 rounded transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent History */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Recent Calculations</span>
              </div>
              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                No conversions recorded yet. Values you calculate will be saved here automatically.
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item) => {
                  const dateStr = new Date(item.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={item.id}
                      onClick={() => onRestoreRecord(item)}
                      className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span className="capitalize font-medium text-indigo-300">
                          {item.category}
                        </span>
                        <span className="font-mono text-[11px]">{dateStr}</span>
                      </div>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-mono text-sm text-slate-300">
                          {item.fromAmount} {item.fromUnit}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 flex-shrink-0" />
                        <span className="font-mono text-sm font-semibold text-indigo-300 truncate">
                          {item.toAmount} {item.toUnit}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-center">
          <p className="text-xs text-slate-400">
            Click any entry to reload its values and units
          </p>
        </div>
      </div>
    </div>
  );
};
