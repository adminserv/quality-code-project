import { useState } from 'react';
import { motion } from 'framer-motion';
import StarField from '@/components/StarField';
import LunarDiary from '@/components/LunarDiary';
import DiaryStats from '@/components/DiaryStats';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'diary', label: '📝 Diario' },
  { id: 'stats', label: '📊 Tendencias' },
];

const DiaryPage = () => {
  const [activeTab, setActiveTab] = useState('diary');

  return (
    <div className="min-h-screen relative">
      <StarField />
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6 pb-24">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold font-display text-glow text-center mb-4"
        >
          📓 Diario Lunar
        </motion.h1>

        <div className="flex gap-2 mb-6 justify-center">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'bg-muted/30 text-muted-foreground hover:text-foreground border border-transparent'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'diary' ? <LunarDiary /> : <DiaryStats />}
      </div>
    </div>
  );
};

export default DiaryPage;
