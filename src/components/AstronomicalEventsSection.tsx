import { motion } from 'framer-motion';
import { Telescope, MapPin, Calendar } from 'lucide-react';
import { getUpcomingEvents } from '@/lib/astronomicalEvents';
import { cn } from '@/lib/utils';

const typeColors: Record<string, string> = {
  eclipse_lunar: 'border-nebula-rose/40 bg-nebula-rose/10',
  eclipse_solar: 'border-lunar-gold/40 bg-lunar-gold/10',
  supermoon: 'border-cosmic-cyan/40 bg-cosmic-cyan/10',
  blue_moon: 'border-primary/40 bg-primary/10',
  blood_moon: 'border-destructive/40 bg-destructive/10',
};

const typeLabels: Record<string, string> = {
  eclipse_lunar: 'Eclipse Lunar',
  eclipse_solar: 'Eclipse Solar',
  supermoon: 'Superluna',
  blue_moon: 'Luna Azul',
  blood_moon: 'Luna de Sangre',
};

const AstronomicalEventsSection = () => {
  const events = getUpcomingEvents(6);

  if (events.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.6 }}
      className="card-glass rounded-3xl p-6 sm:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <Telescope className="w-5 h-5 text-cosmic-cyan" />
        <h3 className="text-xl font-bold font-display">Eventos Astronómicos</h3>
        <span className="text-xs bg-cosmic-cyan/15 text-cosmic-cyan px-2 py-0.5 rounded-full font-medium">
          2025–2027
        </span>
      </div>

      <div className="space-y-3">
        {events.map((event, i) => {
          const eventDate = new Date(event.date + 'T00:00:00');
          return (
            <motion.div
              key={event.date + event.type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.08 }}
              className={cn(
                'rounded-xl p-4 border transition-colors hover:scale-[1.01]',
                typeColors[event.type] || 'border-border/40 bg-muted/30'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{event.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-display font-bold text-sm text-foreground">{event.name}</h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted/50 text-muted-foreground font-medium">
                      {typeLabels[event.type]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{event.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">
                        {eventDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground truncate">{event.visibility}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-bold font-display text-primary">{event.daysUntil}</span>
                  <p className="text-[10px] text-muted-foreground">días</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AstronomicalEventsSection;
