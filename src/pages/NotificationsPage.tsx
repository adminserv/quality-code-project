import { Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import StarField from '@/components/StarField';
import NotificationSettings from '@/components/NotificationSettings';

const NotificationsPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarField />
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 sm:py-12 pb-24">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Moon className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold font-display text-glow">Luna Viva</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold font-display mb-2">
            Notificaciones
          </h1>
          <p className="text-muted-foreground text-sm">
            Configura alertas para eventos lunares importantes
          </p>
        </motion.header>

        <NotificationSettings />
      </div>
    </div>
  );
};

export default NotificationsPage;
