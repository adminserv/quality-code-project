/**
 * Solunar calculation based on lunar transit times.
 * Major periods = moon overhead & underfoot (±1h)
 * Minor periods = moonrise & moonset (±30min)
 */

const LUNAR_DAY = 24.8412; // hours — lunar day (time between successive transits)

export interface SolunarPeriod {
  label: string;
  start: string;
  end: string;
  quality: 'Excelente' | 'Bueno' | 'Moderado';
  type: 'major' | 'minor';
}

export interface SolunarData {
  periods: SolunarPeriod[];
  rating: number; // 1-5
  bestTime: string;
}

function formatTime(hours: number): string {
  const h = ((Math.floor(hours) % 24) + 24) % 24;
  const m = Math.round((hours % 1) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function calculateSolunar(date: Date, moonPhase: number): SolunarData {
  // Approximate lunar transit time based on moon age
  // At new moon, moon transits at ~12:00 (noon, with the sun)
  // Each day adds ~50 min to transit time
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const moonAge = moonPhase / 100 * 29.53;
  
  // Moon transit (overhead) — starts at noon for new moon, shifts ~50min/day
  const transitHour = (12 + moonAge * (24.8412 - 24)) % 24;
  
  // Major period 1: Moon overhead (transit)
  const major1Start = transitHour - 1;
  const major1End = transitHour + 1;
  
  // Major period 2: Moon underfoot (opposite transit, ~12.4h later)
  const underfootHour = (transitHour + LUNAR_DAY / 2) % 24;
  const major2Start = underfootHour - 1;
  const major2End = underfootHour + 1;
  
  // Minor period 1: Moonrise (~6.2h before transit)
  const riseHour = (transitHour - LUNAR_DAY / 4 + 24) % 24;
  const minor1Start = riseHour - 0.5;
  const minor1End = riseHour + 0.5;
  
  // Minor period 2: Moonset (~6.2h after transit)
  const setHour = (transitHour + LUNAR_DAY / 4) % 24;
  const minor2Start = setHour - 0.5;
  const minor2End = setHour + 0.5;

  const periods: SolunarPeriod[] = ([
    {
      label: 'Período Mayor' as const,
      start: formatTime(major1Start),
      end: formatTime(major1End),
      quality: 'Excelente' as const,
      type: 'major' as const,
    },
    {
      label: 'Período Mayor' as const,
      start: formatTime(major2Start),
      end: formatTime(major2End),
      quality: 'Excelente' as const,
      type: 'major' as const,
    },
    {
      label: 'Período Menor' as const,
      start: formatTime(minor1Start),
      end: formatTime(minor1End),
      quality: 'Bueno' as const,
      type: 'minor' as const,
    },
    {
      label: 'Período Menor' as const,
      start: formatTime(minor2Start),
      end: formatTime(minor2End),
      quality: 'Bueno' as const,
      type: 'minor' as const,
    },
  ] satisfies SolunarPeriod[]).sort((a, b) => a.start.localeCompare(b.start));

  // Rating based on phase proximity to new/full moon (strongest tidal pull)
  const phaseNormalized = moonPhase / 100;
  const distFromPeak = Math.min(
    Math.abs(phaseNormalized),
    Math.abs(phaseNormalized - 0.5),
    Math.abs(phaseNormalized - 1)
  );
  const rating = distFromPeak < 0.05 ? 5 : distFromPeak < 0.12 ? 4 : distFromPeak < 0.2 ? 3 : 2;

  return {
    periods,
    rating,
    bestTime: periods.find(p => p.type === 'major')?.start || '12:00',
  };
}
