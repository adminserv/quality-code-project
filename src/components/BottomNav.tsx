import { Moon, Leaf, Heart, BookOpen, Pencil, Bell } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const tabs = [
  { to: '/', icon: Moon, label: 'Luna', exact: true },
  { to: '/jardineria', icon: Leaf, label: 'Jardín' },
  { to: '/bienestar', icon: Heart, label: 'Bienestar' },
  { to: '/diario', icon: Pencil, label: 'Diario' },
  { to: '/notificaciones', icon: Bell, label: 'Alertas' },
];

const BottomNav = () => (
  <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border/60 bg-background/80 backdrop-blur-xl safe-area-bottom">
    <div className="flex items-center justify-around max-w-lg mx-auto h-16">
      {tabs.map(({ to, icon: Icon, label, exact }) => (
        <NavLink
          key={to}
          to={to}
          end={exact}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors min-w-[50px]',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )
          }
        >
          <Icon className="w-5 h-5" />
          <span className="text-[10px] font-medium">{label}</span>
        </NavLink>
      ))}
    </div>
  </nav>
);

export default BottomNav;
