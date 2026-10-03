import { appPath, publicAsset, siteConfig, whatsappHref, type TemplateDefinition } from '../config/site';
import { ArrowMark } from './SiteShell';

const categoryNames: Record<string, string> = {
  wedding: 'زفاف', engagement: 'خطوبة', birthday: 'عيد ميلاد', newborn: 'مولود', graduation: 'تخرج', event: 'مناسبة',
};

export function TemplateCard({ template, compact = false }: { template: TemplateDefinition; compact?: boolean }) {
  const previewPath = appPath(template.localPreview);
  const orderLink = whatsappHref(`مرحبًا، أود طلب خدمة دعوة إلكترونية باستخدام قالب «${template.name}»${template.variant === 'original' ? ' (النسخة السابقة)' : ''}.`);
  return (
    <article className={`template-card ${compact ? 'template-card-compact' : ''}`}>
      <a className="template-image-link" href={previewPath} aria-label={`معاينة قالب ${template.name}`}>
        <div className="template-image-wrap">
          {template.cover ? <img src={publicAsset(template.cover)} alt={`معاينة تصميم ${template.name}`} loading="lazy" /> : <div className="template-fallback">{template.name}</div>}
          <span className="template-open">معاينة <ArrowMark /></span>
        </div>
      </a>
      <div className="template-card-copy">
        <div className="template-title-row">
          <h3>{template.name}</h3>
          <div className="template-badges">
            {template.variant === 'original' && <span className="template-version-badge template-version-original">نسخة سابقة</span>}
            <span className="template-category">{categoryNames[template.category] ?? 'مناسبة'}</span>
          </div>
        </div>
        {!compact && <p>{template.description}</p>}
        <div className="template-actions">
          <a className="button button-secondary button-small" href={previewPath}>عاين القالب <ArrowMark /></a>
          <a className="button button-quiet button-small" href={orderLink} target="_blank" rel="noreferrer">اطلب عبر واتساب</a>
        </div>
      </div>
      <span className="template-source-note">{siteConfig.price.display} للخدمة</span>
    </article>
  );
}
