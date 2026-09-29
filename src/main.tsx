import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';

const EditorPage = lazy(() => import('./pages/EditorPage').then(module => ({ default: module.EditorPage })));
const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const InvitationPage = lazy(() => import('./pages/InvitationPage').then(module => ({ default: module.InvitationPage })));
const SignInPage = lazy(() => import('./pages/SignInPage').then(module => ({ default: module.SignInPage })));
const TemplatesPage = lazy(() => import('./pages/TemplatesPage').then(module => ({ default: module.TemplatesPage })));

const path = window.location.pathname.replace(/\/+$/, '') || '/';
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const relativePath = path.startsWith(basePath) ? path.slice(basePath.length) || '/' : path;

const page = relativePath.startsWith('/templates')
  ? <TemplatesPage />
  : relativePath.startsWith('/admin/editor')
    ? <EditorPage />
    : relativePath.startsWith('/admin')
      ? <SignInPage />
      : relativePath.startsWith('/invite')
        ? <InvitationPage />
        : <HomePage />;

createRoot(document.getElementById('root')!).render(
  <Suspense fallback={<main className="page-loading" lang="ar" dir="rtl">جارٍ تحميل الصفحة…</main>}>
    {page}
  </Suspense>,
);
