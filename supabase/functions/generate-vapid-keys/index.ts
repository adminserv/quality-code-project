const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function base64urlEncode(buffer: Uint8Array): string {
  let binary = '';
  for (const byte of buffer) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Generate ECDSA P-256 key pair with extractable = true
    const keyPair = await crypto.subtle.generateKey(
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['sign', 'verify']
    );

    // Export as JWK
    const publicJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
    const privateJwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey);

    // Convert public key to uncompressed format for applicationServerKey
    const xBytes = Uint8Array.from(atob(publicJwk.x!.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
    const yBytes = Uint8Array.from(atob(publicJwk.y!.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
    const publicKeyRaw = new Uint8Array(65);
    publicKeyRaw[0] = 0x04;
    publicKeyRaw.set(xBytes, 1);
    publicKeyRaw.set(yBytes, 33);

    return new Response(JSON.stringify({
      applicationServerKey: base64urlEncode(publicKeyRaw),
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
