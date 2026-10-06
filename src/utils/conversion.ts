import { CategoryId, UnitDefinition } from '../types/converter';
import { STATIC_UNITS } from '../data/units';
import { CURRENCY_LIST } from '../data/currencies';

export type PrecisionMode = 'auto' | '2' | '4' | '6' | '8' | 'scientific';

export function convertValue(
  amount: number,
  fromUnitDef: UnitDefinition,
  toUnitDef: UnitDefinition
): number {
  if (isNaN(amount)) return 0;
  if (fromUnitDef.id === toUnitDef.id) return amount;

  // Temperature uses custom functions
  if (fromUnitDef.category === 'temperature') {
    const baseCelsius = fromUnitDef.toBase ? fromUnitDef.toBase(amount) : amount;
    return toUnitDef.fromBase ? toUnitDef.fromBase(baseCelsius) : baseCelsius;
  }

  // All other categories use ratioToBase (base = amount * ratioToBase)
  const ratioFrom = fromUnitDef.ratioToBase ?? 1;
  const ratioTo = toUnitDef.ratioToBase ?? 1;

  if (ratioTo === 0) return 0;

  // baseValue = amount * ratioFrom
  // targetValue = baseValue / ratioTo
  const baseValue = amount * ratioFrom;
  return baseValue / ratioTo;
}

export function formatResultNumber(val: number, precision: PrecisionMode = 'auto'): string {
  if (isNaN(val) || !isFinite(val)) return '0';
  if (val === 0) return '0';

  const absVal = Math.abs(val);

  if (precision === 'scientific' || (precision === 'auto' && (absVal < 0.000001 || absVal >= 1e12))) {
    return val.toExponential(4).replace('e+', 'e+');
  }

  if (precision === '2') {
    return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (precision === '4') {
    return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  }
  if (precision === '6') {
    return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  }
  if (precision === '8') {
    return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 });
  }

  // Auto precision: clean display
  if (absVal >= 100000) {
    return val.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
  if (absVal >= 100) {
    return val.toLocaleString('en-US', { maximumFractionDigits: 4 });
  }
  if (absVal >= 1) {
    return val.toLocaleString('en-US', { maximumFractionDigits: 6 });
  }
  return val.toLocaleString('en-US', { maximumFractionDigits: 8 });
}

export function generateFormulaText(
  fromUnitDef: UnitDefinition,
  toUnitDef: UnitDefinition
): { formula: string; rateSummary: string } {
  if (fromUnitDef.category === 'temperature') {
    if (fromUnitDef.id === 'c' && toUnitDef.id === 'f') {
      return { formula: '°F = (°C × 9/5) + 32', rateSummary: 'Water freezes at 0°C (32°F) and boils at 100°C (212°F)' };
    }
    if (fromUnitDef.id === 'f' && toUnitDef.id === 'c') {
      return { formula: '°C = (°F − 32) × 5/9', rateSummary: 'Standard Fahrenheit to Celsius inverse formula' };
    }
    if (fromUnitDef.id === 'c' && toUnitDef.id === 'k') {
      return { formula: 'K = °C + 273.15', rateSummary: 'Absolute thermodynamic Kelvin temperature offset' };
    }
    if (fromUnitDef.id === 'k' && toUnitDef.id === 'c') {
      return { formula: '°C = K − 273.15', rateSummary: 'Kelvin to Celsius inverse offset' };
    }
    if (fromUnitDef.id === 'f' && toUnitDef.id === 'k') {
      return { formula: 'K = (°F − 32) × 5/9 + 273.15', rateSummary: 'Fahrenheit converted to absolute zero scale' };
    }
    return {
      formula: `Convert through Celsius base`,
      rateSummary: `${fromUnitDef.name} to ${toUnitDef.name}`,
    };
  }

  const unitFactor = convertValue(1, fromUnitDef, toUnitDef);
  const inverseFactor = convertValue(1, toUnitDef, fromUnitDef);

  const formattedFactor = formatResultNumber(unitFactor, 'auto');
  const formattedInverse = formatResultNumber(inverseFactor, 'auto');

  if (fromUnitDef.category === 'currency') {
    return {
      formula: `1 ${fromUnitDef.id} = ${formattedFactor} ${toUnitDef.id}`,
      rateSummary: `1 ${toUnitDef.id} = ${formattedInverse} ${fromUnitDef.id}`,
    };
  }

  return {
    formula: `1 ${fromUnitDef.symbol} = ${formattedFactor} ${toUnitDef.symbol}`,
    rateSummary: `Multiply by ${formattedFactor} to convert ${fromUnitDef.name} into ${toUnitDef.name}`,
  };
}

export interface ParsedQuery {
  amount: number;
  category: CategoryId;
  fromUnitId: string;
  toUnitId: string;
  matchedText: string;
}

export function parseNaturalLanguageQuery(
  query: string,
  allUnitDefsByCategory: Record<CategoryId, UnitDefinition[]>
): ParsedQuery | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  // Patterns like "100 usd to eur", "5.5 feet to cm", "98.6 f in c", "100 m -> ft"
  const regex = /^([\d.,]+)\s*([a-zA-Z°µ³²_]+)\s*(?:to|in|into|->|=)\s*([a-zA-Z°µ³²_]+)$/i;
  const match = q.match(regex);
  if (!match) return null;

  const rawAmount = parseFloat(match[1].replace(/,/g, ''));
  if (isNaN(rawAmount)) return null;

  const fromRaw = match[2].toLowerCase();
  const toRaw = match[3].toLowerCase();

  // Search across categories
  const categories = Object.keys(allUnitDefsByCategory) as CategoryId[];
  for (const cat of categories) {
    const list = allUnitDefsByCategory[cat];
    const matchFrom = list.find(
      (u) =>
        u.id.toLowerCase() === fromRaw ||
        u.symbol.toLowerCase() === fromRaw ||
        u.name.toLowerCase() === fromRaw ||
        u.name.toLowerCase().startsWith(fromRaw)
    );
    const matchTo = list.find(
      (u) =>
        u.id.toLowerCase() === toRaw ||
        u.symbol.toLowerCase() === toRaw ||
        u.name.toLowerCase() === toRaw ||
        u.name.toLowerCase().startsWith(toRaw)
    );

    if (matchFrom && matchTo) {
      return {
        amount: rawAmount,
        category: cat,
        fromUnitId: matchFrom.id,
        toUnitId: matchTo.id,
        matchedText: `${rawAmount} ${matchFrom.symbol} to ${matchTo.symbol}`,
      };
    }
  }

  return null;
}
