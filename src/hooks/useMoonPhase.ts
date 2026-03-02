import { useState, useEffect } from 'react';

export interface MoonEvent {
  name: string;
  days: number;
  icon: string;
}

export interface MoonData {
  phase: number;
  illumination: number;
  phaseName: string;
  phaseEmoji: string;
  phaseDescription: string;
  age: number;
  distance: number;
  nextEvents: MoonEvent[];
  isSpecialEvent: boolean;
}

const LUNAR_MONTH = 29.53058868;
const KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z');

export function calculateMoonPhase(date: Date): MoonData {
  const diff = date.getTime() - KNOWN_NEW_MOON.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  const phase = ((days % LUNAR_MONTH) + LUNAR_MONTH) % LUNAR_MONTH / LUNAR_MONTH;

  const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2;

  let phaseName = '';
  let phaseEmoji = '';
  let phaseDescription = '';

  if (phase < 0.033 || phase > 0.967) {
    phaseName = 'Luna Nueva';
    phaseEmoji = '🌑';
    phaseDescription = 'La Luna está entre la Tierra y el Sol. No es visible desde la superficie terrestre.';
  } else if (phase < 0.216) {
    phaseName = 'Luna Creciente';
    phaseEmoji = '🌒';
    phaseDescription = 'Una delgada franja lunar comienza a iluminarse en el cielo occidental.';
  } else if (phase < 0.283) {
    phaseName = 'Cuarto Creciente';
    phaseEmoji = '🌓';
    phaseDescription = 'La mitad derecha de la Luna está iluminada. Visible al atardecer.';
  } else if (phase < 0.467) {
    phaseName = 'Gibosa Creciente';
    phaseEmoji = '🌔';
    phaseDescription = 'La Luna está casi llena y sigue creciendo cada noche.';
  } else if (phase < 0.533) {
    phaseName = 'Luna Llena';
    phaseEmoji = '🌕';
    phaseDescription = 'La Luna está completamente iluminada. Su brillo máximo ilumina la noche.';
  } else if (phase < 0.717) {
    phaseName = 'Gibosa Menguante';
    phaseEmoji = '🌖';
    phaseDescription = 'La iluminación comienza a decrecer gradualmente desde la derecha.';
  } else if (phase < 0.783) {
    phaseName = 'Cuarto Menguante';
    phaseEmoji = '🌗';
    phaseDescription = 'La mitad izquierda de la Luna está iluminada. Visible al amanecer.';
  } else {
    phaseName = 'Luna Menguante';
    phaseEmoji = '🌘';
    phaseDescription = 'Una delgada franja lunar precede la llegada de la Luna nueva.';
  }

  const daysUntilNewMoon = ((1 - phase) * LUNAR_MONTH) % LUNAR_MONTH;
  const daysUntilFullMoon = ((0.5 - phase + 1) % 1) * LUNAR_MONTH;
  const daysUntilFirstQuarter = ((0.25 - phase + 1) % 1) * LUNAR_MONTH;
  const daysUntilLastQuarter = ((0.75 - phase + 1) % 1) * LUNAR_MONTH;

  const events: MoonEvent[] = [
    { name: 'Luna Nueva', days: daysUntilNewMoon, icon: '🌑' },
    { name: 'Cuarto Creciente', days: daysUntilFirstQuarter, icon: '🌓' },
    { name: 'Luna Llena', days: daysUntilFullMoon, icon: '🌕' },
    { name: 'Cuarto Menguante', days: daysUntilLastQuarter, icon: '🌗' },
  ].sort((a, b) => a.days - b.days);

  const avgDistance = 384400;
  const distanceVariation = Math.sin(phase * 2 * Math.PI) * 25000;
  const distance = avgDistance + distanceVariation;

  const isNearFullMoon = Math.abs(phase - 0.5) < 0.01;

  return {
    phase: phase * 100,
    illumination: illumination * 100,
    phaseName,
    phaseEmoji,
    phaseDescription,
    age: phase * LUNAR_MONTH,
    distance,
    nextEvents: events,
    isSpecialEvent: isNearFullMoon || phase < 0.01 || phase > 0.99,
  };
}

export function useMoonPhase() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [moonData, setMoonData] = useState<MoonData>(() => calculateMoonPhase(new Date()));

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setMoonData(calculateMoonPhase(now));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return { currentTime, moonData };
}
