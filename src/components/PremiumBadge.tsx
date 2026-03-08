import { Crown, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePremium } from '@/contexts/PremiumContext';

interface PremiumBadgeProps {
  children: React.ReactNode;
  feature?: string;
}

export const PremiumBadge = () => {
  const { isPremium } = usePremium();
  if (isPremium) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-lunar-gold/15 text-lunar-gold text-[10px] font-bold uppercase tracking-wider">
      <Crown className="w-3 h-3" />
      Pro
    </span>
  );
};

export const PremiumGate = ({ children, feature = 'esta función' }: PremiumBadgeProps) => {
  const { isPremium } = usePremium();
  if (isPremium) return <>{children}</>;

  return (
    <div className="relative">
      <div className="pointer-events-none select-none opacity-40 blur-[2px]">
        {children}
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm rounded-3xl"
      >
        <div className="card-glass rounded-2xl p-6 text-center max-w-xs">
          <Lock className="w-8 h-8 text-lunar-gold mx-auto mb-3" />
          <h3 className="font-display font-bold text-foreground mb-1">Desbloquea {feature}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Accede a todas las guías y funciones avanzadas con Luna Viva Pro.
          </p>
          <Link
            to="/premium"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lunar-gold text-background font-bold text-sm hover:opacity-90 transition-opacity"
          >
            <Crown className="w-4 h-4" />
            Ver planes
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PremiumBadge;
