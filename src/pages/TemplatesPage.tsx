import { useMemo, useState } from 'react';
import { appPath, siteConfig } from '../config/site';
import type { TemplateCategory } from '../config/site';
import { SiteFooter, SiteHeader, WhatsAppFloat } from '../components/SiteShell';
import { TemplateCard } from '../components/TemplateCard';

export function TemplatesPage() {
  const showEnhanced = siteConfig.showEnhancedTemplates;
  const [category, setCategory] = useState<'all' | TemplateCategory>('all');
  const [version, setVersion] = useState<'all' | 'new' | 'original'>('all');
  const templates = useMemo(() => siteConfig.catalogTemplates.filter(item =>
    (category === 'all' || item.category === category) && (version === 'all' || item.variant === version),
  ), [category, version]);
  const versionCounts = {
    all: siteConfig.catalogTemplates.length,
    new: siteConfig.catalogTemplates.filter(item => item.variant === 'new').length,
    original: siteConfig.catalogTemplates.filter(item => item.variant === 'original').length,
  };
  const heroCopy = showEnhanced
    ? 'لكل تصميم نسختان مستقلتان: نسخة سابقة ونسخة محسنة باسم «قالب محسن». افتحوا معاينة أي نسخة أو تواصلوا معنا لطلبها.'
    : 'استعرضوا التصاميم المتاحة، افتحوا المعاينة الحية، أو تواصلوا معنا لطلب القالب المناسب لمناسبتكم.';
  const heroCount = showEnhanced
    ? `${siteConfig.templates.length} تصميمًا × نسختين = ${siteConfig.catalogTemplates.length} قالبًا مستقلًا`
    : `${siteConfig.catalogTemplates.length} قالبًا جاهزًا للمعاينة`;
  return <>
    <SiteHeader active="/templates/" />
    <main className="catalog-page">
      <section className="catalog-hero"><div className="page-container"><span className="eyebrow">معرض مودة</span><h1>شاهدوا القوالب<br /><em>حيّةً قبل الاختيار</em></h1><p>{heroCopy}</p><div className="catalog-count"><span>✳</span> {heroCount}</div></div></section>
      <section className="catalog-content page-container">
        {showEnhanced && <div className="filter-row filter-row-versions" role="group" aria-label="تصفية القوالب حسب النسخة">
          {([
            ['all', `كل النسخ (${versionCounts.all})`],
            ['new', `قوالب مودة المحسنة (${versionCounts.new})`],
            ['original', `النسخ السابقة (${versionCounts.original})`],
          ] as const).map(([id, label]) => <button key={id} className={`filter-chip ${version === id ? 'selected' : ''}`} onClick={() => setVersion(id)} aria-pressed={version === id}>{label}</button>)}
        </div>}
        <div className="filter-row" role="group" aria-label="تصفية القوالب حسب المناسبة">
          {siteConfig.categories.map((item) => <button key={item.id} className={`filter-chip ${category === item.id ? 'selected' : ''}`} onClick={() => setCategory(item.id)} aria-pressed={category === item.id}>{item.label}</button>)}
        </div>
        {templates.length > 0 ? <div className="template-grid">{templates.map(template => <TemplateCard key={template.id} template={template} />)}</div> : <div className="empty-catalog"><span aria-hidden="true">✧</span><h2>لا توجد قوالب لهذه المناسبة حتى الآن</h2><p>القائمة تعرض القوالب التي نملك ملفاتها ضمن مصادر المشروع.</p></div>}
        <div className="catalog-order"><div><span>وجدتم التصميم المناسب؟</span><h2>نتابع معكم عبر واتساب</h2></div><a className="button button-primary" href={`${appPath('/')}#pricing`}>تفاصيل الخدمة <span aria-hidden="true">↗</span></a></div>
      </section>
    </main>
    <SiteFooter /><WhatsAppFloat />
  </>;
}
