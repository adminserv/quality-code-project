import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import type { MoonEvent } from '@/hooks/useMoonPhase';

interface Props {
  events: MoonEvent[];
  currentTime: Date;
}

const LunarEvents = ({ events, currentTime }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="card-glass rounded-3xl p-6 sm:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-5 h-5 text-lunar-gold" />
        <h3 className="text-xl font-bold font-display">Próximos Eventos</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {events.map((event, index) => {
          const eventDate = new Date(
            currentTime.getTime() + event.days * 24 * 60 * 60 * 1000
          );
          return (
            <motion.div
              key={event.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-muted/40 rounded-xl p-4 text-center border border-border/50 hover:border-primary/30 transition-colors"
            >
              <span className="text-3xl block mb-2">{event.icon}</span>
              <h4 className="font-semibold text-sm mb-1">{event.name}</h4>
              <p className="text-lunar-gold font-bold text-sm">
                {event.days < 1
                  ? `${(event.days * 24).toFixed(0)}h`
                  : `${event.days.toFixed(1)} días`}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {eventDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default LunarEvents;
