import { motion } from 'framer-motion';
import { User, LogOut, Mail, Calendar, Shield, Moon, ChevronRight, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePremium } from '@/contexts/PremiumContext';
import StarField from '@/components/StarField';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useState } from 'react';

const ProfilePage = () => {
  const { user, loading, signOut } = useAuth();
  const { isPremium } = usePremium();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast.success('Sesión cerrada');
  };

  const handleDeleteData = async () => {
    if (!user) return;
    if (!confirm('¿Estás seguro? Se eliminarán todas tus entradas del diario y preferencias. Esta acción no se puede deshacer.')) return;

    setDeleting(true);
    try {
      await Promise.all([
        supabase.from('lunar_diary').delete().eq('user_id', user.id),
        supabase.from('notification_preferences').delete().eq('user_id', user.id),
        supabase.from('push_subscriptions').delete().eq('user_id', user.id),
      ]);
      toast.success('Datos eliminados correctamente');
    } catch {
      toast.error('Error al eliminar datos');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <StarField />
        <Moon className="w-8 h-8 text-primary animate-pulse relative z-10" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen relative">
        <StarField />
        <div className="relative z-10 max-w-md mx-auto px-4 py-12 pb-24 text-center">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold font-display mb-2">Mi Perfil</h1>
          <p className="text-muted-foreground text-sm mb-6">Inicia sesión para ver tu perfil</p>
          <Link
            to="/login"
            className="inline-block px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  const createdAt = new Date(user.created_at);
  const menuItems = [
    { icon: Moon, label: 'Diario Lunar', desc: 'Tus entradas y estadísticas', to: '/diario' },
    { icon: Shield, label: 'Luna Viva Pro', desc: isPremium ? 'Plan activo' : 'Desbloquea todo', to: '/premium' },
  ];

  return (
    <div className="min-h-screen relative">
      <StarField />
      <div className="relative z-10 max-w-md mx-auto px-4 py-8 pb-24">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold font-display text-glow text-center mb-8"
        >
          👤 Mi Perfil
        </motion.h1>

        {/* Avatar & info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass rounded-3xl p-6 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-foreground truncate">
                {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario'}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <Mail className="w-3 h-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Desde {createdAt.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {isPremium && (
            <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-lunar-gold/10 border border-lunar-gold/30">
              <span className="text-sm">⭐</span>
              <span className="text-xs font-bold text-lunar-gold">Luna Viva Pro activo</span>
            </div>
          )}
        </motion.div>

        {/* Menu links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-glass rounded-3xl p-2 mb-6"
        >
          {menuItems.map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full justify-start gap-3"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Button>

          <Button
            onClick={handleDeleteData}
            variant="ghost"
            disabled={deleting}
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? 'Eliminando...' : 'Eliminar mis datos'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
