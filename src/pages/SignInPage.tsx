import { useState } from 'react';
import type { FormEvent } from 'react';
import { appPath, siteConfig } from '../config/site';
import { checkTeamAccess } from '../services/invitation-repository';
import { isSupabaseConfigured, supabase } from '../services/supabase';
import { BrandMark } from '../components/SiteShell';

export function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!supabase) return;
    setBusy(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (signInError) {
      setError('تعذر تسجيل الدخول بهذه البيانات. تحققوا منها أو تواصلوا مع مسؤول الفريق.');
      setBusy(false);
      return;
    }
    try {
      const allowed = await checkTeamAccess();
      if (!allowed) {
        await supabase.auth.signOut();
        setError('هذا الحساب غير مضاف إلى فريق مودة.');
        setBusy(false);
        return;
      }
      window.location.assign(appPath('/admin/editor/'));
    } catch {
      setError('تعذر التحقق من صلاحية الفريق. أعيدوا المحاولة لاحقًا.');
      setBusy(false);
    }
  }

  return <main className="auth-page">
    <a className="brand auth-brand" href={appPath('/')}><BrandMark /><span>{siteConfig.brand}</span></a>
    <section className="auth-card">
      <span className="auth-symbol" aria-hidden="true">✎</span>
      <span className="eyebrow">مساحة الفريق</span>
      <h1>دخول محرر الدعوات</h1>
      <p>تسجيل الدخول متاح لأعضاء فريق مودة المضافين يدويًا إلى النظام.</p>
      {!isSupabaseConfigured ? <div className="notice-box notice-warning"><strong>لم يتم تفعيل تسجيل الدخول بعد</strong><span>تحتاج لوحة الفريق إلى مشروع Supabase مستقل وإعداد عنوانه ومفتاحه العام. لا تتوفر بيانات اعتماد في هذه النسخة.</span></div> : <form className="auth-form" onSubmit={submit}>
        <label>البريد الإلكتروني<input type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} required /></label>
        <label>كلمة المرور<input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button-primary button-wide" disabled={busy}>{busy ? 'جارٍ التحقق…' : 'دخول الفريق'}</button>
      </form>}
      <a className="auth-back" href={appPath('/')}>العودة إلى الموقع</a>
    </section>
  </main>;
}
