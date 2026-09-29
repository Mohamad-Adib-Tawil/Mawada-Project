import { withSupabase } from 'npm:@supabase/server';
import { assertAllowedOrigin, jsonResponse, RequestFailure, sanitizeDraft, serializeInvitation } from '../_shared/common.ts';

const rowFields = 'id, template_id, template_version, occasion, data, status, revision, request_id, created_by, created_at, updated_at';
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function bodyJson(request: Request): Promise<Record<string, unknown>> {
  const length = Number(request.headers.get('content-length') ?? 0);
  if (length > 64_000) throw new RequestFailure('Request is too large.', 413);
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > 64_000) throw new RequestFailure('Request is too large.', 413);
  try {
    const body: unknown = JSON.parse(text);
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('shape');
    return body as Record<string, unknown>;
  } catch { throw new RequestFailure('Invalid JSON body.'); }
}

const handler = withSupabase({ auth: 'user' }, async (request, context) => {
  try {
    assertAllowedOrigin(request);
    if (request.method !== 'POST') return jsonResponse(request, { error: 'Method not allowed.' }, 405, { Allow: 'POST, OPTIONS' });
    const userId = typeof context.userClaims?.sub === 'string' ? context.userClaims.sub : '';
    if (!userId) return jsonResponse(request, { error: 'Authentication required.' }, 401);

    const admin = context.supabaseAdmin;
    const { data: member, error: membershipError } = await admin
      .from('team_members')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();
    if (membershipError) {
      console.error('Team membership lookup failed:', membershipError.message);
      return jsonResponse(request, { error: 'Unable to check team access.' }, 500);
    }
    if (!member) return jsonResponse(request, { error: 'Team access required.' }, 403);

    const body = await bodyJson(request);
    const action = body.action;
    if (action === 'check') return jsonResponse(request, { allowed: true });

    if (action === 'create') {
      if (typeof body.requestId !== 'string' || !uuidPattern.test(body.requestId)) throw new RequestFailure('Invalid request identifier.');
      const draft = sanitizeDraft(body.draft);
      const { data: catalogEntry, error: catalogError } = await admin
        .from('template_catalog')
        .select('id, version')
        .eq('id', draft.templateId)
        .eq('active', true)
        .maybeSingle();
      if (catalogError) throw new RequestFailure('Unable to check template availability.', 500);
      if (!catalogEntry) throw new RequestFailure('Template is not available.', 422);

      const { data: existing, error: existingError } = await admin
        .from('invitations')
        .select(rowFields)
        .eq('created_by', userId)
        .eq('request_id', body.requestId)
        .maybeSingle();
      if (existingError) throw new RequestFailure('Unable to check the save request.', 500);
      if (existing) return jsonResponse(request, { invitation: serializeInvitation(existing) });

      const id = `inv_${crypto.randomUUID().replaceAll('-', '')}`;
      const { data: saved, error: insertError } = await admin
        .from('invitations')
        .insert({
          id,
          template_id: draft.templateId,
          template_version: catalogEntry.version,
          occasion: draft.occasion,
          data: draft.data,
          status: 'published',
          revision: 1,
          request_id: body.requestId,
          created_by: userId,
          updated_at: new Date().toISOString(),
        })
        .select(rowFields)
        .single();
      if (insertError) {
        if (insertError.code === '23505') {
          const { data: retry } = await admin.from('invitations').select(rowFields).eq('created_by', userId).eq('request_id', body.requestId).maybeSingle();
          if (retry) return jsonResponse(request, { invitation: serializeInvitation(retry) });
        }
        console.error('Invitation insert failed:', insertError.message);
        return jsonResponse(request, { error: 'Unable to publish invitation.' }, 500);
      }
      return jsonResponse(request, { invitation: serializeInvitation(saved) }, 201);
    }

    if (action === 'update') {
      const id = typeof body.id === 'string' ? body.id : '';
      const expectedRevision = body.expectedRevision;
      if (!/^inv_[a-f0-9]{32}$/.test(id) || !Number.isInteger(expectedRevision) || Number(expectedRevision) < 1) throw new RequestFailure('Invalid update request.');
      const draft = sanitizeDraft(body.draft);
      const { data: catalogEntry, error: catalogError } = await admin
        .from('template_catalog')
        .select('id, version')
        .eq('id', draft.templateId)
        .eq('active', true)
        .maybeSingle();
      if (catalogError) throw new RequestFailure('Unable to check template availability.', 500);
      if (!catalogEntry) throw new RequestFailure('Template is not available.', 422);

      const { data: updated, error: updateError } = await admin
        .from('invitations')
        .update({
          template_id: draft.templateId,
          template_version: catalogEntry.version,
          occasion: draft.occasion,
          data: draft.data,
          revision: Number(expectedRevision) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('revision', Number(expectedRevision))
        .select(rowFields)
        .maybeSingle();
      if (updateError) {
        console.error('Invitation update failed:', updateError.message);
        return jsonResponse(request, { error: 'Unable to update invitation.' }, 500);
      }
      if (!updated) return jsonResponse(request, { error: 'Invitation changed in another session or no longer exists.' }, 409);
      return jsonResponse(request, { invitation: serializeInvitation(updated) });
    }

    return jsonResponse(request, { error: 'Unsupported action.' }, 400);
  } catch (error) {
    if (error instanceof RequestFailure) return jsonResponse(request, { error: error.message }, error.status);
    console.error('Invitation administration request failed:', error instanceof Error ? error.message : 'Unknown error');
    return jsonResponse(request, { error: 'Unable to process invitation request.' }, 500);
  }
});

Deno.serve(async request => {
  if (request.method === 'OPTIONS') {
    try { assertAllowedOrigin(request); }
    catch (error) {
      const failure = error instanceof RequestFailure ? error : new RequestFailure('Origin is not allowed.', 403);
      return jsonResponse(request, { error: failure.message }, failure.status);
    }
    return new Response('ok', { headers: jsonHeaders(request) });
  }
  return handler(request);
});

function jsonHeaders(request: Request): Record<string, string> {
  return { ...cors(request), 'Content-Type': 'text/plain; charset=utf-8' };
}

function cors(request: Request): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': request.headers.get('origin') ?? 'https://mohamad-adib-tawil.github.io',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}
