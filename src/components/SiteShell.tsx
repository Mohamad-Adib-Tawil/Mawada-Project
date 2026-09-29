import { useState } from 'react';
import { appPath, siteConfig, whatsappHref } from '../config/site';

export function SiteHeader({ active = '' }: { active?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href={appPath('/')} aria-label="مودة — الصفحة الرئيسية">
          <span className="brand-mark" aria-hidden="true">م</span>
          <span>{siteConfig.brand}</span>
        </a>
        <button className="menu-toggle" aria-expanded={open} aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'} onClick={() => setOpen(value => !value)}>
          <span /><span /><span />
        </button>
        <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="القائمة الرئيسية">
          {siteConfig.navigation.map((item) => {
            const local = item.href.startsWith('/#') ? `${appPath('/')}#${item.href.slice(2)}` : appPath(item.href);
            return <a key={item.href} className={active === item.href ? 'active' : ''} href={local} onClick={() => setOpen(false)}>{item.label}</a>;
          })}
          <a className="team-link" href={appPath('/admin/')}>دخول الفريق</a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <a className="brand footer-brand" href={appPath('/')}><span className="brand-mark" aria-hidden="true">م</span><span>{siteConfig.brand}</span></a>
      <p>دعوات إلكترونية تليق بلحظاتكم الجميلة.</p>
      <div className="footer-links">
        <a href={appPath('/templates/')}>القوالب</a>
        <a href={appPath('/admin/')}>دخول الفريق</a>
        <a href={whatsappHref()}>تواصل عبر واتساب</a>
      </div>
      <small>© {new Date().getFullYear()} {siteConfig.brand}</small>
    </footer>
  );
}

export function WhatsAppFloat() {
  return <a className="whatsapp-float" href={whatsappHref()} target="_blank" rel="noreferrer" aria-label="تواصل مع مودة عبر واتساب"><span aria-hidden="true">◔</span></a>;
}

export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return <div className="section-heading">
    {eyebrow && <span className="eyebrow">{eyebrow}</span>}
    <h2>{title}</h2>
    {description && <p>{description}</p>}
  </div>;
}

export function ArrowMark() {
  return <span className="arrow-mark" aria-hidden="true">↗</span>;
}
