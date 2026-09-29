import { useEffect, useMemo, useState } from 'react';
import { appPath, siteConfig, whatsappHref } from '../config/site';
import type { InvitationRecord } from '../domain/invitation';
import { invitationShareUrl, templateFrameUrl } from '../features/editor/template-bridge';
import { getPublicInvitation, InvitationServiceError } from '../services/invitation-repository';
import { SiteFooter } from '../components/SiteShell';

type LoadState = { status: 'loading' } | { status: 'ready'; invitation: InvitationRecord } | { status: 'error'; message: string };

export function InvitationPage() {
  const id = new URLSearchParams(window.location.search).get('id')?.trim() ?? '';
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const invitation = state.status === 'ready' ? state.invitation : null;
  const template = useMemo(() => invitation && siteConfig.templates.find(item => item.id === invitation.templateId), [invitation]);
  const frameUrl = useMemo(() => invitation && template ? templateFrameUrl(template, invitation.data) : '', [invitation, template]);
  const shareUrl = invitation ? invitationShareUrl(invitation.id) : '';
  const title = invitation?.occasion === 'newborn'
    ? invitation.data.childNameAr
    : invitation?.occasion === 'birthday'
      ? invitation.data.childNameAr
      : [invitation?.data.groomNameAr, invitation?.data.brideNameAr].filter(Boolean).join(' و ');

  useEffect(() => {
    let active = true;
    if (!id) { setState({ status: 'error', message: 'رابط الدعوة غير مكتمل.' }); return; }
    void getPublicInvitation(id).then((record) => {
      if (!active) return;
      setState(record ? { status: 'ready', invitation: record } : { status: 'error', message: 'لم نعثر على هذه الدعوة.' });
    }).catch((error) => {
      if (!active) return;
      setState({ status: 'error', message: error instanceof InvitationServiceError ? error.message : 'تعذر تحميل الدعوة.' });
    });
    return () => { active = false; };
  }, [id]);

  async function share() {
    if (!shareUrl) return;
    if (navigator.share) {
      try { await navigator.share({ title: `دعوة ${title}`, url: shareUrl }); } catch { /* User dismissed the native share sheet. */ }
      return;
    }
    try { await navigator.clipboard.writeText(shareUrl); } catch { /* The link remains selectable in its input. */ }
  }

  if (state.status === 'loading') return <main className="invitation-status"><span className="loader-dot" /><p>جارٍ تجهيز الدعوة…</p></main>;
  if (state.status === 'error' || !invitation || !template) return <main className="invitation-status"><a className="brand" href={appPath('/')}><span className="brand-mark">م</span>{siteConfig.brand}</a><span className="invite-error-icon">✧</span><h1>تعذر فتح الدعوة</h1><p>{state.status === 'error' ? state.message : 'القالب المرتبط بهذه الدعوة غير متوفر.'}</p><a className="button button-secondary" href={whatsappHref('مرحبًا، أحتاج مساعدة بخصوص رابط دعوة.')}>تواصلوا مع مودة</a></main>;

  const prayers = invitation.occasion === 'newborn' ? siteConfig.newbornContent.prayers : [];
  return <>
    <main className="guest-invitation-page">
      <div className="guest-invite-heading"><a className="brand" href={appPath('/')}><span className="brand-mark">م</span>{siteConfig.brand}</a><span>{invitation.occasion === 'newborn' ? 'بشارة مولود' : invitation.occasion === 'birthday' ? 'دعوة عيد ميلاد' : 'دعوة مناسبة'}</span></div>
      <div className="guest-invite-title"><span className="eyebrow">دعوة خاصة</span><h1>{title || 'دعوتكم'}</h1></div>
      <div className="guest-invite-frame"><iframe title={`دعوة ${title || ''}`} src={frameUrl} allow="autoplay; fullscreen" /></div>
      <p className="guest-invite-note">تأكيد الحضور والتهاني تُرسل عبر واتساب، ولا تُحفظ ردود الضيوف في الموقع.</p>
      {prayers.length > 0 && <section className="newborn-prayer-section">
        <span className="eyebrow">دعاء للمولود</span><h2>من الدعاء الوارد في القرآن الكريم</h2>
        {prayers.map(prayer => <blockquote key={prayer.source}><p>﴿{prayer.text}﴾</p><cite><a href={prayer.url} target="_blank" rel="noreferrer">{prayer.source} ↗</a></cite></blockquote>)}
        <div className="hadith-note"><span>حديث صحيح في قدوم المولود</span><p>«{siteConfig.newbornContent.hadith.text}»</p><cite>{siteConfig.newbornContent.hadith.source} <a href={siteConfig.newbornContent.hadith.url} target="_blank" rel="noreferrer">المصدر ↗</a></cite></div>
      </section>}
      <section className="guest-invite-actions">
        <p>نسأل الله أن يملأ مناسبتكم فرحًا ومودة.</p>
        <div><button className="button button-secondary" onClick={() => void share()}>مشاركة الدعوة</button><a className="button button-primary" href={whatsappHref(`مرحبًا، أود إرسال تهنئة بخصوص ${title || 'الدعوة'}.`)} target="_blank" rel="noreferrer">إرسال تهنئة عبر واتساب ↗</a></div>
        <label className="guest-link-copy">رابط الدعوة<input dir="ltr" value={shareUrl} readOnly onFocus={event => event.currentTarget.select()} /></label>
      </section>
    </main>
    <SiteFooter />
  </>;
}
