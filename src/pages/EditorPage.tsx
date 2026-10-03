import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { InvitationDraft, InvitationRecord } from '../domain/invitation';
import { createEmptyInvitation, formatDateArabic, validateInvitation } from '../domain/invitation';
import { appPath, siteConfig, whatsappHref, type Occasion, type TemplateDefinition } from '../config/site';
import { invitationShareUrl, templateFrameUrl } from '../features/editor/template-bridge';
import { checkTeamAccess, InvitationServiceError, publishInvitation, updateInvitation } from '../services/invitation-repository';
import { isSupabaseConfigured, supabase } from '../services/supabase';
import { SiteHeader, SiteFooter } from '../components/SiteShell';

const defaultTemplate = siteConfig.templates.find(template => template.id === 'wedding-temp-bab') ?? siteConfig.templates[0];
const fontChoices: InvitationDraft['fontFamily'][] = ['Tajawal', 'Amiri', 'Aref Ruqaa', 'Reem Kufi'];

type GateState = 'checking' | 'allowed' | 'denied' | 'unconfigured';

export function EditorPage() {
  const query = new URLSearchParams(window.location.search);
  const initialTemplate = siteConfig.templates.find(template => template.id === query.get('template')) ?? defaultTemplate;
  const [gate, setGate] = useState<GateState>('checking');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDefinition>(initialTemplate);
  const [draft, setDraft] = useState<InvitationDraft>(() => createEmptyInvitation(initialTemplate));
  const [saved, setSaved] = useState<InvitationRecord | null>(null);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const [requestId, setRequestId] = useState(() => crypto.randomUUID());
  const isLocalDemo = import.meta.env.DEV && query.get('local-preview') === '1';

  useEffect(() => {
    let alive = true;
    if (!isSupabaseConfigured) { setGate(isLocalDemo ? 'allowed' : 'unconfigured'); return; }
    void (async () => {
      try {
        const { data } = await supabase!.auth.getSession();
        if (!data.session) { if (alive) setGate('denied'); return; }
        const allowed = await checkTeamAccess();
        if (alive) setGate(allowed ? 'allowed' : 'denied');
      } catch { if (alive) setGate('denied'); }
    })();
    return () => { alive = false; };
  }, [isLocalDemo]);

  const frameUrl = useMemo(() => templateFrameUrl(selectedTemplate, draft), [selectedTemplate, draft]);
  const shareUrl = saved ? invitationShareUrl(saved.id) : '';
  const templatesForOccasion = useMemo(() => {
    const available = siteConfig.templates.filter(item => item.category === draft.occasion);
    return available.length ? available : siteConfig.templates;
  }, [draft.occasion]);

  function change<K extends keyof InvitationDraft>(key: K, value: InvitationDraft[K]) {
    setDraft(current => ({ ...current, [key]: value }));
    setErrors([]);
    setNotice('');
  }

  function changeOccasion(occasion: Occasion) {
    const nextTemplate = siteConfig.templates.find(template => template.category === occasion) ?? selectedTemplate;
    setSelectedTemplate(nextTemplate);
    setDraft(current => ({ ...current, occasion, templateId: nextTemplate.id }));
    setSaved(null);
    setRequestId(crypto.randomUUID());
  }

  function changeTemplate(id: string) {
    const next = siteConfig.templates.find(template => template.id === id);
    if (!next) return;
    setSelectedTemplate(next);
    setDraft(current => ({ ...current, templateId: next.id }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateInvitation(draft);
    if (validation.length) { setErrors(validation); return; }
    setBusy(true); setErrors([]); setNotice('');
    try {
      const record = saved
        ? await updateInvitation(saved.id, draft, saved.revision)
        : await publishInvitation(draft, requestId);
      setSaved(record);
      setNotice(saved ? 'تم تحديث الدعوة من الخادم.' : 'تم حفظ الدعوة ونشر رابطها.');
      if (!saved) setRequestId(crypto.randomUUID());
    } catch (error) {
      const message = error instanceof InvitationServiceError ? error.message : 'تعذر حفظ الدعوة. لم يتم تأكيد نجاح العملية.';
      setErrors([message]);
    } finally { setBusy(false); }
  }

  async function copyLink() {
    if (!shareUrl) return;
    try { await navigator.clipboard.writeText(shareUrl); setNotice('تم نسخ رابط الدعوة.'); }
    catch { setNotice('تعذر النسخ التلقائي؛ انسخوا الرابط من الحقل.'); }
  }

  if (gate === 'checking') return <div className="gate-screen"><span className="loader-dot" /> جارٍ التحقق من صلاحية الفريق…</div>;
  if (gate !== 'allowed') return <main className="blocked-editor">
    <section className="auth-card"><span className="auth-symbol" aria-hidden="true">✎</span><h1>{gate === 'unconfigured' ? 'لوحة الفريق غير مفعّلة' : 'يلزم تسجيل دخول الفريق'}</h1><p>{gate === 'unconfigured' ? 'يحتاج المحرر إلى Supabase مستقل وتسجيل دخول للفريق قبل حفظ الدعوات.' : 'هذه الصفحة مخصصة لأعضاء فريق مودة.'}</p><a className="button button-primary" href={appPath('/admin/')}>الانتقال إلى دخول الفريق</a></section>
  </main>;

  return <>
    <SiteHeader />
    <main className="editor-page">
      <div className="editor-page-heading page-container"><div><span className="eyebrow">مساحة الفريق</span><h1>محرر الدعوات</h1><p>أدخلوا بيانات المناسبة المتوفرة؛ الحقول الفارغة لا تظهر في الدعوة.</p></div><a className="button button-outline" href={appPath('/templates/')}>تصفح القوالب</a></div>
      <div className="editor-workspace page-container">
        <form className="editor-form" onSubmit={save}>
          <section className="form-section">
            <div className="form-section-title"><span>١</span><div><h2>اختيار القالب والمناسبة</h2><p>اختاروا القالب المناسب لنوع الدعوة.</p></div></div>
            <label>نوع المناسبة<select value={draft.occasion} onChange={event => changeOccasion(event.target.value as Occasion)}>
              {siteConfig.categories.filter(category => category.id !== 'all').map(category => <option key={category.id} value={category.id}>{category.label}</option>)}
            </select></label>
            <label>القالب<select value={selectedTemplate.id} onChange={event => changeTemplate(event.target.value)}>
              {templatesForOccasion.map(template => <option key={template.id} value={template.id}>{template.name}</option>)}
            </select></label>
          </section>

          {draft.occasion === 'newborn' || draft.occasion === 'birthday' ? <section className="form-section">
            <div className="form-section-title"><span>٢</span><div><h2>الاسم والترحيب</h2><p>تظهر هذه التفاصيل على قالب المناسبة.</p></div></div>
            <label>{draft.occasion === 'newborn' ? 'اسم المولود بالعربية' : 'اسم صاحب عيد الميلاد بالعربية'}<input value={draft.childNameAr} onChange={event => change('childNameAr', event.target.value)} /></label>
            <label>الاسم بالإنجليزية <span className="optional-label">اختياري</span><input dir="auto" value={draft.childNameEn} onChange={event => change('childNameEn', event.target.value)} /></label>
            <label>اسم العائلة أو المضيف <span className="optional-label">اختياري</span><input value={draft.hostName} onChange={event => change('hostName', event.target.value)} /></label>
          </section> : <section className="form-section">
            <div className="form-section-title"><span>٢</span><div><h2>الأسماء</h2><p>اكتبوا الأسماء كما تريدون ظهورها في الدعوة.</p></div></div>
            <div className="form-two-columns">
              <label>اسم العريس بالعربية<input value={draft.groomNameAr} onChange={event => change('groomNameAr', event.target.value)} /></label>
              <label>اسم العروس بالعربية<input value={draft.brideNameAr} onChange={event => change('brideNameAr', event.target.value)} /></label>
              <label>اسم العريس بالإنجليزية <span className="optional-label">اختياري</span><input dir="auto" value={draft.groomNameEn} onChange={event => change('groomNameEn', event.target.value)} /></label>
              <label>اسم العروس بالإنجليزية <span className="optional-label">اختياري</span><input dir="auto" value={draft.brideNameEn} onChange={event => change('brideNameEn', event.target.value)} /></label>
            </div>
          </section>}

          <section className="form-section">
            <div className="form-section-title"><span>٣</span><div><h2>موعد ومكان المناسبة</h2><p>أضيفوا فقط التفاصيل المؤكدة.</p></div></div>
            <div className="form-two-columns">
              <label>التاريخ<input type="date" value={draft.eventDate} onChange={event => change('eventDate', event.target.value)} /></label>
              <label>الوقت<input type="time" value={draft.eventTime} onChange={event => change('eventTime', event.target.value)} /></label>
              <label>المنطقة الزمنية <span className="optional-label">للتاريخ والعد التنازلي</span><select value={draft.timeZone} onChange={event => change('timeZone', event.target.value)}><option value="">اختروا المنطقة الزمنية</option><option value="Asia/Damascus">دمشق</option><option value="Asia/Beirut">بيروت</option><option value="Asia/Baghdad">بغداد</option><option value="Asia/Riyadh">الرياض</option><option value="Asia/Dubai">دبي</option><option value="Europe/London">لندن</option><option value="UTC">UTC</option></select></label>
              <label>اسم المكان <span className="optional-label">اختياري</span><input value={draft.venueName} onChange={event => change('venueName', event.target.value)} /></label>
              <label>العنوان <span className="optional-label">اختياري</span><input value={draft.address} onChange={event => change('address', event.target.value)} /></label>
              <label className="span-two">رابط الموقع على الخريطة <span className="optional-label">اختياري — HTTPS</span><input type="url" dir="ltr" placeholder="https://maps.google.com/…" value={draft.mapUrl} onChange={event => change('mapUrl', event.target.value)} /></label>
            </div>
          </section>

          <section className="form-section">
            <div className="form-section-title"><span>٤</span><div><h2>نص الدعوة والعائلة</h2><p>اتركوا الحقول فارغة إذا لم ترغبوا بظهورها.</p></div></div>
            <label>عبارة الترحيب <span className="optional-label">اختياري</span><input value={draft.welcomeLine} onChange={event => change('welcomeLine', event.target.value)} /></label>
            <label>نص الدعوة <span className="optional-label">اختياري</span><textarea rows={3} value={draft.invitationText} onChange={event => change('invitationText', event.target.value)} /></label>
            <label>آية أو عبارة <span className="optional-label">اختياري</span><textarea rows={2} value={draft.verse} onChange={event => change('verse', event.target.value)} /></label>
            {(draft.occasion === 'wedding' || draft.occasion === 'engagement') && <div className="form-two-columns">
              <label>عائلة العريس <span className="optional-label">اختياري</span><input value={draft.groomParents} onChange={event => change('groomParents', event.target.value)} /></label>
              <label>عائلة العروس <span className="optional-label">اختياري</span><input value={draft.brideParents} onChange={event => change('brideParents', event.target.value)} /></label>
              <label className="span-two">ختام العائلتين <span className="optional-label">اختياري</span><input value={draft.closingFamilies} onChange={event => change('closingFamilies', event.target.value)} /></label>
            </div>}
            <label>ملاحظة الختام <span className="optional-label">اختياري</span><input value={draft.closingNote} onChange={event => change('closingNote', event.target.value)} /></label>
          </section>

          <section className="form-section">
            <div className="form-section-title"><span>٥</span><div><h2>برنامج المناسبة</h2><p>يمكنكم إضافة فقرات أو حذفها.</p></div></div>
            {draft.program.map((item, index) => <div className="program-item" key={item.id}><label>الوقت<input type="time" value={item.time} onChange={event => change('program', draft.program.map(row => row.id === item.id ? { ...row, time: event.target.value } : row))} /></label><label>الفقرة<input value={item.title} onChange={event => change('program', draft.program.map(row => row.id === item.id ? { ...row, title: event.target.value } : row))} /></label><button className="remove-row" type="button" aria-label={`حذف الفقرة ${index + 1}`} onClick={() => change('program', draft.program.filter(row => row.id !== item.id))}>×</button></div>)}
            <button className="button button-add-row" type="button" onClick={() => change('program', [...draft.program, { id: crypto.randomUUID(), time: '', title: '' }])}>+ إضافة فقرة</button>
            <label>تنويهات إضافية <span className="optional-label">سطر لكل تنويه</span><textarea rows={3} value={draft.notes.join('\n')} onChange={event => change('notes', event.target.value.split('\n').map(line => line.trim()).filter(Boolean))} /></label>
          </section>

          <section className="form-section">
            <div className="form-section-title"><span>٦</span><div><h2>اللمسات الأخيرة</h2><p>تتغير المعاينة حسب ما يدعمه القالب.</p></div></div>
            <div className="form-two-columns">
              <label>نوع الخط<select value={draft.fontFamily} onChange={event => change('fontFamily', event.target.value as InvitationDraft['fontFamily'])}>{fontChoices.map(font => <option key={font} value={font}>{font}</option>)}</select></label>
              <label className="color-field">اللون المميز<input type="color" value={draft.accentColor} onChange={event => change('accentColor', event.target.value)} /></label>
              <label className="span-two">رابط الموسيقى <span className="optional-label">اختياري — YouTube</span><input type="url" dir="ltr" placeholder="https://youtube.com/watch?v=…" value={draft.musicUrl} onChange={event => change('musicUrl', event.target.value)} /></label>
            </div>
          </section>

          {errors.length > 0 && <div className="form-error-box" role="alert">{errors.map(error => <p key={error}>{error}</p>)}</div>}
          {notice && <div className="form-success-box" role="status">{notice}</div>}
          {shareUrl && <div className="published-link-box"><label>رابط الدعوة المنشور<input readOnly value={shareUrl} dir="ltr" /></label><div><button type="button" className="button button-secondary" onClick={() => void copyLink()}>نسخ الرابط</button><a className="button button-primary" href={whatsappHref(`دعوتكم جاهزة للمشاركة: ${shareUrl}`)} target="_blank" rel="noreferrer">مشاركة عبر واتساب ↗</a></div></div>}
          {!isSupabaseConfigured && <div className="notice-box notice-warning"><strong>الحفظ غير متاح في هذه النسخة</strong><span>يمكن تعديل الحقول ومعاينة القالب. لا يتم إنشاء رابط دعوة دائم حتى يُربط مشروع Supabase.</span></div>}
          <button className="button button-primary button-wide save-invitation" disabled={busy || !isSupabaseConfigured}>{busy ? 'جارٍ الحفظ…' : saved ? 'حفظ التعديلات' : 'حفظ الدعوة ونشر الرابط'}</button>
          <p className="editor-footnote">لن تُرسل البيانات إلى واتساب أو إلى ضيوفكم إلا عند الضغط على زر المشاركة.</p>
        </form>

        <aside className="editor-preview-pane">
          <div className="preview-pane-heading"><div><span className="eyebrow">معاينة مباشرة</span><h2>{selectedTemplate.name}</h2></div><a href={appPath(selectedTemplate.localPreview)} target="_blank" rel="noreferrer" aria-label="فتح المعاينة بصفحة مستقلة">↗</a></div>
          <div className="editor-iframe-frame"><iframe title={`معاينة قالب ${selectedTemplate.name}`} src={frameUrl} allow="autoplay; fullscreen" loading="lazy" /></div>
          <p className="preview-caption-note">تُشغّل بعض القوالب الصوت أو الفيديو بعد تفاعل المستخدم. المعاينة تعرض مشاهد القالب الكاملة.</p>
          {draft.eventDate && <div className="preview-date-note"><span>التاريخ المدخل</span><strong>{formatDateArabic(draft.eventDate)}</strong>{draft.eventTime && <small>الساعة {draft.eventTime}</small>}</div>}
        </aside>
      </div>
    </main>
    <SiteFooter />
  </>;
}
