import { motion } from 'framer-motion';
import type { MoonData } from '@/hooks/useMoonPhase';

interface Props {
  moonData: MoonData;
}

const MoonVisualization = ({ moonData }: Props) => {
  const illuminationFraction = moonData.illumination / 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="card-glass rounded-3xl p-8 flex flex-col items-center"
    >
      {/* Moon */}
      <div className="relative mb-8 animate-float">
        <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-moon-surface moon-glow overflow-hidden relative">
          {/* Shadow overlay based on illumination */}
          <div
            className="absolute inset-0 bg-background transition-all duration-1000 ease-out"
            style={{
              clipPath:
                moonData.phase <= 50
                  ? `inset(0 0 0 ${illuminationFraction * 100}%)`
                  : `inset(0 ${(1 - illuminationFraction) * 100}% 0 0)`,
            }}
          />
          {/* Craters */}
          <div className="absolute top-[22%] left-[30%] w-7 h-7 rounded-full bg-moon-crater/40" />
          <div className="absolute top-[48%] right-[22%] w-10 h-10 rounded-full bg-moon-crater/30" />
          <div className="absolute bottom-[28%] left-[22%] w-5 h-5 rounded-full bg-moon-crater/50" />
          <div className="absolute top-[60%] left-[50%] w-4 h-4 rounded-full bg-moon-crater/25" />
          <div className="absolute top-[15%] right-[35%] w-3 h-3 rounded-full bg-moon-crater/35" />
        </div>
        {/* Ambient glow */}
        <div className="absolute -inset-4 rounded-full bg-moon-glow/10 blur-2xl pointer-events-none" />
      </div>

      {/* Phase info */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <span className="text-6xl mb-3 block">{moonData.phaseEmoji}</span>
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-glow text-foreground mb-2">
          {moonData.phaseName}
        </h2>
        <p className="text-muted-foreground max-w-xs leading-relaxed">
          {moonData.phaseDescription}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default MoonVisualization;
