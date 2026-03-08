import { generateVapidKeys, exportApplicationServerKey } from "jsr:@negrel/webpush";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const keys = await generateVapidKeys();

    // Export keys as JWK for storage
    const publicJwk = await crypto.subtle.exportKey('jwk', keys.publicKey);
    const privateJwk = await crypto.subtle.exportKey('jwk', keys.privateKey);

    // Export application server key (base64url encoded public key for frontend)
    const applicationServerKey = await exportApplicationServerKey(keys);

    return new Response(JSON.stringify({
      applicationServerKey,
      publicKeyJwk: JSON.stringify(publicJwk),
      privateKeyJwk: JSON.stringify(privateJwk),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
