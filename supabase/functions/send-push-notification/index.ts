import { ApplicationServer, importVapidKeys } from "jsr:@negrel/webpush";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const vapidPublicKeyJwk = Deno.env.get('VAPID_PUBLIC_KEY_JWK');
    const vapidPrivateKeyJwk = Deno.env.get('VAPID_PRIVATE_KEY_JWK');
    const vapidSubject = Deno.env.get('VAPID_SUBJECT') || 'mailto:lunaviva@app.com';

    if (!vapidPublicKeyJwk || !vapidPrivateKeyJwk) {
      return new Response(JSON.stringify({ error: 'VAPID keys not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body for event details
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

    if (prefError) {
      throw new Error(`Failed to fetch preferences: ${prefError.message}`);
    }

    if (!preferences || preferences.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: 'No subscribers for this event type' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userIds = preferences.map(p => p.user_id);

    // Get push subscriptions for these users
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .in('user_id', userIds);

    if (subError) {
      throw new Error(`Failed to fetch subscriptions: ${subError.message}`);
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: 'No push subscriptions found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Import VAPID keys
    const vapidKeys = await importVapidKeys(JSON.parse(vapidPublicKeyJwk), JSON.parse(vapidPrivateKeyJwk));
    
    // Create application server
    const appServer = new ApplicationServer({
      contactInformation: vapidSubject,
      keys: vapidKeys,
    });

    // Send notifications
    const payload = JSON.stringify({
      title,
      body: message,
      icon: icon || '🌕',
      url: '/',
    });

    let sent = 0;
    let failed = 0;
    const staleSubscriptionIds: string[] = [];

    for (const sub of subscriptions) {
      try {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        const subscriber = await appServer.subscribe(pushSubscription);
        await subscriber.pushTextMessage(payload, { urgency: 'normal', ttl: 86400 });
        sent++;
      } catch (err) {
        failed++;
        // If subscription is gone (410), mark for removal
        if (err.isGone?.()) {
          staleSubscriptionIds.push(sub.id);
        }
        console.error(`Failed to send to ${sub.endpoint}:`, err.message);
      }
    }

    // Clean up stale subscriptions
    if (staleSubscriptionIds.length > 0) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('id', staleSubscriptionIds);
    }

    return new Response(JSON.stringify({ sent, failed, cleaned: staleSubscriptionIds.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Push notification error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
