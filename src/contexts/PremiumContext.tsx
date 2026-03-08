import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface PremiumContextType {
  isPremium: boolean;
  togglePremium: () => void;
}

const PremiumContext = createContext<PremiumContextType>({
  isPremium: false,
  togglePremium: () => {},
});

export const usePremium = () => useContext(PremiumContext);

export const PremiumProvider = ({ children }: { children: ReactNode }) => {
  const [isPremium, setIsPremium] = useState(() => {
    try {
      return localStorage.getItem('luna-viva-premium') === 'true';
    } catch {
      return false;
    }
  });

  const togglePremium = useCallback(() => {
    setIsPremium(prev => {
      const next = !prev;
      try { localStorage.setItem('luna-viva-premium', String(next)); } catch {}
      return next;
    });
  }, []);

  return (
    <PremiumContext.Provider value={{ isPremium, togglePremium }}>
      {children}
    </PremiumContext.Provider>
  );
};
