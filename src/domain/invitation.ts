import type { Occasion, TemplateDefinition } from '../config/site';

export interface ProgramItem {
  id: string;
  time: string;
  title: string;
}

export interface InvitationData {
  occasion: Occasion;
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
  program: ProgramItem[];
  notes: string[];
  closingNote: string;
  contactName: string;
  musicUrl: string;
  fontFamily: 'Tajawal' | 'Amiri' | 'Aref Ruqaa' | 'Reem Kufi';
  accentColor: string;
}

export interface InvitationRecord {
  id: string;
  templateId: string;
  templateVersion: number;
  occasion: Occasion;
  data: InvitationData;
  revision: number;
  status: 'published';
  createdAt: string;
  updatedAt: string;
}

export interface InvitationDraft extends InvitationData {
  templateId: string;
}

export function createEmptyInvitation(template: TemplateDefinition, occasion?: Occasion): InvitationDraft {
  return {
    templateId: template.id,
    occasion: occasion ?? (template.category === 'henna' ? 'wedding' : template.category),
    groomNameAr: '',
    brideNameAr: '',
    groomNameEn: '',
    brideNameEn: '',
    childNameAr: '',
    childNameEn: '',
    hostName: '',
    eventDate: '',
    eventTime: '',
    timeZone: '',
    venueName: '',
    address: '',
    mapUrl: '',
    welcomeLine: '',
    invitationText: '',
    verse: '',
    groomParents: '',
    brideParents: '',
    closingFamilies: '',
    program: [],
    notes: [],
    closingNote: '',
    contactName: '',
    musicUrl: '',
    fontFamily: 'Tajawal',
    accentColor: '#c63f72',
  };
}

export function validateInvitation(draft: InvitationDraft): string[] {
  const errors: string[] = [];
  if (!draft.templateId.trim()) errors.push('اختاروا قالبًا أولًا.');
  if (draft.occasion === 'newborn' && !draft.childNameAr.trim()) errors.push('أضيفوا اسم المولود قبل نشر الدعوة.');
  if (draft.occasion === 'birthday' && !draft.childNameAr.trim()) errors.push('أضيفوا اسم صاحب عيد الميلاد قبل نشر الدعوة.');
  if (draft.occasion === 'wedding' && (!draft.groomNameAr.trim() || !draft.brideNameAr.trim())) errors.push('أضيفوا اسمَي العريس والعروس قبل نشر الدعوة.');
  if (draft.occasion === 'engagement' && (!draft.groomNameAr.trim() || !draft.brideNameAr.trim())) errors.push('أضيفوا اسمَي العروسين قبل نشر الدعوة.');
  if (draft.mapUrl && !isAllowedWebUrl(draft.mapUrl)) errors.push('رابط الخريطة يجب أن يبدأ بـ https://.');
  if (draft.musicUrl && !isAllowedMusicUrl(draft.musicUrl)) errors.push('أدخلوا رابطًا من YouTube لتشغيل الموسيقى في القوالب التي تدعمه.');
  if (draft.eventDate && !/^\d{4}-\d{2}-\d{2}$/.test(draft.eventDate)) errors.push('تحققوا من صيغة التاريخ.');
  return errors;
}

export function isAllowedWebUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isAllowedMusicUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (url.hostname === 'youtu.be' || url.hostname === 'youtube.com' || url.hostname.endsWith('.youtube.com'));
  } catch {
    return false;
  }
}

export function formatDateArabic(date: string): string {
  if (!date) return '';
  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day) return '';
  return new Intl.DateTimeFormat('ar', { dateStyle: 'full', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}
