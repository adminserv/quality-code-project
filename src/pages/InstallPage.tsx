import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Moon, Check, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import StarField from '@/components/StarField';

const InstallPage = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua));

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => setInstalled(true));

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') setInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen relative">
      <StarField />
      <div className="relative z-10 max-w-lg mx-auto px-4 py-12 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-primary/15 flex items-center justify-center mx-auto mb-6">
            {installed ? (
              <Check className="w-10 h-10 text-green-400" />
            ) : (
              <Smartphone className="w-10 h-10 text-primary" />
            )}
          </div>

          <h1 className="text-3xl font-bold font-display text-glow mb-3">
            {installed ? '¡App Instalada!' : 'Instala Luna Viva'}
          </h1>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            {installed
              ? 'Luna Viva está en tu pantalla de inicio. Ábrela como una app nativa.'
              : 'Accede más rápido y sin conexión. Añade Luna Viva a tu pantalla de inicio.'}
          </p>

          {!installed && (
            <>
              {deferredPrompt ? (
                <button
                  onClick={handleInstall}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity mb-8"
                >
                  <Download className="w-5 h-5" />
                  Instalar App
                </button>
              ) : isIOS ? (
                <div className="card-glass rounded-2xl p-6 text-left mb-8">
                  <h3 className="font-display font-bold text-foreground mb-3">En iPhone / iPad:</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">1.</span>
                      Toca el botón <strong className="text-foreground">Compartir</strong> (cuadrado con flecha)
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">2.</span>
                      Desplázate y selecciona <strong className="text-foreground">"Añadir a pantalla de inicio"</strong>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">3.</span>
                      Toca <strong className="text-foreground">"Añadir"</strong>
                    </li>
                  </ol>
                </div>
              ) : (
                <div className="card-glass rounded-2xl p-6 text-left mb-8">
                  <h3 className="font-display font-bold text-foreground mb-3">En Android:</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">1.</span>
                      Abre el menú del navegador (tres puntos)
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">2.</span>
                      Selecciona <strong className="text-foreground">"Instalar app"</strong> o <strong className="text-foreground">"Añadir a pantalla de inicio"</strong>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">3.</span>
                      Confirma la instalación
                    </li>
                  </ol>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { emoji: '⚡', text: 'Acceso instantáneo' },
                  { emoji: '📴', text: 'Funciona offline' },
                  { emoji: '🔔', text: 'Notificaciones' },
                ].map(item => (
                  <div key={item.text} className="card-glass rounded-xl p-3 text-center">
                    <span className="text-2xl block mb-1">{item.emoji}</span>
                    <p className="text-[11px] text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Moon className="w-4 h-4 inline mr-1" />
            Volver al inicio
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default InstallPage;
