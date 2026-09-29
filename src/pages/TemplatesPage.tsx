import { useMemo, useState } from 'react';
import { appPath, siteConfig } from '../config/site';
import type { TemplateCategory } from '../config/site';
import { SiteFooter, SiteHeader, WhatsAppFloat } from '../components/SiteShell';
import { TemplateCard } from '../components/TemplateCard';

export function TemplatesPage() {
  const [category, setCategory] = useState<'all' | TemplateCategory>('all');
  const templates = useMemo(() => category === 'all' ? siteConfig.templates : siteConfig.templates.filter(item => item.category === category), [category]);
  return <>
    <SiteHeader active="/templates/" />
    <main className="catalog-page">
      <section className="catalog-hero"><div className="page-container"><span className="eyebrow">معرض مودة</span><h1>شاهدوا القوالب<br /><em>حيّةً قبل الاختيار</em></h1><p>تصفّحوا التصاميم حسب مناسبتكم. افتحوا معاينة القالب، أو تواصلوا معنا لطلب تخصيصه.</p><div className="catalog-count"><span>✳</span> {siteConfig.templates.length} قالبًا من أصول المشروع المتاحة</div></div></section>
      <section className="catalog-content page-container">
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
