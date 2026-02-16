import { motion } from 'framer-motion';
import { Eye, Calendar, Telescope } from 'lucide-react';
import type { MoonData } from '@/hooks/useMoonPhase';

interface Props {
  moonData: MoonData;
}

const statVariant = {
  hidden: { opacity: 0, x: 30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.2 + i * 0.15, duration: 0.5 },
  }),
};

const MoonStats = ({ moonData }: Props) => {
  const stats = [
    {
      icon: Eye,
      label: 'Iluminación',
      value: `${moonData.illumination.toFixed(1)}%`,
      bar: moonData.illumination,
      barColor: 'bg-lunar-gold',
      iconColor: 'text-lunar-gold',
    },
    {
      icon: Calendar,
      label: 'Edad Lunar',
      value: `${moonData.age.toFixed(1)} días`,
      sublabel: 'del ciclo de 29.53 días',
      bar: (moonData.age / 29.53) * 100,
      barColor: 'bg-primary',
      iconColor: 'text-primary',
    },
    {
      icon: Telescope,
      label: 'Distancia',
      value: `${moonData.distance.toLocaleString('es-ES')} km`,
      sublabel:
        moonData.distance < 384400
          ? 'Más cerca — Perigeo'
          : 'Más lejos — Apogeo',
      bar: ((moonData.distance - 356500) / (406700 - 356500)) * 100,
      barColor: 'bg-cosmic-cyan',
      iconColor: 'text-cosmic-cyan',
    },
  ];

  return (
    <div className="space-y-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={statVariant}
          className="card-glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
            <motion.div
              className={`h-full rounded-full ${stat.barColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(stat.bar, 100)}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 + i * 0.15 }}
            />
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-bold font-display ${stat.iconColor}`}>
              {stat.value}
            </span>
            {stat.sublabel && (
              <span className="text-xs text-muted-foreground">{stat.sublabel}</span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MoonStats;
