import { useEffect, useMemo, useState } from 'react';
import { appPath, siteConfig, whatsappHref } from '../config/site';
import type { InvitationRecord } from '../domain/invitation';
import { templateFrameUrl } from '../features/editor/template-bridge';
import { getPublicInvitation, InvitationServiceError } from '../services/invitation-repository';
import { BrandMark } from '../components/SiteShell';

type LoadState = { status: 'loading' } | { status: 'ready'; invitation: InvitationRecord } | { status: 'error'; message: string };

export function InvitationPage() {
  const id = new URLSearchParams(window.location.search).get('id')?.trim() ?? '';
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const invitation = state.status === 'ready' ? state.invitation : null;
  const template = useMemo(() => invitation && siteConfig.templates.find(item => item.id === invitation.templateId), [invitation]);
  const frameUrl = useMemo(() => invitation && template ? templateFrameUrl(template, invitation.data) : '', [invitation, template]);
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

  if (state.status === 'loading') return <main className="guest-invitation-page guest-invitation-fullscreen invitation-loading" aria-busy="true"><span className="invitation-loading-mark" aria-hidden="true">✦</span></main>;
  if (state.status === 'error' || !invitation || !template) return <main className="invitation-status"><a className="brand" href={appPath('/')}><BrandMark />{siteConfig.brand}</a><span className="invite-error-icon">✧</span><h1>تعذر فتح الدعوة</h1><p>{state.status === 'error' ? state.message : 'القالب المرتبط بهذه الدعوة غير متوفر.'}</p><a className="button button-secondary" href={whatsappHref('مرحبًا، أحتاج مساعدة بخصوص رابط دعوة.')}>تواصلوا مع مودة</a></main>;

  return <main className="guest-invitation-page guest-invitation-fullscreen">
    <div className="guest-invite-frame"><iframe title={`دعوة ${title || ''}`} src={frameUrl} allow="autoplay; fullscreen" /></div>
  </main>;
}
