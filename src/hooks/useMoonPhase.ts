import { useState, useEffect, useMemo } from 'react';

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
  zodiacSign: string;
  zodiacEmoji: string;
  gardeningTip: string;
  wellnessTip: string;
  fishingRating: number;
  photographyTip: string;
}

const LUNAR_MONTH = 29.53058868;
const KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z');

// Cache for calendar calculations
const phaseCache = new Map<string, MoonData>();

function getCacheKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function calculateMoonPhase(date: Date): MoonData {
  const cacheKey = getCacheKey(date);
  const cached = phaseCache.get(cacheKey);
  if (cached) return cached;

  const diff = date.getTime() - KNOWN_NEW_MOON.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  const phase = ((days % LUNAR_MONTH) + LUNAR_MONTH) % LUNAR_MONTH / LUNAR_MONTH;

  const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2;

  let phaseName = '';
  let phaseEmoji = '';
  let phaseDescription = '';
  let gardeningTip = '';
  let wellnessTip = '';
  let fishingRating = 3;
  let photographyTip = '';

  if (phase < 0.033 || phase > 0.967) {
    phaseName = 'Luna Nueva';
    phaseEmoji = '🌑';
    phaseDescription = 'La Luna está entre la Tierra y el Sol. No es visible desde la superficie terrestre.';
    gardeningTip = 'Ideal para plantar cultivos de hoja y preparar la tierra. La energía se concentra en las raíces.';
    wellnessTip = 'Momento perfecto para nuevos comienzos, establecer intenciones y meditar sobre tus metas.';
    fishingRating = 4;
    photographyTip = 'Cielo completamente oscuro — perfecto para astrofotografía de la Vía Láctea y nebulosas.';
  } else if (phase < 0.216) {
    phaseName = 'Luna Creciente';
    phaseEmoji = '🌒';
    phaseDescription = 'Una delgada franja lunar comienza a iluminarse en el cielo occidental.';
    gardeningTip = 'Planta verduras de hoja: lechuga, espinaca, acelga. La savia sube con fuerza.';
    wellnessTip = 'Energía en ascenso. Ideal para iniciar proyectos, hacer ejercicio intenso y socializar.';
    fishingRating = 3;
    photographyTip = 'La fina media luna crea composiciones elegantes al atardecer con la luz cenicienta.';
  } else if (phase < 0.283) {
    phaseName = 'Cuarto Creciente';
    phaseEmoji = '🌓';
    phaseDescription = 'La mitad derecha de la Luna está iluminada. Visible al atardecer.';
    gardeningTip = 'Trasplanta y siembra frutas y cereales. Buen momento para fertilizar.';
    wellnessTip = 'Fase de acción y determinación. Toma decisiones importantes y avanza con tus planes.';
    fishingRating = 5;
    photographyTip = 'Excelente contraste en cráteres por la línea del terminador. Usa teleobjetivo.';
  } else if (phase < 0.467) {
    phaseName = 'Gibosa Creciente';
    phaseEmoji = '🌔';
    phaseDescription = 'La Luna está casi llena y sigue creciendo cada noche.';
    gardeningTip = 'Momento óptimo para injertar y trasplantar. La vitalidad de las plantas está al máximo.';
    wellnessTip = 'Energía alta pero con necesidad de paciencia. Refina tus proyectos antes de la Luna Llena.';
    fishingRating = 4;
    photographyTip = 'La Luna aparece temprano — ideal para fotos con paisajes iluminados naturalmente.';
  } else if (phase < 0.533) {
    phaseName = 'Luna Llena';
    phaseEmoji = '🌕';
    phaseDescription = 'La Luna está completamente iluminada. Su brillo máximo ilumina la noche.';
    gardeningTip = 'Cosecha hierbas medicinales y frutos. No podes ni trasplantes — la savia está en las hojas.';
    wellnessTip = 'Culminación y celebración. Libera lo que no te sirve. Las emociones están intensificadas.';
    fishingRating = 5;
    photographyTip = 'Luna brillante sobre el horizonte. Incluye edificios o árboles para escala dramática.';
  } else if (phase < 0.717) {
    phaseName = 'Gibosa Menguante';
    phaseEmoji = '🌖';
    phaseDescription = 'La iluminación comienza a decrecer gradualmente desde la derecha.';
    gardeningTip = 'Siembra tubérculos: papas, zanahorias, rábanos. La energía baja hacia las raíces.';
    wellnessTip = 'Fase de gratitud e introspección. Comparte lo aprendido y ayuda a otros.';
    fishingRating = 3;
    photographyTip = 'La Luna sale tarde — combínala con escenas nocturnas urbanas.';
  } else if (phase < 0.783) {
    phaseName = 'Cuarto Menguante';
    phaseEmoji = '🌗';
    phaseDescription = 'La mitad izquierda de la Luna está iluminada. Visible al amanecer.';
    gardeningTip = 'Poda árboles frutales y elimina malas hierbas. Ideal para compostar.';
    wellnessTip = 'Momento de soltar y perdonar. Limpia tu espacio físico y emocional.';
    fishingRating = 5;
    photographyTip = 'Visible al amanecer — crea composiciones con luz dorada y la media Luna.';
  } else {
    phaseName = 'Luna Menguante';
    phaseEmoji = '🌘';
    phaseDescription = 'Una delgada franja lunar precede la llegada de la Luna nueva.';
    gardeningTip = 'Descanso para la tierra. Prepara compost, limpia herramientas y planifica el próximo ciclo.';
    wellnessTip = 'Fase de descanso profundo. Medita, duerme más y recarga energías para el nuevo ciclo.';
    fishingRating = 2;
    photographyTip = 'Oscuridad casi total — última oportunidad para astrofotografía antes de la Luna Nueva.';
  }

  // Zodiac sign based on ecliptic longitude approximation
  const eclipticLong = (phase * 360 + (days % 365.25) * 360 / 365.25) % 360;
  const zodiacIndex = Math.floor(eclipticLong / 30);
  const zodiacSigns = [
    { name: 'Aries', emoji: '♈' },
    { name: 'Tauro', emoji: '♉' },
    { name: 'Géminis', emoji: '♊' },
    { name: 'Cáncer', emoji: '♋' },
    { name: 'Leo', emoji: '♌' },
    { name: 'Virgo', emoji: '♍' },
    { name: 'Libra', emoji: '♎' },
    { name: 'Escorpio', emoji: '♏' },
    { name: 'Sagitario', emoji: '♐' },
    { name: 'Capricornio', emoji: '♑' },
    { name: 'Acuario', emoji: '♒' },
    { name: 'Piscis', emoji: '♓' },
  ];
  const zodiac = zodiacSigns[zodiacIndex] || zodiacSigns[0];

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

  // More accurate distance using anomalistic month
  const anomalisticMonth = 27.55455;
  const perigeeRef = new Date('2000-01-19T00:00:00Z');
  const anomDiff = (date.getTime() - perigeeRef.getTime()) / (1000 * 60 * 60 * 24);
  const anomPhase = ((anomDiff % anomalisticMonth) + anomalisticMonth) % anomalisticMonth / anomalisticMonth;
  const distance = 384400 - 20905 * Math.cos(anomPhase * 2 * Math.PI);

  const isNearFullMoon = Math.abs(phase - 0.5) < 0.01;

  const result: MoonData = {
    phase: phase * 100,
    illumination: illumination * 100,
    phaseName,
    phaseEmoji,
    phaseDescription,
    age: phase * LUNAR_MONTH,
    distance,
    nextEvents: events,
    isSpecialEvent: isNearFullMoon || phase < 0.01 || phase > 0.99,
    zodiacSign: zodiac.name,
    zodiacEmoji: zodiac.emoji,
    gardeningTip,
    wellnessTip,
    fishingRating,
    photographyTip,
  };

  // Only cache daily precision (for calendar)
  if (phaseCache.size > 400) phaseCache.clear();
  phaseCache.set(cacheKey, result);

  return result;
}

export function useMoonPhase() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const moonData = useMemo(() => calculateMoonPhase(currentTime), [currentTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every 60s — moon phase changes slowly
    return () => clearInterval(timer);
  }, []);

  return { currentTime, moonData };
}
