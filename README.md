# Mawada

موقع عربي لعرض قوالب المناسبات وتجهيز دعوات إلكترونية مخصصة.

## تشغيل محلي

```sh
npm ci
npm run dev
```

يفتح المعرض من `/templates/`. لوحة الفريق من `/admin/` والمحرر من `/admin/editor/` بعد إعداد Supabase وتسجيل دخول عضو فريق. لمعاينة المحرر محليًا دون نشر دعوة يمكن استخدام `/admin/editor/?local-preview=1` في بيئة التطوير فقط.

## إعداد البيانات

عدّل `src/config/site-data.json` لتغيير النصوص العامة، الخدمة الوحيدة وسعرها، رابط واتساب، فئات القوالب، مسارات الصور، وروابط المعاينة. بيانات كل زبون تُحفظ في دعوته المنفصلة عند تفعيل الخلفية؛ لا تُكتب بيانات حقيقية ثابتة في ملفات الموقع.

## الحفظ ولوحة الفريق

يتطلب النشر العام إعداد مشروع Supabase منفصل، تطبيق ملفات `supabase/migrations` ونشر `invitation-admin` و`invitation-public`. أضف مستخدم الفريق في Supabase Auth ثم اربط `auth.users.id` يدويًا في `public.team_members`. لا يُستخدم مشروع Supabase الحالي `room.chat`.

لتفعيل الموقع بعد إعداد Supabase أضف أسرار GitHub Actions:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

الإعدادات التشغيلية وسياسة الوصول والخطوات التفصيلية في `docs/supabase-setup.md`.

## الاختبار والنشر

```sh
npm test
npm run build
```

يستخدم سير العمل في `.github/workflows/pages.yml` GitHub Pages وينشر الموقع إلى `https://mohamad-adib-tawil.github.io/Mawada-Project/` بعد تفعيل Pages للمستودع.
