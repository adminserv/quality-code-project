import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, ChevronLeft, ChevronRight, Smile, Zap, Moon as MoonIcon, BedDouble, Pencil, Trash2, LogIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useMoonPhase, calculateMoonPhase } from '@/hooks/useMoonPhase';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const moodEmojis = ['😞', '😐', '🙂', '😊', '🤩'];
const energyEmojis = ['🔋', '🔋', '⚡', '⚡', '🔥'];

interface DiaryEntry {
  id: string;
  entry_date: string;
  mood: number;
  energy: number;
  sleep_quality: number | null;
  dreams: string | null;
  notes: string | null;
  moon_phase: string | null;
  moon_illumination: number | null;
}

const RatingSelector = ({ value, onChange, emojis, label }: {
  value: number;
  onChange: (v: number) => void;
  emojis: string[];
  label: string;
}) => (
  <div>
    <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">{label}</p>
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={cn(
            'w-10 h-10 rounded-xl text-lg transition-all',
            value === n
              ? 'bg-primary/20 ring-1 ring-primary/50 scale-110'
              : 'bg-muted/30 hover:bg-muted/50'
          )}
        >
          {emojis[n - 1]}
        </button>
      ))}
    </div>
  </div>
);

const LunarDiary = () => {
  const { user } = useAuth();
  const { moonData } = useMoonPhase();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [dreams, setDreams] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (user) fetchEntries();
  }, [user]);

  const fetchEntries = async () => {
    const { data } = await supabase
      .from('lunar_diary')
      .select('*')
      .order('entry_date', { ascending: false })
      .limit(30);
    if (data) setEntries(data);
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const entry = {
      user_id: user.id,
      entry_date: today,
      mood,
      energy,
      sleep_quality: sleepQuality,
      dreams: dreams || null,
      notes: notes || null,
      moon_phase: moonData.phaseName,
      moon_illumination: Math.round(moonData.illumination * 10) / 10,
    };

    if (editingId) {
      await supabase.from('lunar_diary').update(entry).eq('id', editingId);
    } else {
      await supabase.from('lunar_diary').upsert(entry, { onConflict: 'user_id,entry_date' });
    }

    setShowForm(false);
    setEditingId(null);
    resetForm();
    await fetchEntries();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('lunar_diary').delete().eq('id', id);
    await fetchEntries();
  };

  const handleEdit = (entry: DiaryEntry) => {
    setMood(entry.mood);
    setEnergy(entry.energy);
    setSleepQuality(entry.sleep_quality || 3);
    setDreams(entry.dreams || '');
    setNotes(entry.notes || '');
    setEditingId(entry.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setMood(3);
    setEnergy(3);
    setSleepQuality(3);
    setDreams('');
    setNotes('');
  };

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-glass rounded-3xl p-6 text-center"
      >
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h3 className="font-display font-bold text-foreground mb-2">Diario Lunar</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Registra tu ánimo, energía y sueños según la fase lunar. Inicia sesión para comenzar.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
        >
          <LogIn className="w-4 h-4" />
          Iniciar sesión
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="card-glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-foreground">Diario Lunar</h3>
          </div>
          {!showForm && (
            <button
              onClick={() => { resetForm(); setEditingId(null); setShowForm(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/15 text-primary text-sm font-medium hover:bg-primary/25 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Hoy
            </button>
          )}
        </div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-hidden"
            >
              <div className="bg-muted/20 rounded-xl p-3 flex items-center gap-2 text-sm">
                <span className="text-lg">{moonData.phaseEmoji}</span>
                <span className="text-muted-foreground">{moonData.phaseName} · {moonData.illumination.toFixed(0)}%</span>
              </div>

              <RatingSelector value={mood} onChange={setMood} emojis={moodEmojis} label="Estado de ánimo" />
              <RatingSelector value={energy} onChange={setEnergy} emojis={energyEmojis} label="Nivel de energía" />
              <RatingSelector value={sleepQuality} onChange={setSleepQuality} emojis={['😴', '😪', '😌', '😊', '✨']} label="Calidad del sueño" />

              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Sueños</p>
                <textarea
                  value={dreams}
                  onChange={e => setDreams(e.target.value)}
                  placeholder="¿Qué soñaste anoche?"
                  className="w-full bg-muted/30 border border-border/30 rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none h-20 focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Notas</p>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Reflexiones del día..."
                  className="w-full bg-muted/30 border border-border/30 rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none h-20 focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : editingId ? 'Actualizar' : 'Guardar'}
                </button>
                <button
                  onClick={() => { setShowForm(false); setEditingId(null); }}
                  className="px-4 py-2.5 rounded-xl border border-border/50 text-muted-foreground text-sm hover:text-foreground transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Entries list */}
      {entries.length > 0 && (
        <div className="space-y-3">
          {entries.map(entry => {
            const entryMoon = calculateMoonPhase(new Date(entry.entry_date + 'T12:00:00'));
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="card-glass rounded-2xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{entryMoon.phaseEmoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {new Date(entry.entry_date + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{entry.moon_phase}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(entry)} className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(entry.id)} className="p-1.5 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  <span title="Ánimo">{moodEmojis[entry.mood - 1]}</span>
                  <span title="Energía">{energyEmojis[entry.energy - 1]}</span>
                  {entry.sleep_quality && <span title="Sueño">💤{entry.sleep_quality}/5</span>}
                </div>
                {entry.notes && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{entry.notes}</p>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default LunarDiary;
