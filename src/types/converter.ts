export type CategoryId =
  | 'currency'
  | 'length'
  | 'mass'
  | 'temperature'
  | 'volume'
  | 'area'
  | 'speed'
  | 'digital'
  | 'time'
  | 'pressure'
  | 'energy'
  | 'cooking';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
  baseUnit: string;
}

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  category: CategoryId;
  ratioToBase?: number; // relative to base unit (multiply by ratioToBase to get base value)
  toBase?: (val: number) => number; // custom conversion (e.g. for temperature)
  fromBase?: (baseVal: number) => number;
  popular?: boolean;
  description?: string;
  flag?: string; // emoji flag for currency
  country?: string;
  origin?: string; // historical origin story
  scientificDefinition?: string; // scientific / SI physical definition
  funFact?: string; // interesting trivia or real-world comparison
}

export interface ExchangeRatesData {
  base: string;
  date: string;
  timeLastUpdateUnix?: number;
  rates: Record<string, number>;
  provider: string;
}

export interface ConversionRecord {
  id: string;
  category: CategoryId;
  fromAmount: number;
  fromUnit: string;
  toAmount: number;
  toUnit: string;
  timestamp: number;
}

export interface FavoritePair {
  id: string;
  category: CategoryId;
  fromUnit: string;
  toUnit: string;
}

export interface HistoricalRatePoint {
  date: string;
  rate: number;
}
