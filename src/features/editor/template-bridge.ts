import { appPath, type TemplateDefinition } from '../../config/site';
import type { InvitationData } from '../../domain/invitation';

function encodePayload(data: InvitationData): string {
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

export function templateFrameUrl(template: TemplateDefinition, data: InvitationData): string {
  const url = new URL(appPath(template.localPreview), window.location.origin);
  url.searchParams.set('mawada', encodePayload(data));
  return url.href;
}

export function invitationShareUrl(id: string): string {
  const url = new URL(appPath('/invite/'), window.location.origin);
  url.searchParams.set('id', id);
  return url.href;
}
