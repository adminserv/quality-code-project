import { ApplicationServer, importVapidKeys } from "jsr:@negrel/webpush";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function getConfig(supabase: any) {
  const { data, error } = await supabase
    .from('app_config')
    .select('key, value')
    .in('key', ['vapid_public_key_jwk', 'vapid_private_key_jwk', 'vapid_subject']);

  if (error) throw new Error(`Config error: ${error.message}`);
  
  const config: Record<string, string> = {};
  for (const row of data || []) {
    config[row.key] = row.value;
  }
  return config;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const config = await getConfig(supabase);
    
    if (!config.vapid_public_key_jwk || !config.vapid_private_key_jwk) {
      return new Response(JSON.stringify({ error: 'VAPID keys not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const body = await req.json().catch(() => ({}));
    const { eventType, title, message, icon } = body;

    if (!title || !message) {
      return new Response(JSON.stringify({ error: 'title and message required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Map event types to preference columns
    const eventPreferenceMap: Record<string, string> = {
      'full_moon': 'full_moon',
      'new_moon': 'new_moon',
      'first_quarter': 'quarters',
      'last_quarter': 'quarters',
      'eclipse': 'eclipses',
      'supermoon': 'supermoons',
      'blood_moon': 'supermoons',
      'blue_moon': 'supermoons',
    };

    const preferenceColumn = eventPreferenceMap[eventType] || 'full_moon';

    // Get users who want this type of notification
    const { data: preferences, error: prefError } = await supabase
      .from('notification_preferences')
      .select('user_id')
      .eq(preferenceColumn, true);

    if (prefError) throw new Error(`Preferences error: ${prefError.message}`);

    if (!preferences || preferences.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: 'No subscribers' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userIds = preferences.map(p => p.user_id);

    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .in('user_id', userIds);

    if (subError) throw new Error(`Subscriptions error: ${subError.message}`);

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: 'No push subscriptions' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Import VAPID keys
    const publicJwk = JSON.parse(config.vapid_public_key_jwk);
    const privateJwk = JSON.parse(config.vapid_private_key_jwk);
    const vapidKeys = await importVapidKeys(publicJwk, privateJwk);
    
    const appServer = new ApplicationServer({
      contactInformation: config.vapid_subject || 'mailto:lunaviva@app.com',
      keys: vapidKeys,
    });

    const payload = JSON.stringify({
      title,
      body: message,
      icon: icon || '🌕',
      url: '/',
    });

    let sent = 0;
    let failed = 0;
    const staleIds: string[] = [];

    for (const sub of subscriptions) {
      try {
        const subscriber = await appServer.subscribe({
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        });
        await subscriber.pushTextMessage(payload, { urgency: 'normal', ttl: 86400 });
        sent++;
      } catch (err: any) {
        failed++;
        if (err.isGone?.()) staleIds.push(sub.id);
        console.error(`Push failed for ${sub.endpoint}:`, err.message);
      }
    }

    if (staleIds.length > 0) {
      await supabase.from('push_subscriptions').delete().in('id', staleIds);
    }

    return new Response(JSON.stringify({ sent, failed, cleaned: staleIds.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Push error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
