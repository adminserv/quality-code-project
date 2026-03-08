export interface AstronomicalEvent {
  date: string; // YYYY-MM-DD
  type: 'eclipse_lunar' | 'eclipse_solar' | 'supermoon' | 'blue_moon' | 'blood_moon';
  name: string;
  description: string;
  visibility: string;
  icon: string;
}

// Real astronomical data for 2025–2027
export const ASTRONOMICAL_EVENTS: AstronomicalEvent[] = [
  // 2025
  {
    date: '2025-03-14',
    type: 'eclipse_lunar',
    name: 'Eclipse Total de Luna',
    description: 'Eclipse total con una duración de totalidad de 65 minutos. La Luna se tornará rojiza.',
    visibility: 'América, Europa occidental, África',
    icon: '🌑',
  },
  {
    date: '2025-03-29',
    type: 'eclipse_solar',
    name: 'Eclipse Parcial de Sol',
    description: 'Eclipse solar parcial con hasta un 55% de oscurecimiento.',
    visibility: 'Europa noroccidental, norte de África',
    icon: '☀️',
  },
  {
    date: '2025-05-12',
    type: 'supermoon',
    name: 'Superluna de Flores',
    description: 'Luna llena en perigeo a ~358,000 km. Aparecerá un 7% más grande.',
    visibility: 'Global',
    icon: '🌕',
  },
  {
    date: '2025-06-11',
    type: 'supermoon',
    name: 'Superluna de Fresa',
    description: 'Segunda superluna consecutiva de 2025 a ~359,200 km.',
    visibility: 'Global',
    icon: '🍓',
  },
  {
    date: '2025-09-07',
    type: 'eclipse_lunar',
    name: 'Eclipse Total de Luna',
    description: 'Eclipse total de Luna con totalidad de 82 minutos. "Luna de Sangre" visible.',
    visibility: 'Europa, África, Asia, Oceanía',
    icon: '🩸',
  },
  {
    date: '2025-09-21',
    type: 'eclipse_solar',
    name: 'Eclipse Parcial de Sol',
    description: 'Eclipse parcial de Sol con hasta un 75% de cobertura.',
    visibility: 'Australia, Nueva Zelanda, Antártida',
    icon: '☀️',
  },
  {
    date: '2025-10-07',
    type: 'supermoon',
    name: 'Superluna del Cazador',
    description: 'La superluna más cercana de 2025 a solo 356,884 km. ¡La más grande del año!',
    visibility: 'Global',
    icon: '🏹',
  },
  {
    date: '2025-11-05',
    type: 'supermoon',
    name: 'Superluna del Castor',
    description: 'Última superluna de 2025 a ~357,800 km.',
    visibility: 'Global',
    icon: '🦫',
  },

  // 2026
  {
    date: '2026-02-17',
    type: 'eclipse_solar',
    name: 'Eclipse Anular de Sol',
    description: 'Anillo de fuego solar visible durante 2 minutos 20 segundos en la línea central.',
    visibility: 'Antártida, sur de Sudamérica',
    icon: '💍',
  },
  {
    date: '2026-03-03',
    type: 'eclipse_lunar',
    name: 'Eclipse Total de Luna',
    description: 'Eclipse total con 58 minutos de totalidad. Luna de Sangre espectacular.',
    visibility: 'América, Europa, África occidental',
    icon: '🩸',
  },
  {
    date: '2026-05-01',
    type: 'supermoon',
    name: 'Superluna Rosa',
    description: 'Superluna de mayo en perigeo a ~357,300 km.',
    visibility: 'Global',
    icon: '🌸',
  },
  {
    date: '2026-08-12',
    type: 'eclipse_solar',
    name: 'Eclipse Total de Sol',
    description: '¡Evento mayor! Eclipse total con 2 min 18 seg de totalidad. Cruzará España e Islandia.',
    visibility: 'España, Islandia, Groenlandia, norte de Rusia',
    icon: '🌘',
  },
  {
    date: '2026-08-28',
    type: 'eclipse_lunar',
    name: 'Eclipse Parcial de Luna',
    description: 'Eclipse parcial con un 37% de la superficie lunar en sombra.',
    visibility: 'América, Europa, África',
    icon: '🌓',
  },
  {
    date: '2026-10-18',
    type: 'supermoon',
    name: 'Superluna del Cazador',
    description: 'La superluna más brillante de 2026 a ~356,900 km.',
    visibility: 'Global',
    icon: '🏹',
  },

  // 2027
  {
    date: '2027-02-06',
    type: 'eclipse_solar',
    name: 'Eclipse Anular de Sol',
    description: 'Anillo de fuego visible durante 7 minutos 51 segundos en su máximo.',
    visibility: 'Sudamérica (Chile, Argentina, Uruguay)',
    icon: '💍',
  },
  {
    date: '2027-02-20',
    type: 'eclipse_lunar',
    name: 'Eclipse Penumbral de Luna',
    description: 'Eclipse penumbral sutil. La Luna se oscurecerá ligeramente.',
    visibility: 'América, Europa, África',
    icon: '🌕',
  },
  {
    date: '2027-04-22',
    type: 'supermoon',
    name: 'Superluna Rosa',
    description: 'Primera superluna de 2027 a ~358,100 km.',
    visibility: 'Global',
    icon: '🌸',
  },
  {
    date: '2027-07-18',
    type: 'eclipse_lunar',
    name: 'Eclipse Penumbral de Luna',
    description: 'Eclipse penumbral. Oscurecimiento sutil de la superficie lunar.',
    visibility: 'Asia, Oceanía, Pacífico',
    icon: '🌕',
  },
  {
    date: '2027-08-02',
    type: 'eclipse_solar',
    name: 'Eclipse Total de Sol',
    description: '¡Imperdible! Eclipse total de Sol de 6 min 23 seg. Cruzará España, Marruecos y Egipto.',
    visibility: 'España, norte de África, Arabia, Egipto',
    icon: '🌘',
  },
  {
    date: '2027-11-06',
    type: 'supermoon',
    name: 'Superluna del Castor',
    description: 'La superluna más cercana de 2027 a ~356,700 km.',
    visibility: 'Global',
    icon: '🦫',
  },
];

export function getUpcomingEvents(limit = 6): (AstronomicalEvent & { daysUntil: number })[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return ASTRONOMICAL_EVENTS
    .map(event => {
      const eventDate = new Date(event.date + 'T00:00:00');
      const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return { ...event, daysUntil };
    })
    .filter(e => e.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, limit);
}

export function getPastEvents(limit = 3): (AstronomicalEvent & { daysAgo: number })[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return ASTRONOMICAL_EVENTS
    .map(event => {
      const eventDate = new Date(event.date + 'T00:00:00');
      const daysAgo = Math.ceil((now.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24));
      return { ...event, daysAgo };
    })
    .filter(e => e.daysAgo > 0)
    .sort((a, b) => a.daysAgo - b.daysAgo)
    .slice(0, limit);
}
