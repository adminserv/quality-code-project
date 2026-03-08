import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DiaryEntry {
  entry_date: string;
  mood: number;
  energy: number;
  sleep_quality: number | null;
  moon_phase: string | null;
  moon_illumination: number | null;
}

const DiaryStats = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from('lunar_diary')
        .select('entry_date, mood, energy, sleep_quality, moon_phase, moon_illumination')
        .order('entry_date', { ascending: true })
        .limit(90);
      if (data) setEntries(data);
    };
    fetch();
  }, [user]);

  const chartData = useMemo(() =>
    entries.map(e => ({
      date: new Date(e.entry_date + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
      Ánimo: e.mood,
      Energía: e.energy,
      Sueño: e.sleep_quality || 0,
      Iluminación: Math.round((e.moon_illumination || 0) / 20), // scale to 1-5
    })),
  [entries]);

  const averages = useMemo(() => {
    if (entries.length === 0) return null;
    const sum = entries.reduce(
      (acc, e) => ({
        mood: acc.mood + e.mood,
        energy: acc.energy + e.energy,
        sleep: acc.sleep + (e.sleep_quality || 0),
        sleepCount: acc.sleepCount + (e.sleep_quality ? 1 : 0),
      }),
      { mood: 0, energy: 0, sleep: 0, sleepCount: 0 }
    );
    return {
      mood: (sum.mood / entries.length).toFixed(1),
      energy: (sum.energy / entries.length).toFixed(1),
      sleep: sum.sleepCount > 0 ? (sum.sleep / sum.sleepCount).toFixed(1) : '-',
      total: entries.length,
    };
  }, [entries]);

  // Phase breakdown
  const phaseStats = useMemo(() => {
    const map: Record<string, { mood: number; energy: number; count: number }> = {};
    entries.forEach(e => {
      const phase = e.moon_phase || 'Desconocida';
      if (!map[phase]) map[phase] = { mood: 0, energy: 0, count: 0 };
      map[phase].mood += e.mood;
      map[phase].energy += e.energy;
      map[phase].count += 1;
    });
    return Object.entries(map).map(([phase, data]) => ({
      phase,
      avgMood: (data.mood / data.count).toFixed(1),
      avgEnergy: (data.energy / data.count).toFixed(1),
      count: data.count,
    })).sort((a, b) => parseFloat(b.avgMood) - parseFloat(a.avgMood));
  }, [entries]);

  if (!user || entries.length === 0) {
    return (
      <div className="card-glass rounded-3xl p-6 text-center">
        <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          {!user ? 'Inicia sesión para ver tus estadísticas.' : 'Registra al menos una entrada en tu diario para ver tendencias.'}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Averages */}
      <div className="card-glass rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-display font-bold text-foreground">Promedios ({averages?.total} entradas)</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Ánimo', value: averages?.mood, color: 'text-lunar-gold' },
            { label: 'Energía', value: averages?.energy, color: 'text-primary' },
            { label: 'Sueño', value: averages?.sleep, color: 'text-cosmic-cyan' },
          ].map(stat => (
            <div key={stat.label} className="bg-muted/30 rounded-xl p-3 text-center border border-border/30">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</p>
              <p className={`font-display font-bold text-xl mt-1 ${stat.color}`}>{stat.value}/5</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      {chartData.length >= 3 && (
        <div className="card-glass rounded-3xl p-6">
          <h3 className="font-display font-bold text-foreground mb-4">Tendencias</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(230 25% 18%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(220 15% 55%)' }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 10, fill: 'hsl(220 15% 55%)' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(230 30% 10%)',
                    border: '1px solid hsl(230 25% 18%)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="Ánimo" stroke="hsl(45 90% 65%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Energía" stroke="hsl(220 70% 65%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Sueño" stroke="hsl(185 70% 55%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Phase breakdown */}
      {phaseStats.length > 1 && (
        <div className="card-glass rounded-3xl p-6">
          <h3 className="font-display font-bold text-foreground mb-4">Ánimo por Fase Lunar</h3>
          <div className="space-y-2">
            {phaseStats.map(ps => (
              <div key={ps.phase} className="flex items-center justify-between bg-muted/20 rounded-xl p-3">
                <span className="text-sm font-medium text-foreground">{ps.phase}</span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-lunar-gold">Ánimo: {ps.avgMood}</span>
                  <span className="text-primary">Energía: {ps.avgEnergy}</span>
                  <span className="text-muted-foreground">({ps.count})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DiaryStats;
