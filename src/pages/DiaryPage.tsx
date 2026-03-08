import { motion } from 'framer-motion';
import { useMoonPhase } from '@/hooks/useMoonPhase';
import StarField from '@/components/StarField';
import LunarDiary from '@/components/LunarDiary';

const DiaryPage = () => {
  return (
    <div className="min-h-screen relative">
      <StarField />
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6 pb-24">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold font-display text-glow text-center mb-6"
        >
          📓 Diario Lunar
        </motion.h1>
        <LunarDiary />
      </div>
    </div>
  );
};

export default DiaryPage;
