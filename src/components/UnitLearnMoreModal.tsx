import React, { useEffect } from 'react';
import { UnitDefinition } from '../types/converter';
import { getUnitKnowledge } from '../data/unitKnowledge';
import {
  X,
  BookOpen,
  Landmark,
  Atom,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UnitLearnMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: UnitDefinition | null;
}

export const UnitLearnMoreModal: React.FC<UnitLearnMoreModalProps> = ({
  isOpen,
  onClose,
  unit,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !unit) return null;

  const knowledge = getUnitKnowledge(unit.id, unit.name, unit.category);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient header glow */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-64 h-32 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3.5">
            {unit.flag ? (
              <span className="text-3xl" role="img" aria-label={unit.name}>
                {unit.flag}
              </span>
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-mono text-base font-bold flex items-center justify-center shadow-inner">
                {unit.symbol}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100 tracking-tight">
                  {unit.name}
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60 font-semibold">
                  {unit.symbol}
                </span>
              </div>
              <p className="text-xs text-slate-400 capitalize mt-0.5">
                {unit.category} {unit.country ? `· ${unit.country}` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Educational Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* Scientific Definition */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Atom className="w-4 h-4" />
              <span>Scientific & Mathematical Definition</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {knowledge.scientificDefinition}
            </p>
          </div>

          {/* Historical Origin */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Landmark className="w-4 h-4" />
              <span>Historical Origin & Evolution</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {knowledge.origin}
            </p>
          </div>

          {/* Trivia / Real World Fact */}
          {knowledge.funFact && (
            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Trivia & Real-World Context</span>
              </div>
              <p className="text-sm text-indigo-100/90 leading-relaxed font-sans">
                {knowledge.funFact}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/50 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-400">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Encyclopedia of Measurement & Currency</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </motion.div>
    </div>
  );
};
