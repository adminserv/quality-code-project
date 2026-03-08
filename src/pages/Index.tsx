import { Moon, Sparkles, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMoonPhase } from '@/hooks/useMoonPhase';
import StarField from '@/components/StarField';
import MoonVisualization from '@/components/MoonVisualization';
import MoonStats from '@/components/MoonStats';
import LunarEvents from '@/components/LunarEvents';
import MoonFacts from '@/components/MoonFacts';
import LunarCalendar from '@/components/LunarCalendar';
import ShareButton from '@/components/ShareButton';

const Index = () => {
  const { currentTime, moonData } = useMoonPhase();
  const [showAlert, setShowAlert] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  useEffect(() => {
    if (moonData.isSpecialEvent && !showAlert) {
      setShowAlert(true);
      const t = setTimeout(() => setShowAlert(false), 8000);
      return () => clearTimeout(t);
    }
  }, [moonData.isSpecialEvent]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarField />

      {/* Special event alert */}
      <AnimatePresence>
        {showAlert && moonData.isSpecialEvent && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-4 right-4 z-50 card-glass rounded-xl px-5 py-3 border-lunar-gold/40 border"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-lunar-gold" />
              <div>
                <p className="font-semibold text-sm text-lunar-gold">¡Evento Lunar!</p>
                <p className="text-xs text-muted-foreground">{moonData.phaseName}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 sm:py-12 pb-24">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Moon className="w-8 h-8 text-primary" />
            <h1 className="text-3xl sm:text-5xl font-bold font-display text-glow">
              Luna Viva
            </h1>
            <ShareButton moonData={moonData} />
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            {currentTime.toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            {' · '}
            {currentTime.toLocaleTimeString('es-ES')}
          </p>
          {!isStandalone && (
            <Link
              to="/instalar"
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Instalar App
            </Link>
          )}
        </motion.header>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <MoonVisualization moonData={moonData} />
          <MoonStats moonData={moonData} />
        </div>

        {/* Calendar */}
        <div className="mb-6">
          <LunarCalendar />
        </div>

        {/* Events */}
        <div className="mb-6">
          <LunarEvents events={moonData.nextEvents} currentTime={currentTime} />
        </div>

        {/* Facts */}
        <MoonFacts moonData={moonData} />
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Luna Viva",
            "description": "Sigue las fases lunares en tiempo real con guías de jardinería, bienestar, pesca y fotografía nocturna.",
            "applicationCategory": "LifestyleApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR",
            },
            "inLanguage": "es",
          }),
        }}
      />
    </div>
  );
};

export default Index;
