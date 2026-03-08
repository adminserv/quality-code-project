import { Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import StarField from '@/components/StarField';

const NotFound = () => (
  <div className="min-h-screen relative flex items-center justify-center">
    <StarField />
    <div className="relative z-10 text-center px-4">
      <span className="text-7xl mb-4 block">🌑</span>
      <h1 className="text-4xl font-bold font-display text-glow mb-2">404</h1>
      <p className="text-muted-foreground mb-6">
        Esta página está en el lado oscuro de la Luna.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
      >
        <Moon className="w-4 h-4" />
        Volver al inicio
      </Link>
    </div>
  </div>
);

export default NotFound;
