import { motion } from 'framer-motion';
import type { MoonData } from '@/hooks/useMoonPhase';

interface Props {
  moonData: MoonData;
}

const MoonVisualization = ({ moonData }: Props) => {
  const illuminationFraction = moonData.illumination / 100;
  const phase = moonData.phase / 100; // 0-1

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="card-glass rounded-3xl p-8 flex flex-col items-center"
    >
      {/* Moon */}
      <div className="relative mb-8 animate-float">
        {/* Outer atmospheric glow */}
        <div
          className="absolute -inset-12 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, hsl(45 30% 90% / 0.06) 30%, hsl(220 60% 75% / 0.04) 50%, transparent 70%)`,
          }}
        />
        {/* Secondary glow ring */}
        <div
          className="absolute -inset-6 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, hsl(40 15% 85% / 0.12) 40%, transparent 70%)`,
          }}
        />

        <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full overflow-hidden relative" style={{ isolation: 'isolate' }}>
          {/* SVG realistic moon surface */}
          <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Base surface gradient - realistic lunar grey */}
              <radialGradient id="moonBase" cx="45%" cy="40%" r="55%">
                <stop offset="0%" stopColor="#d4cfc5" />
                <stop offset="30%" stopColor="#c2bdb3" />
                <stop offset="60%" stopColor="#a8a298" />
                <stop offset="85%" stopColor="#8e887e" />
                <stop offset="100%" stopColor="#6b665e" />
              </radialGradient>

              {/* Light side highlight */}
              <radialGradient id="highlight" cx="38%" cy="35%" r="40%">
                <stop offset="0%" stopColor="#e8e4da" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#d4cfc5" stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>

              {/* Terminator (day/night boundary) gradient */}
              <radialGradient id="terminatorGlow" cx="50%" cy="50%" r="50%">
                <stop offset="80%" stopColor="transparent" stopOpacity="0" />
                <stop offset="95%" stopColor="#2a2520" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#1a1815" stopOpacity="0.5" />
              </radialGradient>

              {/* Maria (dark seas) */}
              <radialGradient id="mare1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7a7568" stopOpacity="0.6" />
                <stop offset="70%" stopColor="#8a8578" stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>

              {/* Crater shadow */}
              <radialGradient id="craterShadow" cx="40%" cy="35%" r="50%">
                <stop offset="0%" stopColor="#5a5550" stopOpacity="0.7" />
                <stop offset="60%" stopColor="#6e6960" stopOpacity="0.4" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>

              {/* Crater rim highlight */}
              <radialGradient id="craterRim" cx="60%" cy="65%" r="50%">
                <stop offset="0%" stopColor="transparent" stopOpacity="0" />
                <stop offset="70%" stopColor="#c8c3b8" stopOpacity="0.3" />
                <stop offset="90%" stopColor="#d8d3c8" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ccc7bc" stopOpacity="0.2" />
              </radialGradient>

              {/* Noise texture filter */}
              <filter id="moonNoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" seed="2" stitchTiles="stitch" result="noise" />
                <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
                <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="noisy" />
                <feComposite in="noisy" in2="SourceGraphic" operator="in" />
              </filter>

              {/* Subtle inner shadow */}
              <filter id="innerShadow">
                <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur" />
                <feOffset dx="0" dy="0" result="offsetBlur" />
                <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="inverseShadow" />
                <feFlood floodColor="#1a1815" floodOpacity="0.4" result="color" />
                <feComposite in="color" in2="inverseShadow" operator="in" result="shadow" />
                <feComposite in="SourceGraphic" in2="shadow" operator="over" />
              </filter>

              <clipPath id="moonClip">
                <circle cx="200" cy="200" r="198" />
              </clipPath>
            </defs>

            <g clipPath="url(#moonClip)">
              {/* Base surface */}
              <circle cx="200" cy="200" r="200" fill="url(#moonBase)" />

              {/* Texture noise overlay */}
              <circle cx="200" cy="200" r="200" fill="url(#moonBase)" filter="url(#moonNoise)" opacity="0.5" />

              {/* Highlight */}
              <circle cx="200" cy="200" r="200" fill="url(#highlight)" />

              {/* Mare Imbrium - large dark basin upper left */}
              <ellipse cx="155" cy="140" rx="65" ry="55" fill="#847f72" opacity="0.45" />

              {/* Mare Serenitatis */}
              <ellipse cx="240" cy="150" rx="40" ry="35" fill="#7e7968" opacity="0.4" />

              {/* Mare Tranquillitatis */}
              <ellipse cx="260" cy="210" rx="50" ry="40" fill="#807b6e" opacity="0.35" />

              {/* Mare Crisium - isolated dark spot */}
              <ellipse cx="310" cy="160" rx="25" ry="20" fill="#767168" opacity="0.45" />

              {/* Oceanus Procellarum - large western mare */}
              <ellipse cx="120" cy="220" rx="55" ry="70" fill="#858072" opacity="0.3" />

              {/* Mare Nubium */}
              <ellipse cx="180" cy="290" rx="40" ry="30" fill="#7a7568" opacity="0.3" />

              {/* Major Craters */}
              {/* Tycho - prominent southern crater with rays */}
              <circle cx="195" cy="330" r="14" fill="url(#craterShadow)" />
              <circle cx="195" cy="330" r="14" fill="url(#craterRim)" />
              <circle cx="195" cy="330" r="6" fill="#9a9588" opacity="0.5" />
              {/* Tycho rays */}
              <line x1="195" y1="330" x2="140" y2="250" stroke="#b5b0a5" strokeWidth="1" opacity="0.15" />
              <line x1="195" y1="330" x2="250" y2="240" stroke="#b5b0a5" strokeWidth="1" opacity="0.12" />
              <line x1="195" y1="330" x2="180" y2="400" stroke="#b5b0a5" strokeWidth="1" opacity="0.1" />
              <line x1="195" y1="330" x2="280" y2="360" stroke="#b5b0a5" strokeWidth="0.8" opacity="0.1" />

              {/* Copernicus */}
              <circle cx="160" cy="200" r="16" fill="url(#craterShadow)" />
              <circle cx="160" cy="200" r="16" fill="url(#craterRim)" />
              <circle cx="160" cy="200" r="7" fill="#908b80" opacity="0.4" />

              {/* Kepler */}
              <circle cx="108" cy="195" r="9" fill="url(#craterShadow)" />
              <circle cx="108" cy="195" r="9" fill="url(#craterRim)" />

              {/* Aristarchus - brightest crater */}
              <circle cx="90" cy="165" r="8" fill="#c8c3b5" opacity="0.6" />
              <circle cx="90" cy="165" r="8" fill="url(#craterRim)" />

              {/* Plato */}
              <ellipse cx="170" cy="105" rx="14" ry="8" fill="#6e6960" opacity="0.5" />

              {/* Grimaldi */}
              <ellipse cx="62" cy="210" rx="12" ry="15" fill="#6a655e" opacity="0.45" />

              {/* Smaller craters scattered */}
              <circle cx="270" cy="120" r="6" fill="url(#craterShadow)" opacity="0.5" />
              <circle cx="300" cy="250" r="8" fill="url(#craterShadow)" opacity="0.4" />
              <circle cx="130" cy="300" r="7" fill="url(#craterShadow)" opacity="0.4" />
              <circle cx="240" cy="310" r="5" fill="url(#craterShadow)" opacity="0.45" />
              <circle cx="320" cy="200" r="6" fill="url(#craterShadow)" opacity="0.35" />
              <circle cx="100" cy="130" r="5" fill="url(#craterShadow)" opacity="0.4" />
              <circle cx="220" cy="80" r="4" fill="url(#craterShadow)" opacity="0.35" />
              <circle cx="290" cy="300" r="7" fill="url(#craterShadow)" opacity="0.3" />
              <circle cx="150" cy="350" r="5" fill="url(#craterShadow)" opacity="0.35" />
              <circle cx="80" cy="270" r="6" fill="url(#craterShadow)" opacity="0.3" />

              {/* Tiny detail craters */}
              <circle cx="180" cy="170" r="3" fill="#7a7568" opacity="0.3" />
              <circle cx="225" cy="185" r="2.5" fill="#7a7568" opacity="0.25" />
              <circle cx="145" cy="245" r="3" fill="#7a7568" opacity="0.3" />
              <circle cx="200" cy="260" r="2" fill="#7a7568" opacity="0.25" />
              <circle cx="310" cy="130" r="2" fill="#7a7568" opacity="0.3" />
              <circle cx="250" cy="270" r="3" fill="#7a7568" opacity="0.25" />

              {/* Highlands texture - brighter regions */}
              <ellipse cx="330" cy="280" rx="30" ry="45" fill="#b8b3a8" opacity="0.15" />
              <ellipse cx="80" cy="100" rx="25" ry="30" fill="#b8b3a8" opacity="0.12" />
              <ellipse cx="200" cy="60" rx="40" ry="20" fill="#b5b0a5" opacity="0.1" />

              {/* Edge darkening / limb darkening */}
              <circle cx="200" cy="200" r="200" fill="url(#terminatorGlow)" />

              {/* Inner shadow for 3D depth */}
              <circle cx="200" cy="200" r="198" fill="none" stroke="#1a1815" strokeWidth="4" opacity="0.15" />
            </g>
          </svg>

          {/* Phase shadow overlay */}
          <div
            className="absolute inset-0 transition-all duration-1000 ease-out"
            style={{
              background:
                phase <= 0.5
                  ? `linear-gradient(to right, hsl(230 35% 5% / 0.97) ${(1 - illuminationFraction) * 100}%, hsl(230 35% 5% / 0.6) ${(1 - illuminationFraction) * 100 + 8}%, transparent ${(1 - illuminationFraction) * 100 + 20}%)`
                  : `linear-gradient(to left, hsl(230 35% 5% / 0.97) ${(1 - illuminationFraction) * 100}%, hsl(230 35% 5% / 0.6) ${(1 - illuminationFraction) * 100 + 8}%, transparent ${(1 - illuminationFraction) * 100 + 20}%)`,
              borderRadius: '9999px',
            }}
          />

          {/* Subtle warm light on illuminated edge */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: phase <= 0.5
                ? `linear-gradient(to left, hsl(40 20% 90% / 0.08) 0%, transparent 40%)`
                : `linear-gradient(to right, hsl(40 20% 90% / 0.08) 0%, transparent 40%)`,
              borderRadius: '9999px',
            }}
          />
        </div>

        {/* Ambient glow */}
        <div
          className="absolute -inset-4 rounded-full pointer-events-none"
          style={{
            boxShadow: `0 0 ${40 + illuminationFraction * 60}px hsl(40 15% 85% / ${0.08 + illuminationFraction * 0.15}), 0 0 ${80 + illuminationFraction * 100}px hsl(220 50% 75% / ${0.04 + illuminationFraction * 0.08})`,
          }}
        />
      </div>

      {/* Phase info */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <span className="text-6xl mb-3 block">{moonData.phaseEmoji}</span>
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-glow text-foreground mb-2">
          {moonData.phaseName}
        </h2>
        <p className="text-muted-foreground max-w-xs leading-relaxed">
          {moonData.phaseDescription}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default MoonVisualization;
