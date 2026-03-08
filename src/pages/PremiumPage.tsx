import { motion } from 'framer-motion';
import { Crown, Check, Sparkles, Leaf, Heart, Fish, Camera, Bell, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  { icon: Leaf, text: 'Guía completa de jardinería lunar' },
  { icon: Heart, text: 'Rituales y bienestar por fase' },
  { icon: Fish, text: 'Tabla solunar para pesca y caza' },
  { icon: Camera, text: 'Guía de fotografía nocturna' },
  { icon: Bell, text: 'Notificaciones de eventos lunares' },
  { icon: Star, text: 'Sin publicidad' },
];

const plans = [
  {
    name: 'Mensual',
    price: '2.99',
    period: '/mes',
    popular: false,
  },
  {
    name: 'Anual',
    price: '19.99',
    period: '/año',
    popular: true,
    save: 'Ahorra 44%',
  },
];

const PremiumPage = () => (
  <div className="max-w-lg mx-auto px-4 py-8 pb-24">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <div className="w-16 h-16 rounded-3xl bg-lunar-gold/15 flex items-center justify-center mx-auto mb-4">
        <Crown className="w-8 h-8 text-lunar-gold" />
      </div>
      <h1 className="text-3xl font-bold font-display text-glow mb-2">Luna Viva Pro</h1>
      <p className="text-muted-foreground">
        Desbloquea todo el potencial de tu compañero lunar
      </p>
    </motion.div>

    {/* Features */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card-glass rounded-3xl p-6 mb-6"
    >
      <h2 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-lunar-gold" />
        Todo incluido
      </h2>
      <ul className="space-y-3">
        {features.map((feature) => (
          <li key={feature.text} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-sm text-foreground/80">{feature.text}</span>
          </li>
        ))}
      </ul>
    </motion.div>

    {/* Plans */}
    <div className="grid grid-cols-2 gap-3 mb-6">
      {plans.map((plan, i) => (
        <motion.button
          key={plan.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}
          className={`relative rounded-2xl p-5 text-center transition-all border ${
            plan.popular
              ? 'border-lunar-gold/50 bg-lunar-gold/10'
              : 'border-border/50 bg-muted/20 hover:border-border'
          }`}
        >
          {plan.popular && (
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-lunar-gold text-background text-[10px] font-bold uppercase">
              Popular
            </span>
          )}
          <p className="text-sm text-muted-foreground mb-1">{plan.name}</p>
          <p className="font-display text-2xl font-bold text-foreground">
            €{plan.price}
            <span className="text-sm text-muted-foreground font-normal">{plan.period}</span>
          </p>
          {plan.save && (
            <p className="text-[11px] text-lunar-gold font-semibold mt-1">{plan.save}</p>
          )}
        </motion.button>
      ))}
    </div>

    {/* CTA */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <button className="w-full py-3.5 rounded-2xl bg-lunar-gold text-background font-bold text-base hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
        <Crown className="w-5 h-5" />
        Comenzar Prueba Gratuita
      </button>
      <p className="text-center text-[11px] text-muted-foreground mt-3">
        7 días gratis · Cancela cuando quieras
      </p>
    </motion.div>

    <div className="mt-8 text-center">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Volver al inicio
      </Link>
    </div>
  </div>
);

export default PremiumPage;
