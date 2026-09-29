import { useMemo } from 'react';
import { appPath, publicAsset, siteConfig, whatsappHref } from '../config/site';
import { SiteFooter, SiteHeader, SectionHeading, WhatsAppFloat, ArrowMark } from '../components/SiteShell';
import { TemplateCard } from '../components/TemplateCard';

const featuredIds = ['wedding-temp-bab', 'wedding-temp-garden', 'wedding-temp-ring', 'wedding-temp-reverie', 'wedding-temp-disney', 'teddy', 'clouds', 'wedding-temp-ivory-palace'];

export function HomePage() {
  const featured = useMemo(() => {
    const byId = new Map(siteConfig.templates.map(template => [template.id, template]));
    return featuredIds.map(id => byId.get(id)).filter((item) => item !== undefined);
  }, []);

  return <>
    <SiteHeader active="/" />
    <main>
      <section className="hero-section">
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <div className="hero-inner page-container">
          <div className="hero-copy">
            <span className="eyebrow hero-eyebrow"><span className="eyebrow-dot" />{siteConfig.copy.heroEyebrow}</span>
            <h1>{siteConfig.copy.heroTitle.split('\n').map((line, i) => <span key={i}>{line} </span>)}</h1>
            <p>{siteConfig.copy.heroDescription}</p>
            <div className="hero-actions">
              <a className="button button-primary" href={appPath('/templates/')}>شاهدوا القوالب <ArrowMark /></a>
              <a className="button button-outline" href={whatsappHref()} target="_blank" rel="noreferrer">تواصلوا معنا</a>
            </div>
            <div className="hero-note"><span className="hero-sparkle" aria-hidden="true">✳</span><span>خدمة واحدة — <strong>{siteConfig.price.display}</strong></span></div>
          </div>
          <div className="hero-art" aria-label="معاينة من القوالب المتاحة">
            {featured.slice(0, 3).map((template, index) => <a
              className={`hero-template-frame hero-template-frame-${index + 1}`}
              key={template.id}
              href={appPath(template.localPreview)}
              aria-label={`عاين قالب ${template.name}`}
            >
              <img src={publicAsset(template.hero)} alt={`مشهد من قالب ${template.name}`} />
            </a>)}
            <div className="hero-flower flower-a" aria-hidden="true">✿</div>
            <div className="hero-flower flower-b" aria-hidden="true">✾</div>
            <span className="hero-decoration deco-star" aria-hidden="true">✧</span>
            <span className="hero-decoration deco-dot" aria-hidden="true">•</span>
          </div>
        </div>
        <a className="hero-scroll" href="#templates"><span /> اكتشفوا القوالب</a>
      </section>

      <section className="featured-section section-pad" id="templates">
        <div className="page-container">
          <SectionHeading eyebrow="قوالب لكل فرحة" title={siteConfig.copy.templatesHeading} description={siteConfig.copy.templatesDescription} />
          <div className="featured-heading-row">
            <div><span className="subsection-kicker">اختيارات من القوالب</span><h3>ابدؤوا التصميم الذي يشبهكم</h3></div>
            <a className="text-link" href={appPath('/templates/')}>كل القوالب <ArrowMark /></a>
          </div>
          <div className="featured-scroller">
            {featured.map(template => <TemplateCard key={template.id} template={template} compact />)}
          </div>
          <div className="section-center-link"><a className="button button-soft" href={appPath('/templates/')}>شاهدوا كل التصاميم <ArrowMark /></a></div>
        </div>
      </section>

      <section className="steps-section section-pad" id="how-it-works">
        <div className="page-container">
          <SectionHeading eyebrow="خطوات بسيطة" title={siteConfig.copy.howHeading} description={siteConfig.copy.howDescription} />
          <div className="steps-grid">
            {[
              { n: '١', icon: '✧', title: 'اختاروا قالبكم', text: 'استعرضوا التصاميم واختاروا ما يناسب مناسبتكم.' },
              { n: '٢', icon: '✎', title: 'أرسلوا التفاصيل', text: 'تواصلوا مع الفريق وأرسلوا الأسماء والموعد والتفاصيل المتوفرة.' },
              { n: '٣', icon: '↗', title: 'شاركوا دعوتكم', text: 'بعد تجهيزها، يصلكم رابط مخصص لدعوتكم لمشاركته مع الضيوف.' },
            ].map(step => <article className="step-card" key={step.n}>
              <span className="step-number">{step.n}</span><span className="step-icon" aria-hidden="true">{step.icon}</span>
              <h3>{step.title}</h3><p>{step.text}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className="editor-story-section section-pad">
        <div className="page-container editor-story-grid">
          <div className="editor-preview-wrap">
            <div className="editor-preview-card">
              <div className="editor-preview-top"><span className="preview-dots"><i /><i /><i /></span><span>نموذج لوحة تحرير الدعوة</span><span className="preview-live"><i /> معاينة</span></div>
              <div className="editor-preview-body">
                <div className="preview-controls">
                  <span className="preview-label">بيانات الدعوة</span>
                  <div className="preview-input active"><small>اسم العريس</small><strong>اسم العريس</strong></div>
                  <div className="preview-input"><small>اسم العروس</small><strong>اسم العروس</strong></div>
                  <div className="preview-input"><small>التاريخ</small><strong>أدخلوا التاريخ</strong></div>
                  <div className="preview-input"><small>الوقت والمكان</small><strong>حسب تفاصيل المناسبة</strong></div>
                  <div className="preview-fonts"><span>الخط</span><i>أميري</i><i className="font-active">تجوّال</i></div>
                </div>
                <div className="preview-invitation">
                  <span className="preview-garland" aria-hidden="true">✿ ✧ ✿</span>
                  <span className="preview-bismillah">بسم الله الرحمن الرحيم</span>
                  <span className="preview-caption">دعوة مناسبة</span>
                  <strong>فرحتكم<br />بأسمائكم</strong>
                  <span className="preview-line" />
                  <span className="preview-date">تفاصيل الموعد تظهر هنا</span>
                </div>
              </div>
              <div className="editor-preview-bottom"><span>شكل توضيحي لمساحة عمل الفريق</span><span className="preview-save">معاينة القالب</span></div>
            </div>
            <span className="editor-sticker" aria-hidden="true">✿</span>
          </div>
          <div className="editor-story-copy">
            <span className="eyebrow">لوحة عمل مودة</span>
            <h2>{siteConfig.copy.editorHeading}</h2>
            <p>{siteConfig.copy.editorDescription}</p>
            <ul className="check-list">
              <li><span>✓</span> تعديل الأسماء والبيانات المتوفرة</li>
              <li><span>✓</span> معاينة القالب أثناء الإعداد</li>
              <li><span>✓</span> تسليم رابط منفصل لكل دعوة</li>
            </ul>
            <span className="team-only-note">لوحة التحرير مخصصة لفريق مودة.</span>
          </div>
        </div>
      </section>

      <section className="share-section section-pad">
        <div className="page-container share-grid">
          <div className="share-copy">
            <span className="eyebrow">رابط واحد لمناسبتكم</span>
            <h2>دعوتكم تصل كما تخيلتموها</h2>
            <p>بعد إعداد الدعوة، يشارككم الفريق رابطها. يفتح الضيوف التصميم من الهاتف أو الحاسوب دون تنزيل تطبيق.</p>
            <a className="text-link" href={appPath('/templates/')}>تعرّفوا على القوالب <ArrowMark /></a>
          </div>
          <div className="share-art">
            <div className="share-phone">
              <div className="phone-notch" />
              <div className="phone-whatsapp-head"><span>واتساب</span><span>‹</span></div>
              <div className="phone-chat"><span className="chat-time">اليوم ١٢:٤٥ م</span><div className="chat-bubble"><span>يسعدنا دعوتكم لمشاركتنا فرحتنا 🤍</span><div className="chat-invite-card"><img src={publicAsset('/assets/templates/reverie-cover.jpg')} alt="معاينة بطاقة دعوة" /><span>دعوة مخصصة لمناسبتكم</span></div><small>رابط الدعوة</small><i>تم التسليم ✓✓</i></div></div>
              <div className="phone-compose"><span>اكتب رسالة</span><b>➤</b></div>
            </div>
            <span className="share-heart" aria-hidden="true">♡</span>
          </div>
        </div>
      </section>

      <section className="features-section section-pad">
        <div className="page-container">
          <SectionHeading eyebrow="تفاصيل تهمكم" title="من اختيار القالب إلى رابط الدعوة" description="نركّز على ما تحتاجونه لتجهيز دعوتكم ومشاركتها." />
          <div className="features-grid">
            {[
              { icon: '▤', title: 'قوالب متنوعة', text: 'تصاميم محلية للزفاف والخطوبة وأعياد الميلاد والمولود.' },
              { icon: '✎', title: 'تخصيص بشري', text: 'فريق مودة يجهّز الأسماء والتفاصيل التي تزودونه بها.' },
              { icon: '↗', title: 'رابط خاص', text: 'رابط مستقل للدعوة يمكنكم مشاركته مع ضيوفكم.' },
            ].map(feature => <article key={feature.title} className="feature-card"><span className="feature-icon" aria-hidden="true">{feature.icon}</span><h3>{feature.title}</h3><p>{feature.text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="pricing-section section-pad" id="pricing">
        <div className="page-container pricing-container">
          <SectionHeading eyebrow="سعر واضح" title={siteConfig.copy.priceHeading} description="خدمة واحدة لتجهيز دعوتكم من القوالب المتاحة." />
          <article className="price-card">
            <span className="price-spark" aria-hidden="true">✧</span>
            <span className="price-label">خدمة دعوة إلكترونية</span>
            <div className="price-amount">{siteConfig.price.display}</div>
            <p>{siteConfig.price.description}</p>
            <ul><li>اختيار قالب متاح</li><li>تخصيص بيانات المناسبة التي تزودوننا بها</li><li>رابط دعوة للمشاركة</li></ul>
            <a className="button button-primary price-cta" href={whatsappHref()} target="_blank" rel="noreferrer">اطلبوا عبر واتساب <ArrowMark /></a>
            <small>{siteConfig.copy.pricingDisclosure}</small>
          </article>
        </div>
      </section>

      <section className="faq-section section-pad">
        <div className="page-container faq-container">
          <SectionHeading eyebrow="معلومات تهمكم" title={siteConfig.copy.faqHeading} />
          <div className="faq-list">
            {siteConfig.copy.faqs.map((faq) => <details key={faq.question} className="faq-item"><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}
          </div>
        </div>
      </section>

      <section className="closing-section">
        <div className="page-container closing-inner"><span aria-hidden="true">✿</span><h2>خلّوا دعوتكم بداية فرحتكم</h2><p>اختاروا التصميم المناسب، وتواصلوا معنا لنجهز دعوتكم.</p><a className="button button-light" href={appPath('/templates/')}>ابدؤوا باختيار القالب <ArrowMark /></a></div>
      </section>
    </main>
    <SiteFooter /><WhatsAppFloat />
  </>;
}
