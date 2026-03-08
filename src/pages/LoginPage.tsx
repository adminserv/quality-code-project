import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import StarField from '@/components/StarField';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
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

    if (isForgot) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) setError(error.message);
      else setSuccess('¡Email enviado! Revisa tu bandeja para restablecer tu contraseña.');
      setLoading(false);
      return;
    }

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) setError(error.message);
      else setSuccess('¡Cuenta creada! Revisa tu email para confirmar.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else navigate('/');
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    const { error } = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: window.location.origin,
    });
    if (error) setError(error.message || 'Error al iniciar sesión con Google');
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
              {isForgot ? 'Recuperar Contraseña' : isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isForgot ? 'Te enviaremos un link de recuperación' : isSignUp ? 'Únete a Luna Viva' : 'Bienvenido de vuelta'}
            </p>
          </div>

          {/* Google sign in */}
          {!isForgot && (
            <>
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-border/50 bg-muted/20 text-foreground text-sm font-medium hover:bg-muted/40 transition-colors mb-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar con Google
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-border/50" />
                <span className="text-xs text-muted-foreground">o</span>
                <div className="flex-1 h-px bg-border/50" />
              </div>
            </>
          )}

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

            {!isForgot && (
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
            )}

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
              {loading ? 'Cargando...' : isForgot ? 'Enviar enlace' : isSignUp ? 'Crear cuenta' : 'Entrar'}
            </button>
          </form>

          {!isForgot && (
            <button
              onClick={() => { setIsForgot(true); setError(''); setSuccess(''); }}
              className="text-xs text-primary hover:underline mt-3 block text-center w-full"
            >
              ¿Olvidaste tu contraseña?
            </button>
          )}

          <p className="text-center text-xs text-muted-foreground mt-3">
            {isForgot ? (
              <button onClick={() => { setIsForgot(false); setError(''); setSuccess(''); }} className="text-primary font-medium hover:underline">
                ← Volver al login
              </button>
            ) : (
              <>
                {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
                <button
                  onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess(''); }}
                  className="text-primary font-medium hover:underline"
                >
                  {isSignUp ? 'Inicia sesión' : 'Regístrate'}
                </button>
              </>
            )}
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
