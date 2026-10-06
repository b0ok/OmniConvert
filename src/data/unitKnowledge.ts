export interface UnitKnowledge {
  origin: string;
  scientificDefinition: string;
  funFact?: string;
}

export const UNIT_KNOWLEDGE_MAP: Record<string, UnitKnowledge> = {
  // LENGTH
  m: {
    origin: 'Conceived during the French Revolution in 1791 by the French Academy of Sciences, seeking an egalitarian decimal measurement system not based on royalty.',
    scientificDefinition: 'Defined since 1983 as the path length traveled by light in a vacuum during a time interval of 1 / 299,792,458 of a second.',
    funFact: 'Originally intended to equal exactly 1/10,000,000 of the distance from the Earth’s equator to the North Pole through Paris.'
  },
  km: {
    origin: 'Adopted in 1799 alongside the French Republican metrication reforms to measure inter-city travel and territorial boundaries.',
    scientificDefinition: 'Strictly 1,000 meters (10³ m), based on the speed of light standard.',
    funFact: 'A person walking at a brisk pace covers about 1 kilometer in 10 to 12 minutes.'
  },
  cm: {
    origin: 'Created as a practical everyday metric subdivision (1/100 meter) for carpentry, textiles, and domestic crafts.',
    scientificDefinition: 'Equal to 10⁻² meters (1/100 of a meter).',
    funFact: 'The width of an average adult fingernail is approximately 1 centimeter.'
  },
  mm: {
    origin: 'Established in the metric system for engineering and mechanical drafting to replace fractions of an inch.',
    scientificDefinition: 'Equal to 10⁻³ meters (0.001 m).',
    funFact: 'Standard credit cards are exactly 0.76 millimeters thick.'
  },
  ft: {
    origin: 'One of the oldest human measurements, originally derived from the anatomical length of an adult human foot in ancient Sumer, Greece, and Rome.',
    scientificDefinition: 'Standardized by the 1959 International Yard and Pound Agreement as exactly 0.3048 meters.',
    funFact: 'In medieval Europe, King David I of Scotland defined a foot as the average length of the right foot of 12 men tall, medium, and small standing in line.'
  },
  in: {
    origin: 'Derived from the Latin "uncia" (meaning one-twelfth). In 1324, King Edward II of England decreed that 1 inch equals 3 grains of dry barley laid end-to-end.',
    scientificDefinition: 'Defined internationally as exactly 25.4 millimeters (0.0254 m).',
    funFact: 'The width of an adult human thumb across the knuckle was the original working approximation.'
  },
  yd: {
    origin: 'Traditionally said to be the distance from the tip of English King Henry I’s nose to the end of his outstretched thumb.',
    scientificDefinition: 'Standardized in 1959 as exactly 0.9144 meters (3 feet or 36 inches).',
    funFact: 'American football fields are famously partitioned into 100 yards of playing field.'
  },
  mi: {
    origin: 'Originated with the Roman legionaries as "mille passus" (a thousand paces), where one pace was two complete marching steps (left and right, ~5 Roman feet).',
    scientificDefinition: 'Legally defined as 5,280 standard international feet, or exactly 1,609.344 meters.',
    funFact: 'Queen Elizabeth I amended the mile in 1593 to 8 furlongs (5,280 ft) so it aligned smoothly with English agricultural land survey standards.'
  },
  nmi: {
    origin: 'Invented by navigators to link map distance directly to navigational angle and celestial sextant readings.',
    scientificDefinition: 'Historically defined as one minute (1/60th of a degree) of latitude along any meridian. Standardized in 1929 as exactly 1,852 meters.',
    funFact: 'Traveling 1 nautical mile per hour is defined as exactly 1 knot.'
  },
  ly: {
    origin: 'First used by astronomer Friedrich Bessel in 1838 after measuring the distance to star 61 Cygni, showing conventional units were impossibly small for interstellar space.',
    scientificDefinition: 'The distance light travels in vacuum in one Julian year (365.25 days), equivalent to 9.4607304725808 × 10¹⁵ meters (~5.88 trillion miles).',
    funFact: 'Sunlight takes about 8 minutes and 20 seconds to reach Earth, meaning the Sun is roughly 0.0000158 light-years away.'
  },

  // MASS
  kg: {
    origin: 'Defined in 1795 in revolutionary France as the mass of one cubic decimeter (one liter) of water at its freezing point (later at its density peak of 4°C).',
    scientificDefinition: 'Since the 2019 redefinition of the SI base units, the kilogram is defined in terms of the Planck constant h (6.62607015 × 10⁻³⁴ J·s) using a Kibble balance.',
    funFact: 'For 130 years, the entire world’s definition of mass rested on a single physical platinum-iridium cylinder kept under triple bell jars in Sèvres, France.'
  },
  g: {
    origin: 'Introduced in 1795 as the base unit "grave" (later gramme) representing the mass of 1 cubic centimeter of water.',
    scientificDefinition: 'Strictly 1/1,000 of a kilogram (10⁻³ kg).',
    funFact: 'A standard paperclip or small banknote weighs almost exactly 1 gram.'
  },
  lb: {
    origin: 'Derived from the ancient Roman "libra pondo" (a pound by weight). The abbreviation "lb" comes directly from the Roman word "libra".',
    scientificDefinition: 'The international avoirdupois pound is legally defined as exactly 0.45359237 kilograms.',
    funFact: 'Precious metals use the "troy pound" (12 ounces), while standard commerce uses the "avoirdupois pound" (16 ounces).'
  },
  oz: {
    origin: 'From the Anglo-Norman French "ounce" and Latin "uncia" (one-twelfth), adapted into the 16-ounce avoirdupois system in 14th-century England.',
    scientificDefinition: 'Defined as exactly 1/16 of an international avoirdupois pound (approx. 28.349523125 grams).',
    funFact: 'A standard slice of bread or single AA battery weighs about 1 ounce.'
  },
  t: {
    origin: 'Derived from the Middle English "tunne", a large wooden cask or barrel used for fermenting and transporting wine.',
    scientificDefinition: 'Equal to 1,000 kilograms (1 megagram or approx. 2,204.62 pounds).',
    funFact: 'A typical adult female African elephant weighs roughly 3 to 4 metric tons.'
  },
  ct: {
    origin: 'Traced to the carob seed ("karat" in Arabic / "keration" in Greek), prized in antiquity because seeds were believed to possess remarkably uniform weight.',
    scientificDefinition: 'Standardized in 1907 at the Fourth General Conference on Weights and Measures as exactly 200 milligrams (0.2 g).',
    funFact: 'The Hope Diamond, one of the most famous gems in history, weighs 45.52 carats (about 9.1 grams).'
  },

  // TEMPERATURE
  c: {
    origin: 'Devised in 1742 by Swedish astronomer Anders Celsius. Celsius initially set 0° as the boiling point and 100° as the freezing point; botanist Carl Linnaeus reversed the scale in 1744.',
    scientificDefinition: 'Defined relative to the kelvin: temperature in °C equals temperature in K minus 273.15.',
    funFact: 'At -40 degrees, the Celsius and Fahrenheit scales intersect: -40°C is exactly equal to -40°F.'
  },
  f: {
    origin: 'Created in 1724 by physicist Daniel Gabriel Fahrenheit. He established 0°F as the temperature of an ice-salt-water brine, and 96°F as normal human body temperature.',
    scientificDefinition: 'Defined by the formula: °F = (°C × 9/5) + 32.',
    funFact: 'Fahrenheit invented the first modern mercury thermometer, making repeatable precision temperature readings possible worldwide.'
  },
  k: {
    origin: 'Proposed in 1848 by William Thomson (Lord Kelvin), who calculated the point where infinite heat extraction would cause all molecular motion to cease: Absolute Zero.',
    scientificDefinition: 'The SI base unit of thermodynamic temperature, defined by fixing the numerical value of the Boltzmann constant k to 1.380649 × 10⁻²³ J/K.',
    funFact: 'Kelvin has no degree symbol (°). Scientists write "300 K", not "300 °K".'
  },
  r: {
    origin: 'Proposed in 1859 by Scottish civil engineer and physicist William John Macquorn Rankine as an absolute temperature thermodynamic scale based on Fahrenheit degrees.',
    scientificDefinition: 'Defined such that absolute zero is 0 °R, with degree intervals identical to Fahrenheit: °R = °F + 459.67.',
    funFact: 'Still frequently utilized in aerospace engineering in the United States for combustion thermodynamics and rocketry heat transfers.'
  },

  // VOLUME
  l: {
    origin: 'Introduced in revolutionary France in 1795 as the "litron", replacing archaic feudal measures like the boisseau and pinte.',
    scientificDefinition: 'Accepted special name for the cubic decimeter (1 dm³ = 0.001 m³).',
    funFact: '1 liter of pure liquid water at 4°C has a mass of almost exactly 1 kilogram.'
  },
  ml: {
    origin: 'Created as the metric sub-unit for liquid pharmaceutical dosages and chemistry assays.',
    scientificDefinition: 'Equal to 1 cubic centimeter (1 cm³ or 10⁻⁶ m³).',
    funFact: 'One standard drop of liquid water is approximately 0.05 milliliters.'
  },
  gal_us: {
    origin: 'Inherited from the British Queen Anne wine gallon of 1707 (defined as a cylinder 7 inches in diameter and 6 inches deep, holding 231 cubic inches).',
    scientificDefinition: 'Legally defined in the United States as exactly 231 cubic inches (approx. 3.785411784 liters).',
    funFact: 'The British Imperial gallon is ~20% larger (4.546 L) because the British redefined theirs in 1824 based on the volume of 10 pounds of distilled water.'
  },
  cup_us: {
    origin: 'Pioneered by Fannie Farmer in the 1896 Boston Cooking School Cook Book, standardizing recipes away from ambiguous terms like "a butter pat" or "a tea teacup".',
    scientificDefinition: 'Equal to 8 US fluid ounces or exactly 236.5882365 milliliters (in US nutrition labeling, rounded to 240 mL).',
    funFact: 'A metric cup used in Australia, New Zealand, and Canada is defined as exactly 250 milliliters.'
  },
  floz_us: {
    origin: 'Created to connect fluid volume with the avoirdupois weight of water.',
    scientificDefinition: 'Equal to 1/128th of a US gallon or approximately 29.5735295625 milliliters.',
    funFact: 'One US fluid ounce of water weighs approximately 1.04 ounces avoirdupois.'
  },

  // CURRENCIES
  USD: {
    origin: 'Established by the US Coinage Act of 1792. The name "dollar" derives from the Bohemian "Joachimsthaler", a renowned 16th-century silver coin minted in the Joachim valley.',
    scientificDefinition: 'Global primary reserve currency issued by the Federal Reserve; standard benchmark for international trade and commodities.',
    funFact: 'The iconic "$" sign is believed to originate from the Spanish-American abbreviation "Pˢ" for Spanish silver pesos ("Pieces of Eight").'
  },
  EUR: {
    origin: 'Created under the 1992 Maastricht Treaty and introduced non-physically on January 1, 1999, followed by banknotes and coins on January 1, 2002, uniting 20 European nations.',
    scientificDefinition: 'Official fiat currency of the Eurozone, managed by the European Central Bank in Frankfurt, Germany.',
    funFact: 'The euro banknotes feature fictional bridges and architectural gateways to avoid favoring any individual nation’s real landmarks.'
  },
  GBP: {
    origin: 'The world’s oldest continuously used currency, dating back to King Offa of Mercia in 775 AD, who minted silver pennies weighing 1/240th of a Tower pound.',
    scientificDefinition: 'Official legal tender of the United Kingdom, issued by the Bank of England (founded 1694).',
    funFact: 'Until decimalization on February 15, 1971, one pound was divided into 20 shillings, and each shilling into 12 pence (240 pence per pound).'
  },
  JPY: {
    origin: 'Adopted in 1871 under the Meiji New Currency Act to modernize Japan’s economy. "Yen" translates literally to "round object" or "circle".',
    scientificDefinition: 'Official currency of Japan, managed by the Bank of Japan, often regarded as a global safe-haven currency.',
    funFact: 'The 1-yen coin is made of 100% pure aluminum and is so light (1 gram) that it can float horizontally on surface-tension water.'
  },
  CAD: {
    origin: 'Created in 1858 when the Province of Canada abandoned the British sterling system to align with North American decimal commerce.',
    scientificDefinition: 'Official currency of Canada, managed by the Bank of Canada; classified as a major commodity currency.',
    funFact: 'Canadians colloquially call their $1 coin the "Loonie" (after the solitary common loon bird depicted on the reverse) and the $2 coin the "Toonie".'
  },
  AUD: {
    origin: 'Introduced on February 14, 1966, replacing the Australian pound and decimalizing currency with 100 cents per dollar.',
    scientificDefinition: 'Official currency of Australia, managed by the Reserve Bank of Australia.',
    funFact: 'Australia pioneered the world’s first polymer (plastic) banknotes in 1988, which are waterproof and feature micro-security transparent windows.'
  },
  CHF: {
    origin: 'Established by the Swiss Federal Constitution of 1848, centralizing more than 8,000 distinct coins and banknotes previously minted by separate cantons.',
    scientificDefinition: 'Official currency of Switzerland and Liechtenstein; traditional global haven asset due to Swiss fiscal conservatism.',
    funFact: 'Switzerland was historically the last major currency backed 40% by physical gold reserves until May 2000.'
  },
  CNY: {
    origin: 'Introduced by the People’s Bank of China in December 1948 shortly before the founding of the PRC. "Renminbi" means "the People’s Currency".',
    scientificDefinition: 'Official currency of the People’s Republic of China, with the primary unit designated as the yuan.',
    funFact: 'China is recognized as the inventor of paper money, having issued "Jiaozi" paper notes in Sichuan province during the Song Dynasty around 1024 AD.'
  },
  INR: {
    origin: 'Traced to the "Rūpiya" silver coin introduced by Sultan Sher Shah Suri around 1540, derived from the Sanskrit word "rūpya" meaning wrought silver.',
    scientificDefinition: 'Official currency of India, regulated by the Reserve Bank of India.',
    funFact: 'The current rupee currency symbol (₹) was unveiled in 2010, blending the Devanagari letter "र" (ra) and the Latin capital "R".'
  },
  BTC: {
    origin: 'Invented in 2008 by pseudonymous creator Satoshi Nakamoto in a cryptographic whitepaper following the global financial crisis.',
    scientificDefinition: 'Decentralized peer-to-peer digital currency based on proof-of-work consensus, SHA-256 hashing, and an immutable public ledger.',
    funFact: 'The total supply of Bitcoin is mathematically capped at 21 million coins, with reward issuance halved roughly every four years.'
  },

  // DIGITAL
  B: {
    origin: 'Coined by Dr. Werner Buchholz in June 1956 during the design of the IBM 7030 Stretch supercomputer as a deliberate misspelling of "bite" to avoid accidental confusion with "bit".',
    scientificDefinition: 'A digital data storage unit consisting of exactly 8 contiguous binary bits (octect).',
    funFact: 'A single byte can represent 256 distinct values (2⁸), sufficient to encode any standard ASCII character.'
  },
  GB: {
    origin: 'Adopted in computer engineering as magnetic disk storage and microchip densities grew through the 1980s and 1990s.',
    scientificDefinition: 'In SI decimal standard: 10⁹ bytes (1,000,000,000 bytes). In binary memory terminology (GiB): 2³⁰ bytes (1,073,741,824 bytes).',
    funFact: 'In 1980, the first 1-gigabyte hard drive, the IBM 3380, was the size of a refrigerator, weighed 550 pounds, and cost $40,000.'
  },

  // SPEED
  kmh: {
    origin: 'Became the international continental standard with the introduction of early automotive speedometers and railways in late 19th-century Europe.',
    scientificDefinition: 'Speed equivalent to traveling 1,000 meters in 3,600 seconds (approx. 0.27778 m/s).',
    funFact: 'The fastest land speed record by a car is 1,227.98 km/h (763.035 mph) set by ThrustSSC in 1997, breaking the sound barrier.'
  },
  mph: {
    origin: 'Evolved from nautical and railway distance standards in Britain and adopted into American and UK highway traffic acts.',
    scientificDefinition: 'Equal to traveling 5,280 feet in 1 hour (exactly 0.44704 meters per second).',
    funFact: 'The fastest human sprint ever recorded was Usain Bolt reaching a top speed of 27.78 mph (44.72 km/h) during the 100m sprint in 2009.'
  },
  knot: {
    origin: '16th-century sailors threw a wooden log attached to a knotted rope behind the ship. They counted how many knots passed through a sailor’s hands in 30 seconds measured by a sandglass.',
    scientificDefinition: 'Defined as 1 nautical mile per hour (exactly 1.852 km/h or approx. 0.5144 m/s).',
    funFact: 'Because nautical miles match Earth latitude circles, knots remain the universal standard for commercial aviation and ocean maritime navigation.'
  },

  // PRESSURE
  Pa: {
    origin: 'Named in 1971 at the 14th General Conference on Weights and Measures in honor of French polymath Blaise Pascal, who investigated barometric air pressure on mountain peaks.',
    scientificDefinition: 'The SI derived unit of pressure: 1 Newton of perpendicular force applied over an area of 1 square meter (1 N/m² = 1 kg·m⁻¹·s⁻²).',
    funFact: 'Standard atmospheric pressure at sea level is about 101,325 Pascals (101.3 kPa).'
  },
  psi: {
    origin: 'The traditional Anglo-American engineering measure of mechanical stress and hydraulic fluid pressure.',
    scientificDefinition: 'Defined as the pressure resulting from 1 pound-force applied to an area of 1 square inch (approx. 6,894.76 Pascals).',
    funFact: 'Average passenger car tires are inflated to between 30 and 35 psi.'
  },
  bar: {
    origin: 'Introduced in 1909 by British meteorologist William Napier Shaw from the Greek word "báros" meaning weight.',
    scientificDefinition: 'Defined as exactly 100,000 Pascals (100 kPa), slightly less than current average sea-level atmospheric pressure.',
    funFact: 'At the bottom of the Mariana Trench (~11,000 m deep), water pressure exceeds 1,086 bar.'
  },

  // ENERGY
  J: {
    origin: 'Named in 1889 after English physicist James Prescott Joule, who experimentally proved the mechanical equivalence of heat (that work and heat are interchangeable).',
    scientificDefinition: 'The SI unit of energy: the work done when a force of 1 Newton moves an object 1 meter in the direction of the force (1 N·m = 1 kg·m²·s⁻²).',
    funFact: 'Lifting a standard medium apple (about 100 grams) straight up by 1 meter requires roughly 1 Joule of mechanical energy.'
  },
  kWh: {
    origin: 'Developed by early electrical utility providers like Thomas Edison’s illuminating companies to bill consumers for electrical work over time.',
    scientificDefinition: 'Energy transferred or consumed at a constant rate of 1,000 Watts for a duration of 1 hour, equal to exactly 3,600,000 Joules (3.6 MJ).',
    funFact: '1 kilowatt-hour is enough energy to power an efficient LED light bulb continuously for about 100 hours.'
  },
  kcal: {
    origin: 'Introduced by French chemist Nicolas Clément in the 1820s as a measure of heat produced by steam engines and metabolism.',
    scientificDefinition: 'The amount of heat energy required to raise the temperature of 1 kilogram of water by 1 degree Celsius (defined as 4,184 Joules).',
    funFact: 'The "Calories" printed on food nutrition labels are actually kilocalories (1 food Calorie = 1,000 physical gram calories).'
  }
};

export function getUnitKnowledge(unitId: string, name: string, category: string): UnitKnowledge {
  if (UNIT_KNOWLEDGE_MAP[unitId]) {
    return UNIT_KNOWLEDGE_MAP[unitId];
  }

  // Generative fallback for other units/currencies
  if (category === 'currency') {
    return {
      origin: `The ${name} is the sovereign currency representing the financial and economic sovereignty of its issuing monetary authority.`,
      scientificDefinition: `Regulated medium of exchange and legal tender, circulating with real-time foreign exchange valuation against global currency pairs.`,
      funFact: `Exchange rates fluctuate continuously during international banking sessions based on global trade, interest rates, and inflation benchmarks.`
    };
  }

  return {
    origin: `The ${name} originated as a standardized metric or empirical measurement benchmark developed to enable uniform trade, science, and engineering.`,
    scientificDefinition: `Standard measurement unit in the ${category} domain, systematically anchored to physical constants or calibrated relative to base standards.`,
    funFact: `Standardized units eliminate discrepancies in scientific collaboration and international industrial manufacturing.`
  };
}
