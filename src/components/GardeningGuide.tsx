import { motion } from 'framer-motion';
import { Leaf, Droplets, Scissors, Sprout, Sun, CloudRain } from 'lucide-react';
import type { MoonData } from '@/hooks/useMoonPhase';
import { PremiumBadge } from './PremiumBadge';
import { getZodiacHealth } from '@/lib/zodiacHealth';

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

function getPhaseIndex(phase: number): number {
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
  const currentPhaseIdx = getPhaseIndex(moonData.phase);
  const zodiacHealth = getZodiacHealth(moonData.zodiacSign);

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

      {/* Zodiac influence with fertility */}
      <div className="card-glass rounded-3xl p-6">
        <h3 className="font-display font-bold text-foreground mb-3">
          Luna en {moonData.zodiacSign} {moonData.zodiacEmoji}
        </h3>
        <div className="flex gap-2 mb-3">
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
        <p className="text-sm text-muted-foreground leading-relaxed">
          {zodiacHealth.fertility === 'Alta'
            ? `${moonData.zodiacSign} es un signo de ${zodiacHealth.element.toLowerCase()} muy fértil. Excelente momento para sembrar todo tipo de cultivos, especialmente los de hoja y fruto.`
            : zodiacHealth.fertility === 'Media'
              ? `${moonData.zodiacSign} tiene fertilidad moderada. Buen momento para trasplantar y labores de mantenimiento del huerto.`
              : `${moonData.zodiacSign} es un signo poco fértil. Aprovecha para cosechar, podar y preparar la tierra. Evita sembrar.`
          }
        </p>
      </div>
    </motion.div>
  );
};

export default GardeningGuide;
