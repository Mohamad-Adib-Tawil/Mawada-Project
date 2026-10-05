import siteData from './site-data.json';

export type Occasion = 'wedding' | 'engagement' | 'birthday' | 'newborn' | 'graduation' | 'event';
export type TemplateCategory = Occasion | 'henna';

export interface TemplateDefinition {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  sourceRepo: string;
  referenceUrl: string;
  localPreview: string;
  cover: string;
  hero: string;
  sourcePath: string;
  variant?: 'new' | 'original';
}

/** مؤقت: أخفِ القوالب المحسّنة من المعرض والرئيسية. أعدها إلى true لإظهارها. */
export const SHOW_ENHANCED_TEMPLATES = false;

const sourceTemplates = siteData.templates as TemplateDefinition[];
const currentTemplates: TemplateDefinition[] = sourceTemplates.map((template) => ({
  ...template,
  name: `${template.name} قالب محسن`,
  variant: 'new',
}));
const originalVisualTemplates: TemplateDefinition[] = sourceTemplates.map((template) => ({
  ...template,
  id: `${template.id}-original`,
  name: template.name,
  description: SHOW_ENHANCED_TEMPLATES
    ? `التصميم السابق قبل تحديث الصور والهوية: ${template.description}`
    : template.description,
  localPreview: template.localPreview.replace('/templates/', '/templates-original/'),
  cover: template.cover.replace('/assets/templates/', '/assets/templates-original/'),
  hero: template.hero.replace('/assets/templates/', '/assets/templates-original/'),
  variant: 'original',
}));

export interface CatalogCategory {
  id: 'all' | TemplateCategory;
  label: string;
}

export const siteConfig = {
  ...siteData,
  basePath: import.meta.env.BASE_URL.replace(/\/$/, ''),
  showEnhancedTemplates: SHOW_ENHANCED_TEMPLATES,
  /** سجل المحرر يبقى على التصاميم الحالية حتى أثناء إخفاء المحسّنة من الواجهة العامة. */
  templates: currentTemplates,
  catalogTemplates: SHOW_ENHANCED_TEMPLATES
    ? currentTemplates.flatMap((template, index) => [
        template,
        originalVisualTemplates[index],
      ])
    : originalVisualTemplates,
  categories: siteData.categories as CatalogCategory[],
} as const;

export function appPath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.basePath}${normalized}` || '/';
}

export function publicAsset(path: string): string {
  const normalized = path.replace(/^\/+/, '');
  return `${siteConfig.basePath}/${normalized}`;
}

export function whatsappHref(message: string = siteConfig.whatsappMessage): string {
  const url = new URL(siteConfig.whatsappUrl);
  url.searchParams.set('text', message);
  return url.href;
}
