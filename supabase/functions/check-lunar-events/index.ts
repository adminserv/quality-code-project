import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LUNAR_MONTH = 29.53058868;
const KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z').getTime();

function getMoonPhase(date: Date): number {
  const diff = date.getTime() - KNOWN_NEW_MOON;
  const days = diff / (1000 * 60 * 60 * 24);
  return (((days % LUNAR_MONTH) + LUNAR_MONTH) % LUNAR_MONTH) / LUNAR_MONTH;
}

// Real astronomical events 2025-2027
const SPECIAL_EVENTS: Record<string, { type: string; title: string; message: string; icon: string }> = {
  // 2025
  '2025-03-14': { type: 'eclipse', title: '🌑 Eclipse Total de Luna', message: 'Esta noche: eclipse total de Luna visible desde América.' , icon: '🌑' },
  '2025-03-29': { type: 'eclipse', title: '☀️ Eclipse Parcial de Sol', message: 'Eclipse parcial de Sol visible desde partes de Europa y África.', icon: '☀️' },
  '2025-05-12': { type: 'supermoon', title: '🌕 Superluna de Flores', message: '¡Superluna esta noche! La Luna estará un 7% más grande y brillante.', icon: '🌕' },
  '2025-09-07': { type: 'eclipse', title: '🌑 Eclipse Total de Luna', message: 'Eclipse total de Luna visible desde Europa, África y Asia.', icon: '🌑' },
  '2025-09-21': { type: 'eclipse', title: '☀️ Eclipse Parcial de Sol', message: 'Eclipse parcial de Sol visible desde Australia y Nueva Zelanda.', icon: '☀️' },
  '2025-10-07': { type: 'supermoon', title: '🌕 Superluna del Cazador', message: 'Superluna del Cazador: la más cercana del año a solo 356,884 km.', icon: '🌕' },
  '2025-11-05': { type: 'supermoon', title: '🌕 Superluna del Castor', message: 'Última superluna de 2025. ¡No te la pierdas!', icon: '🌕' },
  // 2026
  '2026-02-17': { type: 'eclipse', title: '☀️ Eclipse Anular de Sol', message: 'Eclipse anular de Sol visible desde Antártida y sur de Sudamérica.', icon: '☀️' },
  '2026-03-03': { type: 'eclipse', title: '🌑 Eclipse Total de Luna', message: 'Eclipse total de Luna visible desde América, Europa y África.', icon: '🌑' },
  '2026-08-12': { type: 'eclipse', title: '☀️ Eclipse Total de Sol', message: '¡Eclipse total de Sol! Visible desde España, Islandia y Rusia.', icon: '☀️' },
  '2026-08-28': { type: 'eclipse', title: '🌑 Eclipse Parcial de Luna', message: 'Eclipse parcial de Luna visible desde América y Europa.', icon: '🌑' },
  '2026-05-01': { type: 'supermoon', title: '🌕 Superluna Rosa', message: 'Superluna de mayo: perigeo a 357,300 km.', icon: '🌕' },
  '2026-10-18': { type: 'supermoon', title: '🌕 Superluna del Cazador', message: 'Superluna del Cazador 2026: la más brillante del año.', icon: '🌕' },
  // 2027
  '2027-02-06': { type: 'eclipse', title: '☀️ Eclipse Anular de Sol', message: 'Eclipse anular de Sol visible desde Sudamérica.', icon: '☀️' },
  '2027-02-20': { type: 'eclipse', title: '🌑 Eclipse Penumbral de Luna', message: 'Eclipse penumbral de Luna visible desde América y Europa.', icon: '🌑' },
  '2027-07-18': { type: 'eclipse', title: '🌑 Eclipse Penumbral de Luna', message: 'Eclipse penumbral de Luna visible desde Asia y Oceanía.', icon: '🌑' },
  '2027-08-02': { type: 'eclipse', title: '☀️ Eclipse Total de Sol', message: '¡Eclipse total de Sol! Visible desde España, Marruecos y Egipto.', icon: '☀️' },
  '2027-04-22': { type: 'supermoon', title: '🌕 Superluna Rosa', message: 'Primera superluna de 2027 a 358,100 km.', icon: '🌕' },
  '2027-11-06': { type: 'supermoon', title: '🌕 Superluna del Castor', message: 'Superluna del Castor: la más cercana de 2027.', icon: '🌕' },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const phase = getMoonPhase(now);

    const notifications: Array<{ eventType: string; title: string; message: string; icon: string }> = [];

    // Check for special events (eclipses, supermoons)
    if (SPECIAL_EVENTS[today]) {
      const event = SPECIAL_EVENTS[today];
      notifications.push({ eventType: event.type, ...event });
    }

    // Check standard lunar phases
    if (phase < 0.017 || phase > 0.983) {
      notifications.push({
        eventType: 'new_moon',
        title: '🌑 Luna Nueva',
        message: 'Hoy es Luna Nueva. Momento ideal para nuevos comienzos y plantar semillas.',
        icon: '🌑',
      });
    } else if (Math.abs(phase - 0.5) < 0.017) {
      notifications.push({
        eventType: 'full_moon',
        title: '🌕 Luna Llena',
        message: 'Hoy es Luna Llena. Disfruta su brillo máximo y cosecha tus frutos.',
        icon: '🌕',
      });
    } else if (Math.abs(phase - 0.25) < 0.017) {
      notifications.push({
        eventType: 'first_quarter',
        title: '🌓 Cuarto Creciente',
        message: 'Cuarto creciente hoy. Fase de acción y determinación.',
        icon: '🌓',
      });
    } else if (Math.abs(phase - 0.75) < 0.017) {
      notifications.push({
        eventType: 'last_quarter',
        title: '🌗 Cuarto Menguante',
        message: 'Cuarto menguante hoy. Momento de soltar y reflexionar.',
        icon: '🌗',
      });
    }

    if (notifications.length === 0) {
      return new Response(JSON.stringify({ message: 'No lunar events today', phase: (phase * 100).toFixed(1) }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Call send-push-notification for each event
    const results = [];
    for (const notif of notifications) {
      const res = await fetch(`${supabaseUrl}/functions/v1/send-push-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
        },
        body: JSON.stringify(notif),
      });
      results.push({ event: notif.eventType, status: res.status, body: await res.json() });
    }

    return new Response(JSON.stringify({ sent: results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Check lunar events error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
