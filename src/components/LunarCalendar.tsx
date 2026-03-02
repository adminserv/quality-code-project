import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { calculateMoonPhase } from '@/hooks/useMoonPhase';
import { cn } from '@/lib/utils';

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

interface DayData {
  date: Date;
  day: number;
  emoji: string;
  phaseName: string;
  illumination: number;
  isToday: boolean;
  isCurrentMonth: boolean;
}

function getMonthDays(year: number, month: number): DayData[] {
  const today = new Date();
  const firstDay = new Date(year, month, 1);
  // Monday-based: 0=Mon..6=Sun
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const days: DayData[] = [];

  // Previous month padding
  for (let i = startWeekday - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthDays - i, 12);
    const moon = calculateMoonPhase(d);
    days.push({
      date: d,
      day: prevMonthDays - i,
      emoji: moon.phaseEmoji,
      phaseName: moon.phaseName,
      illumination: moon.illumination,
      isToday: false,
      isCurrentMonth: false,
    });
  }

  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i, 12);
    const moon = calculateMoonPhase(d);
    const isToday =
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
    days.push({
      date: d,
      day: i,
      emoji: moon.phaseEmoji,
      phaseName: moon.phaseName,
      illumination: moon.illumination,
      isToday,
      isCurrentMonth: true,
    });
  }

  // Next month padding to fill 6 rows (42 cells)
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i, 12);
    const moon = calculateMoonPhase(d);
    days.push({
      date: d,
      day: i,
      emoji: moon.phaseEmoji,
      phaseName: moon.phaseName,
      illumination: moon.illumination,
      isToday: false,
      isCurrentMonth: false,
    });
  }

  return days;
}

const LunarCalendar = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  const days = useMemo(() => getMonthDays(year, month), [year, month]);

  const goToPrev = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const goToNext = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };
  const goToToday = () => {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setSelectedDay(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="card-glass rounded-3xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold text-lg text-foreground">
            Calendario Lunar
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrev}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm font-medium rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            Hoy
          </button>
          <button
            onClick={goToNext}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Month/Year */}
      <p className="text-center font-display font-bold text-xl text-foreground mb-4">
        {MONTHS[month]} {year}
      </p>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-[11px] font-medium text-muted-foreground uppercase tracking-wider py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <button
            key={i}
            onClick={() => setSelectedDay(day)}
            className={cn(
              'relative flex flex-col items-center py-1.5 rounded-xl transition-all duration-200 group',
              day.isCurrentMonth
                ? 'hover:bg-muted/60'
                : 'opacity-30',
              day.isToday && 'ring-1 ring-primary/50 bg-primary/10',
              selectedDay?.date.getTime() === day.date.getTime() && day.isCurrentMonth &&
                'bg-primary/15 ring-1 ring-primary/60',
            )}
          >
            <span className={cn(
              'text-[11px] font-medium leading-none mb-0.5',
              day.isToday ? 'text-primary font-bold' : 'text-muted-foreground',
            )}>
              {day.day}
            </span>
            <span className="text-lg leading-none group-hover:scale-110 transition-transform">
              {day.emoji}
            </span>
          </button>
        ))}
      </div>

      {/* Selected day detail */}
      {selectedDay && selectedDay.isCurrentMonth && (
        <motion.div
          key={selectedDay.date.toISOString()}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-border/50"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{selectedDay.emoji}</span>
            <div>
              <p className="font-display font-semibold text-foreground">
                {selectedDay.phaseName}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedDay.date.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}{' '}
                · Iluminación: {selectedDay.illumination.toFixed(1)}%
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LunarCalendar;
