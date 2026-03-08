import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Lock, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import StarField from '@/components/StarField';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setIsRecovery(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    }
    setLoading(false);
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <StarField />
        <div className="relative z-10 text-center px-4">
          <Moon className="w-10 h-10 text-primary mx-auto mb-3" />
          <h1 className="text-xl font-bold font-display text-glow mb-2">Enlace inválido</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Este enlace de recuperación no es válido o ha expirado.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm"
          >
            Ir al login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <StarField />
      <div className="relative z-10 w-full max-w-sm px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass rounded-3xl p-8"
        >
          {success ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-500/15 flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-green-400" />
              </div>
              <h1 className="text-xl font-bold font-display text-glow mb-2">¡Contraseña actualizada!</h1>
              <p className="text-sm text-muted-foreground">Redirigiendo al inicio...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <Lock className="w-10 h-10 text-primary mx-auto mb-3" />
                <h1 className="text-2xl font-bold font-display text-glow">Nueva Contraseña</h1>
                <p className="text-sm text-muted-foreground mt-1">Elige tu nueva contraseña</p>
              </div>

              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-1.5">Nueva contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-muted/30 border border-border/30 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                    placeholder="••••••"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-1.5">Confirmar contraseña</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-muted/30 border border-border/30 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                    placeholder="••••••"
                  />
                </div>

                {error && (
                  <p className="text-xs text-destructive bg-destructive/10 rounded-lg p-2">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Actualizando...' : 'Cambiar contraseña'}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
