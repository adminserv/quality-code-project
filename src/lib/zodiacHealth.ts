export interface ZodiacHealth {
  sign: string;
  emoji: string;
  body: string;
  care: string;
  exercise: string;
  sleep: string;
  element: 'Fuego' | 'Tierra' | 'Aire' | 'Agua';
  fertility: 'Alta' | 'Media' | 'Baja';
}

const zodiacHealthMap: Record<string, ZodiacHealth> = {
  Aries: {
    sign: 'Aries', emoji: '♈', body: 'Cabeza, rostro y cerebro',
    care: 'Masajes en el cuero cabelludo y sienes. Evita el estrés mental excesivo.',
    exercise: 'Cardio intenso, boxeo, sprints — canaliza la energía de fuego.',
    sleep: 'Duerme temprano, la energía ígea agota rápido. Usa lavanda.',
    element: 'Fuego', fertility: 'Baja',
  },
  Tauro: {
    sign: 'Tauro', emoji: '♉', body: 'Cuello, garganta y tiroides',
    care: 'Cuida la garganta con infusiones tibias. Masajes cervicales.',
    exercise: 'Yoga restaurativo, caminatas en la naturaleza.',
    sleep: 'Sueño profundo natural. Hora ideal: antes de las 22:00.',
    element: 'Tierra', fertility: 'Alta',
  },
  Géminis: {
    sign: 'Géminis', emoji: '♊', body: 'Brazos, manos, pulmones y sistema nervioso',
    care: 'Ejercicios de respiración. Estira los brazos y manos.',
    exercise: 'Deportes de raqueta, baile, actividades variadas.',
    sleep: 'Mente activa — escribe un diario antes de dormir.',
    element: 'Aire', fertility: 'Baja',
  },
  Cáncer: {
    sign: 'Cáncer', emoji: '♋', body: 'Pecho, estómago y sistema digestivo',
    care: 'Alimentación nutritiva y casera. Evita comidas pesadas.',
    exercise: 'Natación, aquagym — el agua es tu elemento.',
    sleep: 'Crea un nido acogedor. Tés de manzanilla antes de dormir.',
    element: 'Agua', fertility: 'Alta',
  },
  Leo: {
    sign: 'Leo', emoji: '♌', body: 'Corazón, espalda y columna vertebral',
    care: 'Ejercicios de espalda y postura. Cuida tu corazón emocional.',
    exercise: 'Danza, teatro deportivo, actividades expresivas.',
    sleep: 'Necesitas sentirte seguro. Luz dorada tenue al dormir.',
    element: 'Fuego', fertility: 'Baja',
  },
  Virgo: {
    sign: 'Virgo', emoji: '♍', body: 'Intestinos, sistema digestivo y abdomen',
    care: 'Probióticos y alimentación ordenada. Ayuno intermitente suave.',
    exercise: 'Pilates, caminata rítmica, rutinas estructuradas.',
    sleep: 'Rutina estricta de sueño. Ordena tu habitación antes.',
    element: 'Tierra', fertility: 'Media',
  },
  Libra: {
    sign: 'Libra', emoji: '♎', body: 'Riñones, zona lumbar y piel',
    care: 'Hidratación abundante. Cuidado facial y exfoliación.',
    exercise: 'Barre, danza clásica — busca la armonía del movimiento.',
    sleep: 'Ambiente equilibrado: temperatura 19°C, silencio.',
    element: 'Aire', fertility: 'Media',
  },
  Escorpio: {
    sign: 'Escorpio', emoji: '♏', body: 'Órganos reproductivos y sistema urinario',
    care: 'Baños de asiento calientes. Ejercicios de suelo pélvico.',
    exercise: 'Artes marciales, entrenamiento de fuerza profundo.',
    sleep: 'Sueños intensos esperados. Journaling nocturno.',
    element: 'Agua', fertility: 'Alta',
  },
  Sagitario: {
    sign: 'Sagitario', emoji: '♐', body: 'Caderas, muslos e hígado',
    care: 'Estira la cadera y piernas. Reduce el alcohol.',
    exercise: 'Senderismo, ciclismo, deportes al aire libre.',
    sleep: 'Lee algo inspirador antes de dormir. Ventana abierta.',
    element: 'Fuego', fertility: 'Baja',
  },
  Capricornio: {
    sign: 'Capricornio', emoji: '♑', body: 'Rodillas, huesos y articulaciones',
    care: 'Suplementos de calcio y vitamina D. Protege las rodillas.',
    exercise: 'Escalada, entrenamiento funcional con control.',
    sleep: 'Disciplina de horarios. Melatonina natural.',
    element: 'Tierra', fertility: 'Media',
  },
  Acuario: {
    sign: 'Acuario', emoji: '♒', body: 'Tobillos, circulación y sistema nervioso',
    care: 'Medias de compresión si estás mucho de pie. Circulación.',
    exercise: 'Actividades grupales, deportes alternativos.',
    sleep: 'Desconecta pantallas 1h antes. Ruido blanco.',
    element: 'Aire', fertility: 'Baja',
  },
  Piscis: {
    sign: 'Piscis', emoji: '♓', body: 'Pies, sistema linfático e inmunológico',
    care: 'Baños de pies con sales. Reflexología podal.',
    exercise: 'Natación, tai chi, movimientos fluidos.',
    sleep: 'Sueños vívidos — mantén un diario de sueños.',
    element: 'Agua', fertility: 'Alta',
  },
};

export function getZodiacHealth(sign: string): ZodiacHealth {
  return zodiacHealthMap[sign] || zodiacHealthMap.Aries;
}
