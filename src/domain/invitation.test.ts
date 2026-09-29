import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { siteConfig } from '../config/site';
import { createEmptyInvitation, formatDateArabic, isAllowedMusicUrl, isAllowedWebUrl, validateInvitation } from './invitation';

describe('invitation data', () => {
  const wedding = siteConfig.templates.find(template => template.id === 'wedding-temp-bab')!;

  it('starts empty and does not fabricate an event date, time, or place', () => {
    const draft = createEmptyInvitation(wedding);
    expect(draft.eventDate).toBe('');
    expect(draft.eventTime).toBe('');
    expect(draft.venueName).toBe('');
    expect(draft.address).toBe('');
  });

  it('requires both wedding names while allowing genuinely unknown optional details', () => {
    const draft = createEmptyInvitation(wedding);
    expect(validateInvitation(draft)).toContain('أضيفوا اسمَي العريس والعروس قبل نشر الدعوة.');
    draft.groomNameAr = 'أحمد';
    draft.brideNameAr = 'مريم';
    expect(validateInvitation(draft)).toEqual([]);
  });

  it('accepts HTTPS links and rejects insecure or malformed links', () => {
    expect(isAllowedWebUrl('https://maps.app.goo.gl/example')).toBe(true);
    expect(isAllowedWebUrl('http://example.com')).toBe(false);
    expect(isAllowedWebUrl('not a URL')).toBe(false);
  });

  it('accepts supported YouTube music links only', () => {
    expect(isAllowedMusicUrl('https://youtu.be/abc123')).toBe(true);
    expect(isAllowedMusicUrl('https://www.youtube.com/watch?v=abc123')).toBe(true);
    expect(isAllowedMusicUrl('https://audio.example.com/song.mp3')).toBe(false);
  });

  it('formats dates without shifting the calendar day by timezone', () => {
    expect(formatDateArabic('2026-09-29')).toContain('29');
    expect(formatDateArabic('')).toBe('');
  });
});

describe('published template catalog', () => {
  it('contains a local HTML preview and Mawada adapter for each listed template', () => {
    expect(siteConfig.templates).toHaveLength(34);
    for (const template of siteConfig.templates) {
      const previewFile = resolve(process.cwd(), 'public', template.localPreview.slice(1));
      const adapterFile = resolve(process.cwd(), 'public/templates', template.id, 'mawada-adapter.js');
      expect(existsSync(previewFile), `${template.id} preview`).toBe(true);
      expect(existsSync(adapterFile), `${template.id} adapter`).toBe(true);
    }
  });
});
