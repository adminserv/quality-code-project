import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Mail, Lock, ArrowLeft, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import StarField from '@/components/StarField';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setSuccess('¡Cuenta creada! Revisa tu email para confirmar.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <StarField />
      <div className="relative z-10 w-full max-w-sm px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass rounded-3xl p-8"
        >
          <div className="text-center mb-6">
            <Moon className="w-10 h-10 text-primary mx-auto mb-3" />
            <h1 className="text-2xl font-bold font-display text-glow">
              {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isSignUp ? 'Únete a Luna Viva' : 'Bienvenido de vuelta'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-muted/30 border border-border/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-muted/30 border border-border/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                  placeholder="••••••"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-destructive bg-destructive/10 rounded-lg p-2">{error}</p>
            )}
            {success && (
              <p className="text-xs text-green-400 bg-green-500/10 rounded-lg p-2">{success}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Cargando...' : isSignUp ? 'Crear cuenta' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess(''); }}
              className="text-primary font-medium hover:underline"
            >
              {isSignUp ? 'Inicia sesión' : 'Regístrate'}
            </button>
          </p>

          <div className="mt-4 text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-3 h-3 inline mr-1" />
              Volver
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
