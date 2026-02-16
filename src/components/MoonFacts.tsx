import { motion } from 'framer-motion';
import type { MoonData } from '@/hooks/useMoonPhase';

interface Props {
  moonData: MoonData;
}

const MoonFacts = ({ moonData }: Props) => {
  const facts = [
    {
      emoji: '💡',
      title: 'Dato Curioso',
      text: 'La Luna se aleja de la Tierra 3.8 cm cada año. En el pasado estaba mucho más cerca.',
      accent: 'text-lunar-gold',
    },
    {
      emoji: '🌊',
      title: 'Mareas',
      text: `La fase ${moonData.phaseName} ${moonData.illumination > 80 || moonData.illumination < 20 ? 'intensifica' : 'suaviza'} el efecto de las mareas oceánicas.`,
      accent: 'text-cosmic-cyan',
    },
    {
      emoji: '🔭',
      title: 'Observación',
      text: moonData.illumination > 50
        ? 'Gran momento para observar los detalles de la superficie lunar con binoculares.'
        : 'Cielo oscuro ideal para observar estrellas, nebulosas y la Vía Láctea.',
      accent: 'text-nebula-rose',
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-3">
      {facts.map((fact, i) => (
        <motion.div
          key={fact.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 + i * 0.1 }}
          className="card-glass rounded-xl p-4"
        >
          <h4 className={`font-semibold text-sm mb-1.5 ${fact.accent}`}>
            {fact.emoji} {fact.title}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{fact.text}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default MoonFacts;
