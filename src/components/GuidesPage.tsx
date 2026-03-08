import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fish, Camera, Anchor, Compass } from 'lucide-react';
import { useMoonPhase } from '@/hooks/useMoonPhase';
import { PremiumBadge, PremiumGate } from './PremiumBadge';
import { usePremium } from '@/contexts/PremiumContext';
import { calculateSolunar } from '@/lib/solunar';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'fishing', label: 'Pesca', icon: Fish },
  { id: 'photo', label: 'Fotografía', icon: Camera },
];

const FishingContent = ({ moonData }: { moonData: ReturnType<typeof useMoonPhase>['moonData'] }) => {
  const solunar = calculateSolunar(new Date(), moonData.phase);
  const stars = Array.from({ length: 5 }, (_, i) => i < solunar.rating);

  return (
    <div className="space-y-6">
      <div className="card-glass rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-cosmic-cyan/15 flex items-center justify-center">
            <Anchor className="w-6 h-6 text-cosmic-cyan" />
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground">Índice Solunar</h3>
            <div className="flex gap-1 mt-1">
              {stars.map((filled, i) => (
                <span key={i} className={`text-sm ${filled ? 'text-lunar-gold' : 'text-muted-foreground/30'}`}>★</span>
              ))}
            </div>
          </div>
        </div>
        <p className="text-foreground/90 leading-relaxed">
          {solunar.rating >= 4
            ? 'Excelente actividad solunar. Peces y fauna muy activos durante los períodos marcados.'
            : solunar.rating >= 3
              ? 'Condiciones moderadas. La pesca puede ser productiva en los períodos mayores.'
              : 'Actividad baja. Los peces tienden a estar menos activos. Mejor esperar a una fase más favorable.'
          }
        </p>
      </div>

      <div className="card-glass rounded-3xl p-6">
        <h3 className="font-display font-bold text-foreground mb-4">Tabla Solunar — Hoy</h3>
        <div className="grid grid-cols-2 gap-3">
          {solunar.periods.map((period, i) => (
            <div key={i} className={cn(
              "rounded-xl p-3 border",
              period.type === 'major'
                ? "bg-cosmic-cyan/10 border-cosmic-cyan/30"
                : "bg-muted/30 border-border/30"
            )}>
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{period.label}</p>
              <p className="font-display font-bold text-foreground text-sm mt-1">
                {period.start} – {period.end}
              </p>
              <p className={cn(
                "text-[11px] mt-0.5 font-medium",
                period.type === 'major' ? 'text-cosmic-cyan' : 'text-primary'
              )}>{period.quality}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground mt-3">
          Calculado según el tránsito lunar del día. Los períodos mayores coinciden con la Luna sobre y bajo el horizonte.
        </p>
      </div>

      <div className="card-glass rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Compass className="w-5 h-5 text-primary" />
          <h3 className="font-display font-bold text-foreground">Consejos de Caza</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {moonData.illumination > 60
            ? 'Luna brillante: los animales se mueven más de noche. Apuesta por el amanecer o el atardecer para mayor actividad.'
            : 'Poca luz lunar: los animales son más activos durante el día. Aprovecha las horas centrales.'
          }
        </p>
      </div>
    </div>
  );
};

const PhotoContent = ({ moonData }: { moonData: ReturnType<typeof useMoonPhase>['moonData'] }) => (
  <div className="space-y-6">
    <div className="card-glass rounded-3xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center">
          <Camera className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-bold text-foreground">Consejo Fotográfico</h3>
          <p className="text-sm text-muted-foreground">{moonData.phaseName}</p>
        </div>
      </div>
      <p className="text-foreground/90 leading-relaxed">{moonData.photographyTip}</p>
    </div>

    <div className="card-glass rounded-3xl p-6">
      <h3 className="font-display font-bold text-foreground mb-4">Configuración Recomendada</h3>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'ISO', value: moonData.illumination > 50 ? '100-400' : '1600-6400' },
          { label: 'Apertura', value: moonData.illumination > 50 ? 'f/8-f/11' : 'f/1.8-f/2.8' },
          { label: 'Velocidad', value: moonData.illumination > 50 ? '1/125s' : '15-30s' },
        ].map(setting => (
          <div key={setting.label} className="bg-muted/30 rounded-xl p-3 text-center border border-border/30">
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{setting.label}</p>
            <p className="font-display font-bold text-primary text-sm mt-1">{setting.value}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="card-glass rounded-3xl p-6">
      <h3 className="font-display font-bold text-foreground mb-3">Condiciones del Cielo</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Oscuridad del cielo</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${100 - moonData.illumination}%` }} />
            </div>
            <span className="text-xs font-bold text-primary">{(100 - moonData.illumination).toFixed(0)}%</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Visibilidad estelar</span>
          <span className={cn(
            "text-xs font-bold",
            moonData.illumination < 30 ? 'text-green-400' : moonData.illumination < 60 ? 'text-lunar-gold' : 'text-nebula-rose'
          )}>
            {moonData.illumination < 30 ? 'Excelente' : moonData.illumination < 60 ? 'Moderada' : 'Limitada'}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const GuidesPage = () => {
  const { moonData } = useMoonPhase();
  const { isPremium } = usePremium();
  const [activeTab, setActiveTab] = useState('fishing');

  const content = (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'fishing' ? (
          <FishingContent moonData={moonData} />
        ) : (
          <PhotoContent moonData={moonData} />
        )}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold font-display text-glow text-center mb-6"
      >
        📖 Guías Especializadas
      </motion.h1>

      <div className="flex gap-2 mb-6 justify-center">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-primary/15 text-primary border border-primary/30'
                : 'bg-muted/30 text-muted-foreground hover:text-foreground border border-transparent'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {isPremium ? content : (
        <PremiumGate feature={activeTab === 'fishing' ? 'Pesca y Caza' : 'Fotografía Lunar'}>
          {activeTab === 'fishing' ? (
            <FishingContent moonData={moonData} />
          ) : (
            <PhotoContent moonData={moonData} />
          )}
        </PremiumGate>
      )}
    </div>
  );
};

export default GuidesPage;
