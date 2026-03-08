import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Moon, Sun, Eclipse, Sparkles, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  isPushSupported,
  getNotificationPermission,
  requestNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
  getVapidPublicKey,
} from '@/lib/pushNotifications';
import { toast } from 'sonner';

interface NotificationPrefs {
  full_moon: boolean;
  new_moon: boolean;
  quarters: boolean;
  eclipses: boolean;
  supermoons: boolean;
}

const defaultPrefs: NotificationPrefs = {
  full_moon: true,
  new_moon: true,
  quarters: false,
  eclipses: true,
  supermoons: true,
};

const NotificationSettings = () => {
  const { user } = useAuth();
  const [pushSupported, setPushSupported] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [prefs, setPrefs] = useState<NotificationPrefs>(defaultPrefs);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    checkPushSupport();
    if (user) loadPreferences();
  }, [user]);

  async function checkPushSupport() {
    const supported = await isPushSupported();
    setPushSupported(supported);
    if (supported) {
      const perm = await getNotificationPermission();
      setPermission(perm);
      if (perm === 'granted' && user) {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        setPushEnabled(!!sub);
      }
    }
  }

  async function loadPreferences() {
    if (!user) return;
    const { data } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setPrefs({
        full_moon: data.full_moon,
        new_moon: data.new_moon,
        quarters: data.quarters,
        eclipses: data.eclipses,
        supermoons: data.supermoons,
      });
    }
    setLoading(false);
  }

  async function savePreference(key: keyof NotificationPrefs, value: boolean) {
    if (!user) return;
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs);

    const { error } = await supabase
      .from('notification_preferences')
      .upsert({ user_id: user.id, ...newPrefs }, { onConflict: 'user_id' });

    if (error) {
      toast.error('Error al guardar preferencias');
      setPrefs(prefs); // revert
    }
  }

  async function handleEnablePush() {
    if (!user) {
      toast.error('Inicia sesión para activar notificaciones');
      return;
    }

    setSubscribing(true);
    try {
      const perm = await requestNotificationPermission();
      setPermission(perm);

      if (perm !== 'granted') {
        toast.error('Permiso de notificaciones denegado');
        return;
      }

      const vapidKey = await getVapidPublicKey();
      if (!vapidKey) {
        toast.error('Error al obtener clave de notificaciones');
        return;
      }

      const success = await subscribeToPush(vapidKey, user.id);
      if (success) {
        setPushEnabled(true);
        // Also create default preferences
        await supabase
          .from('notification_preferences')
          .upsert({ user_id: user.id, ...prefs }, { onConflict: 'user_id' });
        toast.success('¡Notificaciones activadas!');
      } else {
        toast.error('Error al activar notificaciones');
      }
    } finally {
      setSubscribing(false);
    }
  }

  async function handleDisablePush() {
    if (!user) return;
    setSubscribing(true);
    try {
      await unsubscribeFromPush(user.id);
      setPushEnabled(false);
      toast.success('Notificaciones desactivadas');
    } finally {
      setSubscribing(false);
    }
  }

  if (!user) {
    return (
      <div className="card-glass rounded-2xl p-6 text-center">
        <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground text-sm">
          Inicia sesión para configurar notificaciones lunares
        </p>
      </div>
    );
  }

  const notificationOptions = [
    { key: 'full_moon' as const, label: 'Luna Llena', icon: '🌕', desc: 'Aviso cada luna llena' },
    { key: 'new_moon' as const, label: 'Luna Nueva', icon: '🌑', desc: 'Aviso cada luna nueva' },
    { key: 'quarters' as const, label: 'Cuartos', icon: '🌓', desc: 'Cuarto creciente y menguante' },
    { key: 'eclipses' as const, label: 'Eclipses', icon: '🌒', desc: 'Eclipses lunares y solares' },
    { key: 'supermoons' as const, label: 'Superlunas', icon: '✨', desc: 'Superlunas, lunas de sangre y azules' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glass rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-5 h-5 text-lunar-gold" />
        <h3 className="text-lg font-bold font-display">Notificaciones Lunares</h3>
      </div>

      {/* Push toggle */}
      <div className="mb-6">
        {!pushSupported ? (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/50">
            <BellOff className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Tu navegador no soporta notificaciones push
            </p>
          </div>
        ) : permission === 'denied' ? (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
            <BellOff className="w-5 h-5 text-destructive" />
            <p className="text-sm text-destructive">
              Notificaciones bloqueadas. Habilítalas en la configuración del navegador.
            </p>
          </div>
        ) : (
          <Button
            onClick={pushEnabled ? handleDisablePush : handleEnablePush}
            disabled={subscribing}
            variant={pushEnabled ? 'outline' : 'default'}
            className="w-full"
          >
            {subscribing ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : pushEnabled ? (
              <BellOff className="w-4 h-4 mr-2" />
            ) : (
              <Bell className="w-4 h-4 mr-2" />
            )}
            {subscribing
              ? 'Configurando...'
              : pushEnabled
                ? 'Desactivar notificaciones push'
                : 'Activar notificaciones push'}
          </Button>
        )}
      </div>

      {/* Event preferences */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          Eventos a notificar
        </p>
        {notificationOptions.map(({ key, label, icon, desc }) => (
          <div
            key={key}
            className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40 hover:border-primary/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{icon}</span>
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
            <Switch
              checked={prefs[key]}
              onCheckedChange={(checked) => savePreference(key, checked)}
              disabled={loading}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default NotificationSettings;
