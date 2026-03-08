import { Share2 } from 'lucide-react';
import type { MoonData } from '@/hooks/useMoonPhase';

interface Props {
  moonData: MoonData;
}

const ShareButton = ({ moonData }: Props) => {
  const handleShare = async () => {
    const text = `${moonData.phaseEmoji} ${moonData.phaseName} — Iluminación: ${moonData.illumination.toFixed(1)}%\n🌙 Luna en ${moonData.zodiacSign} ${moonData.zodiacEmoji}\n\nDescubierto con Luna Viva`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Luna Viva — Fase Lunar',
          text,
          url: window.location.origin,
        });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(text);
        // Could use toast here
      } catch {}
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-xl hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
      aria-label="Compartir fase lunar"
    >
      <Share2 className="w-5 h-5" />
    </button>
  );
};

export default ShareButton;
