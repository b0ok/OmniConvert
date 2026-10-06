import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeftRight,
  Copy,
  Check,
  ChevronDown,
  Info,
  CheckCircle2,
  HelpCircle,
  Sliders,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UnitDefinition, CategoryId } from '../types/converter';
import { formatResultNumber, generateFormulaText, PrecisionMode } from '../utils/conversion';
import { UnitMovementBar } from './UnitMovementBar';

interface ConverterCardProps {
  category: CategoryId;
  fromUnit: UnitDefinition;
  toUnit: UnitDefinition;
  fromValue: string;
  toValue: number;
  onFromValueChange: (val: string) => void;
  onSwapUnits: () => void;
  onOpenFromPicker: () => void;
  onOpenToPicker: () => void;
  precision: PrecisionMode;
  presets: number[];
  onSelectPreset: (n: number) => void;
  onLearnMore: (unit: UnitDefinition) => void;
  allUnits: UnitDefinition[];
  onSelectFromUnit: (unit: UnitDefinition) => void;
  onSelectToUnit: (unit: UnitDefinition) => void;
}

export const ConverterCard: React.FC<ConverterCardProps> = ({
  category,
  fromUnit,
  toUnit,
  fromValue,
  toValue,
  onFromValueChange,
  onSwapUnits,
  onOpenFromPicker,
  onOpenToPicker,
  precision,
  presets,
  onSelectPreset,
  onLearnMore,
  allUnits,
  onSelectFromUnit,
  onSelectToUnit,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedText, setCopiedText] = useState<string>('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [showSlider, setShowSlider] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.scrollLeft = 0;
    }
  }, [category, fromUnit.id, toUnit.id]);

  const formattedResult = formatResultNumber(toValue, precision);
  const { formula, rateSummary } = generateFormulaText(fromUnit, toUnit);

  const numericValue = parseFloat(fromValue) || 0;
  const sliderMax = Math.max(100, Math.ceil(numericValue * 1.5 / 50) * 50 || 500);
  const sliderMin = category === 'temperature' ? -40 : 0;

  const handleCopy = async () => {
    const textToCopy = `${formattedResult} ${toUnit.symbol}`;
    let success = false;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
        success = true;
      }
    } catch {
      // fallback below
    }

    if (!success) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch (err) {
        console.error('Copy fallback failed:', err);
      }
    }

    setCopiedText(textToCopy);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2400);
  };

  const handleSwapClick = () => {
    setIsSwapping(true);
    onSwapUnits();
    setTimeout(() => setIsSwapping(false), 300);
  };

  return (
    <div
      ref={cardRef}
      className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden max-w-4xl mx-auto w-full"
    >
      {/* Background ambient glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Success Notification Toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-4 right-4 z-30 flex items-center gap-2.5 px-3.5 py-2 bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 rounded-xl shadow-xl shadow-emerald-950/50 backdrop-blur-md"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-white">Copied to clipboard: </span>
              <span className="font-mono text-emerald-300 font-medium">{copiedText}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dual Inputs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 relative items-stretch">
        {/* Source Card */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-5 sm:p-6 flex flex-col justify-between focus-within:border-indigo-500/60 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all min-h-[290px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  From
                </span>
                <button
                  type="button"
                  onClick={() => onLearnMore(fromUnit)}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-slate-400 hover:text-indigo-300 hover:bg-slate-850 border border-transparent hover:border-slate-800 transition-all cursor-pointer group"
                  title={`Learn origin & science of ${fromUnit.name}`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                  <span className="text-[11px] text-slate-400 group-hover:text-indigo-300 hidden sm:inline">
                    Learn More
                  </span>
                </button>
              </div>

              <button
                onClick={onOpenFromPicker}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-100 rounded-xl text-xs font-medium border border-slate-700/60 transition-all cursor-pointer group"
              >
                {fromUnit.flag ? (
                  <span className="text-base">{fromUnit.flag}</span>
                ) : (
                  <span className="font-mono text-indigo-400 font-bold">{fromUnit.symbol}</span>
                )}
                <span className="truncate max-w-[120px]">{fromUnit.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-transform" />
              </button>
            </div>

            <div className="h-14 flex items-center my-2">
              <input
                type="number"
                step="any"
                value={fromValue}
                onChange={(e) => onFromValueChange(e.target.value)}
                placeholder="0"
                className="w-full bg-transparent font-mono tabular-nums text-4xl sm:text-5xl font-bold text-slate-100 focus:outline-none placeholder-slate-700 tracking-tight leading-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2.5 border-t border-slate-850">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-slate-300 font-semibold">{fromUnit.symbol}</span>
                <span aria-hidden="true" className="text-slate-700">·</span>
                <span className="text-slate-400 text-[11px] truncate max-w-[140px] sm:max-w-none">{fromUnit.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {fromValue && fromValue !== '0' && (
                  <button
                    onClick={() => onFromValueChange('0')}
                    className="text-xs text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Source Unit Movement Bar */}
            <UnitMovementBar
              units={allUnits}
              selectedUnitId={fromUnit.id}
              onSelectUnit={onSelectFromUnit}
              label="Source Unit Movement Bar"
            />
          </div>
        </div>

        {/* Central Swap Trigger (Precisely aligned with input baselines on desktop) */}
        <div className="flex items-center justify-center -my-2 lg:my-0 lg:absolute lg:left-1/2 lg:top-[74px] lg:-translate-x-1/2 lg:-translate-y-1/2 z-10 pointer-events-auto">
          <motion.button
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: isSwapping ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={handleSwapClick}
            className="w-11 h-11 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 ring-4 ring-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            title="Swap units"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Target Card */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all group/target relative min-h-[290px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  To (Converted)
                </span>
                <button
                  type="button"
                  onClick={() => onLearnMore(toUnit)}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-slate-400 hover:text-indigo-300 hover:bg-slate-850 border border-transparent hover:border-slate-800 transition-all cursor-pointer group"
                  title={`Learn origin & science of ${toUnit.name}`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                  <span className="text-[11px] text-slate-400 group-hover:text-indigo-300 hidden sm:inline">
                    Learn More
                  </span>
                </button>
              </div>

              <button
                onClick={onOpenToPicker}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-100 rounded-xl text-xs font-medium border border-slate-700/60 transition-all cursor-pointer group"
              >
                {toUnit.flag ? (
                  <span className="text-base">{toUnit.flag}</span>
                ) : (
                  <span className="font-mono text-indigo-400 font-bold">{toUnit.symbol}</span>
                )}
                <span className="truncate max-w-[120px]">{toUnit.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-transform" />
              </button>
            </div>

            <div
              onClick={handleCopy}
              className="h-14 flex items-center my-2 overflow-x-auto scrollbar-none cursor-pointer rounded-lg px-1 hover:bg-slate-900/60 transition-colors"
              title="Click to copy result"
            >
              <span className="font-mono tabular-nums text-4xl sm:text-5xl font-bold text-indigo-300 tracking-tight select-all leading-none">
                {formattedResult}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2.5 border-t border-slate-850">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-slate-300 font-semibold">{toUnit.symbol}</span>
                <span aria-hidden="true" className="text-slate-700">·</span>
                <span className="text-slate-400 text-[11px] truncate max-w-[140px] sm:max-w-none">{toUnit.name}</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400'
                    : 'bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60'
                }`}
                title="Copy converted value to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                    <span className="font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-300" />
                    <span>Copy Result</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Target Unit Movement Bar */}
            <UnitMovementBar
              units={allUnits}
              selectedUnitId={toUnit.id}
              onSelectUnit={onSelectToUnit}
              label="Target Unit Movement Bar"
            />
          </div>
        </div>
      </div>

      {/* Tactile Value Movement Slider / Scrubber */}
      <div className="mt-5 p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-medium text-slate-300">Continuous Value Movement Slider</span>
          </div>
          <span className="font-mono text-slate-300 text-xs font-medium">
            {fromValue} {fromUnit.symbol} = {formattedResult} {toUnit.symbol}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-slate-400 w-8 text-right">
            {sliderMin}
          </span>
          <input
            type="range"
            min={sliderMin}
            max={sliderMax}
            step={category === 'temperature' ? 0.5 : 1}
            value={isNaN(numericValue) ? 0 : numericValue}
            onChange={(e) => onFromValueChange(e.target.value)}
            className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
            aria-label="Value movement slider"
          />
          <span className="font-mono text-[11px] text-slate-400 w-10">
            {sliderMax}
          </span>
        </div>
      </div>

      {/* Quick Amount Presets */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          <span className="text-xs text-slate-400 mr-1.5 font-medium">Quick Presets:</span>
          {presets.map((p) => {
            const isCurrent = Number(fromValue) === p;
            return (
              <button
                key={p}
                onClick={() => onSelectPreset(p)}
                className={`px-3 py-1 rounded-lg text-xs font-mono tabular-nums transition-all ${
                  isCurrent
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {category === 'currency' ? `${fromUnit.symbol}${p.toLocaleString()}` : `${p} ${fromUnit.symbol}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Formula & Live Rate Insight */}
      <div className="mt-4 p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="font-mono text-sm font-semibold text-indigo-200">
              {formula}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {rateSummary}
            </div>
          </div>
        </div>

        {category === 'currency' && (
          <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5 sm:self-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Real-time mid-market rate</span>
          </div>
        )}
      </div>
    </div>
  );
};

