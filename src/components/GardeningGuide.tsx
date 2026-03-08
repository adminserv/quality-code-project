import { motion } from 'framer-motion';
import { Leaf, Droplets, Scissors, Sprout, Sun, CloudRain } from 'lucide-react';
import type { MoonData } from '@/hooks/useMoonPhase';
import { PremiumBadge } from './PremiumBadge';

interface Props {
  moonData: MoonData;
}

const activities = [
  { name: 'Sembrar hojas', phases: [0, 1], icon: Sprout, color: 'text-green-400' },
  { name: 'Sembrar raíces', phases: [5, 6], icon: Droplets, color: 'text-cosmic-cyan' },
  { name: 'Trasplantar', phases: [2, 3], icon: Sun, color: 'text-lunar-gold' },
  { name: 'Podar', phases: [6, 7], icon: Scissors, color: 'text-nebula-rose' },
  { name: 'Cosechar', phases: [4, 5], icon: Leaf, color: 'text-green-300' },
  { name: 'Regar abundante', phases: [3, 4], icon: CloudRain, color: 'text-primary' },
];

function getPhaseIndex(illumination: number, phase: number): number {
  if (phase < 3.3 || phase > 96.7) return 0;
  if (phase < 21.6) return 1;
  if (phase < 28.3) return 2;
  if (phase < 46.7) return 3;
  if (phase < 53.3) return 4;
  if (phase < 71.7) return 5;
  if (phase < 78.3) return 6;
  return 7;
}

const GardeningGuide = ({ moonData }: Props) => {
  const currentPhaseIdx = getPhaseIndex(moonData.illumination, moonData.phase);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Current tip */}
      <div className="card-glass rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-green-500/15 flex items-center justify-center">
            <Leaf className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground">Consejo del Día</h3>
            <p className="text-sm text-muted-foreground">{moonData.phaseName} {moonData.phaseEmoji}</p>
          </div>
        </div>
        <p className="text-foreground/90 leading-relaxed">{moonData.gardeningTip}</p>
      </div>

      {/* Activity matrix */}
      <div className="card-glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-foreground">Actividades Recomendadas</h3>
          <PremiumBadge />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {activities.map((act) => {
            const isOptimal = act.phases.includes(currentPhaseIdx);
            return (
              <div
                key={act.name}
                className={`rounded-2xl p-4 border transition-all ${
                  isOptimal
                    ? 'border-green-500/40 bg-green-500/10'
                    : 'border-border/40 bg-muted/20'
                }`}
              >
                <act.icon className={`w-5 h-5 mb-2 ${isOptimal ? act.color : 'text-muted-foreground'}`} />
                <p className={`text-sm font-semibold ${isOptimal ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {act.name}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {isOptimal ? '✅ Momento ideal' : '⏳ Espera mejor fase'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Zodiac influence */}
      <div className="card-glass rounded-3xl p-6">
        <h3 className="font-display font-bold text-foreground mb-2">
          Luna en {moonData.zodiacSign} {moonData.zodiacEmoji}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          La posición zodiacal de la Luna influye en el tipo de cultivo. Los signos de agua (Cáncer, Escorpio, Piscis) 
          son los más fértiles para sembrar, mientras que los signos de fuego (Aries, Leo, Sagitario) son ideales para la cosecha.
        </p>
      </div>
    </motion.div>
  );
};

export default GardeningGuide;
