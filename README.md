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

الخلفية مربوطة بمشروع Supabase مستقل باسم Mawada (`jverodiizjvbqrvshdnb`)؛ طُبّق المخطط ونُشرت الدالتان `invitation-admin` و`invitation-public`، والتسجيل العام معطّل. لا يُستخدم مشروع Supabase الحالي `room.chat`.

أضيفت أسرار الربط إلى GitHub Actions وأعيد تشغيل نشر Pages. لإتاحة المحرر لأعضاء الفريق، أنشئ مستخدمًا من لوحة Supabase Auth ثم اربط `auth.users.id` يدويًا في `public.team_members` باستخدام الاستعلام الموضح في `docs/supabase-setup.md`. لا تفتح التسجيل العام.

أسماء أسرار GitHub Actions المستخدمة:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

الإعدادات التشغيلية وسياسة الوصول والخطوات التفصيلية في `docs/supabase-setup.md`.

## الاختبار والنشر

```sh
npm test
npm run build
```

يستخدم سير العمل في `.github/workflows/pages.yml` GitHub Pages وينشر الموقع إلى `https://mohamad-adib-tawil.github.io/Mawada-Project/` بعد تفعيل Pages للمستودع.

العنوان الأساسي على Cloudflare Pages هو `https://mawada.pages.dev/` من مشروع **Direct Upload** مستقل عن ربط Git. لتحديثه، ابنِ نسخة الجذر بمتغيري `VITE_SUPABASE_URL` و`VITE_SUPABASE_PUBLISHABLE_KEY` العامين مع `GITHUB_PAGES=false`، ثم انشر مجلد `dist` باستخدام `wrangler pages deploy dist --project-name mawada --branch main`. لا تضع مفتاح `service_role` أو رمز تحرير ضمن البناء. راجع `EXECUTION_STATUS.md` لحالة ربط النطاق الجديد مع Auth وEdge Functions قبل استخدام المحرر إنتاجيًا.
