import { FunctionsHttpError } from '@supabase/supabase-js';
import type { InvitationDraft, InvitationRecord } from '../domain/invitation';
import {
  invitationFunctionsUrl,
  isSupabaseConfigured,
  supabase,
  supabasePublishableKey,
} from './supabase';

export class InvitationServiceError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'InvitationServiceError';
  }
}

export async function checkTeamAccess(): Promise<boolean> {
  if (!supabase) throw new InvitationServiceError('إعداد Supabase غير مكتمل.');
  const { data, error } = await supabase.functions.invoke('invitation-admin', {
    body: { action: 'check' },
  });
  if (error) {
    if (error instanceof FunctionsHttpError && error.context instanceof Response) {
      if (error.context.status === 401 || error.context.status === 403) return false;
    }
    throw new InvitationServiceError(error.message);
  }
  return data?.allowed === true;
}

export async function publishInvitation(draft: InvitationDraft, requestId: string): Promise<InvitationRecord> {
  if (!supabase) throw new InvitationServiceError('لم يتم إعداد خدمة الحفظ بعد.');
  const { data, error } = await supabase.functions.invoke('invitation-admin', {
    body: { action: 'create', draft, requestId },
  });
  if (error) throw new InvitationServiceError(error.message);
  if (!data?.invitation?.id) throw new InvitationServiceError('لم يصل تأكيد الحفظ من الخادم.');
  return data.invitation as InvitationRecord;
}

export async function updateInvitation(
  id: string,
  draft: InvitationDraft,
  expectedRevision: number,
): Promise<InvitationRecord> {
  if (!supabase) throw new InvitationServiceError('لم يتم إعداد خدمة الحفظ بعد.');
  const { data, error } = await supabase.functions.invoke('invitation-admin', {
    body: { action: 'update', id, draft, expectedRevision },
  });
  if (error) throw new InvitationServiceError(error.message);
  if (!data?.invitation?.id) throw new InvitationServiceError('لم يصل تأكيد التحديث من الخادم.');
  return data.invitation as InvitationRecord;
}

export async function getPublicInvitation(id: string): Promise<InvitationRecord | null> {
  if (!isSupabaseConfigured) throw new InvitationServiceError('رابط الدعوة لا يعمل حتى تفعيل خدمة الحفظ.');
  const url = new URL(`${invitationFunctionsUrl}/invitation-public`);
  url.searchParams.set('id', id);
  const response = await fetch(url, { headers: { apikey: supabasePublishableKey } });
  if (response.status === 404) return null;
  if (!response.ok) throw new InvitationServiceError('تعذر تحميل الدعوة. حاولوا مرة أخرى.', response.status);
  const body: { invitation?: InvitationRecord } = await response.json();
  return body.invitation ?? null;
}
