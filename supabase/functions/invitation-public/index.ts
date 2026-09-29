import { withSupabase } from 'npm:@supabase/server';
import { assertAllowedOrigin, jsonResponse, RequestFailure, serializeInvitation } from '../_shared/common.ts';

const handler = withSupabase({ auth: 'publishable' }, async (request, context) => {
  try {
    assertAllowedOrigin(request);
    if (request.method !== 'GET') return jsonResponse(request, { error: 'Method not allowed.' }, 405, { Allow: 'GET, OPTIONS' });
    const id = new URL(request.url).searchParams.get('id') ?? '';
    if (!/^inv_[a-f0-9]{32}$/.test(id)) return jsonResponse(request, { error: 'Invitation not found.' }, 404);
    const { data, error } = await context.supabaseAdmin
      .from('invitations')
      .select('id, template_id, template_version, occasion, data, status, revision, created_at, updated_at')
      .eq('id', id)
      .eq('status', 'published')
      .maybeSingle();
    if (error) {
      console.error('Public invitation lookup failed:', error.message);
      return jsonResponse(request, { error: 'Unable to load invitation.' }, 500);
    }
    if (!data) return jsonResponse(request, { error: 'Invitation not found.' }, 404);
    const publicRecord = serializeInvitation(data);
    return jsonResponse(request, { invitation: publicRecord }, 200, { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=120' });
  } catch (error) {
    if (error instanceof RequestFailure) return jsonResponse(request, { error: error.message }, error.status);
    console.error('Public invitation request failed:', error instanceof Error ? error.message : 'Unknown error');
    return jsonResponse(request, { error: 'Unable to load invitation.' }, 500);
  }
});

Deno.serve(async request => {
  if (request.method === 'OPTIONS') {
    try { assertAllowedOrigin(request); }
    catch (error) {
      const failure = error instanceof RequestFailure ? error : new RequestFailure('Origin is not allowed.', 403);
      return jsonResponse(request, { error: failure.message }, failure.status);
    }
    return new Response('ok', { headers: {
      'Access-Control-Allow-Origin': request.headers.get('origin') ?? 'https://mohamad-adib-tawil.github.io',
      'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    } });
  }
  return handler(request);
});
