export const occasions = ['wedding', 'engagement', 'birthday', 'newborn', 'graduation', 'event'] as const;
const fontFamilies = ['Tajawal', 'Amiri', 'Aref Ruqaa', 'Reem Kufi'] as const;
const allowedOrigins = new Set([
  'https://mohamad-adib-tawil.github.io',
  'https://mawada-project.pages.dev',
  ...(Deno.env.get('ALLOWED_ORIGIN') ?? '').split(',').map(origin => origin.trim()).filter(Boolean),
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

export interface SafeProgramItem {
  id: string;
  time: string;
  title: string;
}

export interface SafeInvitationData {
  groomNameAr: string;
  brideNameAr: string;
  groomNameEn: string;
  brideNameEn: string;
  childNameAr: string;
  childNameEn: string;
  hostName: string;
  eventDate: string;
  eventTime: string;
  timeZone: string;
  venueName: string;
  address: string;
  mapUrl: string;
  welcomeLine: string;
  invitationText: string;
  verse: string;
  groomParents: string;
  brideParents: string;
  closingFamilies: string;
  program: SafeProgramItem[];
  notes: string[];
  closingNote: string;
  contactName: string;
  musicUrl: string;
  fontFamily: typeof fontFamilies[number];
  accentColor: string;
}

export class RequestFailure extends Error {
  constructor(message: string, readonly status = 400) { super(message); }
}

export function responseHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('origin') ?? '';
  const allowedOrigin = allowedOrigins.has(origin) ? origin : '';
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

export function jsonResponse(request: Request, body: unknown, status = 200, additionalHeaders: Record<string, string> = {}): Response {
  return Response.json(body, {
    status,
    headers: { ...responseHeaders(request), 'Content-Type': 'application/json; charset=utf-8', ...additionalHeaders },
  });
}

export function assertAllowedOrigin(request: Request): void {
  const origin = request.headers.get('origin');
  if (origin && !allowedOrigins.has(origin)) throw new RequestFailure('Origin is not allowed.', 403);
}

function safeText(value: unknown, name: string, maxLength: number): string {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') throw new RequestFailure(`Invalid field: ${name}`);
  const result = value.trim();
  if (result.length > maxLength || /[<>\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(result)) {
    throw new RequestFailure(`Invalid field: ${name}`);
  }
  return result;
}

function httpsUrl(value: unknown, name: string): string {
  const result = safeText(value, name, 2048);
  if (!result) return '';
  try {
    const parsed = new URL(result);
    if (parsed.protocol !== 'https:') throw new Error('scheme');
    return parsed.href;
  } catch { throw new RequestFailure(`Invalid HTTPS link: ${name}`); }
}

function youtubeUrl(value: unknown, name: string): string {
  const result = httpsUrl(value, name);
  if (!result) return '';
  const hostname = new URL(result).hostname;
  if (hostname !== 'youtu.be' && hostname !== 'youtube.com' && !hostname.endsWith('.youtube.com')) {
    throw new RequestFailure(`Invalid YouTube link: ${name}`);
  }
  return result;
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function sanitizeDraft(input: unknown): { templateId: string; occasion: typeof occasions[number]; data: SafeInvitationData } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new RequestFailure('Invitation draft must be an object.');
  const draft = input as Record<string, unknown>;
  const templateId = safeText(draft.templateId, 'templateId', 80);
  if (!/^[a-z0-9-]{1,80}$/.test(templateId)) throw new RequestFailure('Invalid template.');
  if (typeof draft.occasion !== 'string' || !occasions.includes(draft.occasion as typeof occasions[number])) throw new RequestFailure('Invalid occasion.');
  const occasion = draft.occasion as typeof occasions[number];
  const date = safeText(draft.eventDate, 'eventDate', 10);
  if (date && !isValidDate(date)) throw new RequestFailure('Invalid date.');
  const time = safeText(draft.eventTime, 'eventTime', 5);
  if (time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new RequestFailure('Invalid time.');
  const timezone = safeText(draft.timeZone, 'timeZone', 80);
  if (timezone) {
    try { new Intl.DateTimeFormat('en', { timeZone: timezone }); }
    catch { throw new RequestFailure('Invalid time zone.'); }
  }
  const programInput = Array.isArray(draft.program) ? draft.program : [];
  if (programInput.length > 25) throw new RequestFailure('Too many program items.');
  const program = programInput.map((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw new RequestFailure(`Invalid program item ${index + 1}.`);
    const row = item as Record<string, unknown>;
    const itemTime = safeText(row.time, 'program.time', 5);
    if (itemTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(itemTime)) throw new RequestFailure('Invalid program time.');
    return { id: safeText(row.id, 'program.id', 64), time: itemTime, title: safeText(row.title, 'program.title', 180) };
  }).filter(row => row.title);
  const notesInput = Array.isArray(draft.notes) ? draft.notes : [];
  if (notesInput.length > 20) throw new RequestFailure('Too many notes.');
  const notes = notesInput.map((note, index) => safeText(note, `notes.${index}`, 300)).filter(Boolean);
  const font = safeText(draft.fontFamily, 'fontFamily', 30);
  const fontFamily = (fontFamilies as readonly string[]).includes(font) ? font as typeof fontFamilies[number] : 'Tajawal';
  const accentColor = safeText(draft.accentColor, 'accentColor', 7) || '#c63f72';
  if (!/^#[0-9a-f]{6}$/i.test(accentColor)) throw new RequestFailure('Invalid accent color.');

  const data: SafeInvitationData = {
    groomNameAr: safeText(draft.groomNameAr, 'groomNameAr', 120),
    brideNameAr: safeText(draft.brideNameAr, 'brideNameAr', 120),
    groomNameEn: safeText(draft.groomNameEn, 'groomNameEn', 120),
    brideNameEn: safeText(draft.brideNameEn, 'brideNameEn', 120),
    childNameAr: safeText(draft.childNameAr, 'childNameAr', 120),
    childNameEn: safeText(draft.childNameEn, 'childNameEn', 120),
    hostName: safeText(draft.hostName, 'hostName', 160),
    eventDate: date,
    eventTime: time,
    timeZone: timezone,
    venueName: safeText(draft.venueName, 'venueName', 180),
    address: safeText(draft.address, 'address', 300),
    mapUrl: httpsUrl(draft.mapUrl, 'mapUrl'),
    welcomeLine: safeText(draft.welcomeLine, 'welcomeLine', 240),
    invitationText: safeText(draft.invitationText, 'invitationText', 1800),
    verse: safeText(draft.verse, 'verse', 900),
    groomParents: safeText(draft.groomParents, 'groomParents', 240),
    brideParents: safeText(draft.brideParents, 'brideParents', 240),
    closingFamilies: safeText(draft.closingFamilies, 'closingFamilies', 240),
    program,
    notes,
    closingNote: safeText(draft.closingNote, 'closingNote', 240),
    contactName: safeText(draft.contactName, 'contactName', 120),
    musicUrl: youtubeUrl(draft.musicUrl, 'musicUrl'),
    fontFamily,
    accentColor,
  };
  return { templateId, occasion, data };
}

export function serializeInvitation(row: Record<string, unknown>) {
  return {
    id: row.id,
    templateId: row.template_id,
    templateVersion: row.template_version,
    occasion: row.occasion,
    data: row.data,
    revision: row.revision,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
