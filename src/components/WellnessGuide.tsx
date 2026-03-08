import { motion } from 'framer-motion';
import { Heart, Brain, Sparkles, Moon, Flame, Wind, Dumbbell, BedDouble } from 'lucide-react';
import type { MoonData } from '@/hooks/useMoonPhase';
import { getZodiacHealth } from '@/lib/zodiacHealth';

interface Props {
  moonData: MoonData;
}

const rituals = [
  {
    phase: 'Luna Nueva',
    icon: Moon,
    title: 'Ritual de Intenciones',
    steps: ['Enciende una vela blanca', 'Escribe 3 deseos en papel', 'Medita 10 minutos en silencio', 'Guarda el papel bajo tu almohada'],
  },
  {
    phase: 'Luna Llena',
    icon: Sparkles,
    title: 'Ritual de Liberación',
    steps: ['Escribe lo que quieres soltar', 'Lee en voz alta bajo la Luna', 'Quema el papel con seguridad', 'Agradece y deja ir'],
  },
  {
    phase: 'Cuarto Creciente',
    icon: Flame,
    title: 'Ritual de Acción',
    steps: ['Revisa tu lista de intenciones', 'Elige una acción concreta hoy', 'Visualiza el resultado deseado', 'Actúa con determinación'],
  },
  {
    phase: 'Cuarto Menguante',
    icon: Wind,
    title: 'Ritual de Limpieza',
    steps: ['Limpia tu espacio con salvia', 'Ordena un área de tu hogar', 'Medita sobre el perdón', 'Toma un baño purificante'],
  },
];

const WellnessGuide = ({ moonData }: Props) => {
  const currentRitual = rituals.find(r => r.phase === moonData.phaseName) || rituals[0];
  const energyLevel = moonData.illumination > 70 ? 'Alta' : moonData.illumination > 30 ? 'Media' : 'Baja';
  const energyColor = moonData.illumination > 70 ? 'text-lunar-gold' : moonData.illumination > 30 ? 'text-primary' : 'text-cosmic-cyan';
  const zodiacHealth = getZodiacHealth(moonData.zodiacSign);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Daily wellness tip */}
      <div className="card-glass rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-nebula-rose/15 flex items-center justify-center">
            <Heart className="w-6 h-6 text-nebula-rose" />
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground">Bienestar Lunar</h3>
            <p className="text-sm text-muted-foreground">{moonData.phaseName} {moonData.phaseEmoji}</p>
          </div>
        </div>
        <p className="text-foreground/90 leading-relaxed">{moonData.wellnessTip}</p>
      </div>

      {/* Energy meter */}
      <div className="card-glass rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-display font-bold text-foreground">Nivel de Energía Lunar</h3>
        </div>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cosmic-cyan via-primary to-lunar-gold"
              initial={{ width: 0 }}
              animate={{ width: `${moonData.illumination}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
          <span className={`font-bold font-display ${energyColor}`}>{energyLevel}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {moonData.illumination > 70
            ? 'Energía intensa — ideal para actividades sociales y creativas. Cuida el descanso.'
            : moonData.illumination > 30
              ? 'Energía equilibrada — buen momento para productividad sostenida.'
              : 'Energía introspectiva — favorece la meditación, el journaling y el autocuidado.'
          }
        </p>
      </div>

      {/* Zodiac body map */}
      <div className="card-glass rounded-3xl p-6">
        <h3 className="font-display font-bold text-foreground mb-4">
          {zodiacHealth.emoji} Luna en {zodiacHealth.sign} — Cuerpo
        </h3>
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-xl p-4 border border-border/30">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Zona del cuerpo</p>
            <p className="text-sm text-foreground font-semibold">{zodiacHealth.body}</p>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">{zodiacHealth.care}</p>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/30 rounded-xl p-3 border border-border/30">
              <div className="flex items-center gap-2 mb-1">
                <Dumbbell className="w-3.5 h-3.5 text-lunar-gold" />
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Ejercicio</p>
              </div>
              <p className="text-xs text-foreground/80">{zodiacHealth.exercise}</p>
            </div>
            <div className="bg-muted/30 rounded-xl p-3 border border-border/30">
              <div className="flex items-center gap-2 mb-1">
                <BedDouble className="w-3.5 h-3.5 text-cosmic-cyan" />
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Sueño</p>
              </div>
              <p className="text-xs text-foreground/80">{zodiacHealth.sleep}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-muted/40 text-[11px] font-medium text-muted-foreground">
              Elemento: {zodiacHealth.element}
            </span>
            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${
              zodiacHealth.fertility === 'Alta' ? 'bg-green-500/15 text-green-400' :
              zodiacHealth.fertility === 'Media' ? 'bg-lunar-gold/15 text-lunar-gold' :
              'bg-muted/40 text-muted-foreground'
            }`}>
              Fertilidad: {zodiacHealth.fertility}
            </span>
          </div>
        </div>
      </div>

      {/* Ritual */}
      <div className="card-glass rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <currentRitual.icon className="w-5 h-5 text-lunar-gold" />
          <h3 className="font-display font-bold text-foreground">{currentRitual.title}</h3>
        </div>
        <ol className="space-y-3">
          {currentRitual.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-lunar-gold/15 text-lunar-gold text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-foreground/80">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </motion.div>
  );
};

export default WellnessGuide;
