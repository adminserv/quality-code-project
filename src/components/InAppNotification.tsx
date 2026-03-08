import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell } from 'lucide-react';
import { calculateMoonPhase } from '@/hooks/useMoonPhase';

interface LunarNotification {
  id: string;
  title: string;
  body: string;
  icon: string;
  timestamp: number;
}

const InAppNotification = () => {
  const [notifications, setNotifications] = useState<LunarNotification[]>([]);

  useEffect(() => {
    // Listen for custom lunar notification events
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const notification: LunarNotification = {
        id: `${Date.now()}-${Math.random()}`,
        ...detail,
      };
      setNotifications((prev) => [notification, ...prev].slice(0, 3));

      // Auto-dismiss after 8 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      }, 8000);
    };

    window.addEventListener('lunar-notification', handler);

    // Check for special events on mount
    checkCurrentEvents();

    return () => window.removeEventListener('lunar-notification', handler);
  }, []);

  function checkCurrentEvents() {
    const moon = calculateMoonPhase(new Date());

    // Check if it's a special phase right now
    if (moon.phaseName === 'Luna Llena') {
      addNotification('🌕 ¡Luna Llena!', moon.phaseDescription, '🌕');
    } else if (moon.phaseName === 'Luna Nueva') {
      addNotification('🌑 Luna Nueva', moon.phaseDescription, '🌑');
    }

    // Check for upcoming events within 24h
    for (const event of moon.nextEvents) {
      if (event.days <= 1) {
        addNotification(
          `${event.icon} ${event.name} se acerca`,
          `En ${event.days < 1 ? `${Math.round(event.days * 24)}h` : '1 día'}`,
          event.icon
        );
        break; // Only show the nearest event
      }
    }
  }

  function addNotification(title: string, body: string, icon: string) {
    // Check if already dismissed in this session
    const dismissedKey = `dismissed-${title}-${new Date().toDateString()}`;
    if (sessionStorage.getItem(dismissedKey)) return;

    const notification: LunarNotification = {
      id: `${Date.now()}-${Math.random()}`,
      title,
      body,
      icon,
      timestamp: Date.now(),
    };
    setNotifications((prev) => [notification, ...prev].slice(0, 3));

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 8000);
  }

  function dismiss(id: string, title: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    sessionStorage.setItem(`dismissed-${title}-${new Date().toDateString()}`, '1');
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            layout
            className="card-glass rounded-xl px-4 py-3 border border-lunar-gold/30 pointer-events-auto shadow-lg"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">{n.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <Bell className="w-3 h-3 text-lunar-gold" />
                  <p className="font-semibold text-sm text-lunar-gold truncate">{n.title}</p>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{n.body}</p>
              </div>
              <button
                onClick={() => dismiss(n.id, n.title)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 -mr-1 -mt-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default InAppNotification;
