# إعداد Supabase المستقل لمودة

لا تستخدم المشروع `room.chat`. هذه الخطوات تخص مشروع Mawada مستقلًا.

## حالة المشروع الحالية

المشروع `Mawada` هو `jverodiizjvbqrvshdnb` في منطقة West EU. طُبّق ترحيل الجداول، وفُعّل RLS على الجداول الثلاثة، ونُشرت الدالتان `invitation-admin` و`invitation-public`. صفحة Pages تستخدم أسرار GitHub Actions `VITE_SUPABASE_URL` و`VITE_SUPABASE_PUBLISHABLE_KEY`.

تتحقق `invitation-admin` من JWT على مستوى المنصة (`verify_jwt=true`) ثم تتحقق داخلها من عضوية الفريق. تُعطّل `invitation-public` تحقق JWT الخاص بالمنصة لأنها تستقبل المفتاح العام وتتحقق منه داخل الدالة عبر `withSupabase({ auth: 'publishable' })`.

الخطوة المتبقية لتفعيل المحرر هي إنشاء مستخدم الفريق من لوحة Auth وإضافة UUID الخاص به إلى `public.team_members`. التسجيل العام معطّل. بعد إنشاء المستخدم، أضفه بهذا الاستعلام:

   ```sql
   insert into public.team_members (user_id)
   select id from auth.users where email = 'TEAM_EMAIL';
   ```

إعداد Auth الحالي يحدد الموقع الأساسي على `https://mohamad-adib-tawil.github.io/Mawada-Project` ويجيز إعادة التوجيه إلى `/admin/`. بعد الدخول إلى لوحة المشروع، يجب جعل `https://mawada.pages.dev` الموقع الأساسي وإضافة `https://mawada.pages.dev/admin/` إلى عناوين إعادة التوجيه المسموحة مع إبقاء عنوان GitHub Pages ضمن القائمة. أسرار GitHub Actions محفوظة بالفعل، ويجب تشغيل سير عمل Pages بعد أي تغيير في إعدادات البناء.

## صلاحيات البيانات

- جداول القوالب والفريق والدعوات مفعّل عليها RLS، ولا توجد سياسات للعميل المباشر. صلاحيات الجداول محصورة بدور `service_role` الذي لا يصل إلى ملفات الواجهة.
- واجهة الموقع تستخدم مفتاحًا عامًا فقط. لا تضف `service_role` أو `secret key` إلى متغير يبدأ بـ`VITE_` أو إلى GitHub Pages.
- تنشئ دالة الإدارة دعوة ضمن فريق موثّق، وتفرض معرّف حفظ idempotent ورقم مراجعة عند التعديل. دالة الضيوف تقرأ الدعوات المنشورة فقط.
- كود CORS المحلي يسمح صراحةً بأصل GitHub Pages و`https://mawada.pages.dev` و`https://mawada-project.pages.dev` وlocalhost للاختبار، لكن النسخة المنشورة من الدالتين لم تُحدّث بعد. يجب إعادة نشر الدالتين لتفعيل الأصل الجديد؛ ويمكن إضافة أصول أخرى مفصولة بفاصلة في سر `ALLOWED_ORIGIN`.

## حدود النسخة الحالية

الدعوات العامة تقرأ من Supabase، وطلبات الإدارة تتطلب جلسة مستخدم وعضوية في `public.team_members`. قبل إضافة مستخدم الفريق وربطه، لا يمكن تسجيل الدخول إلى المحرر أو نشر الدعوات. لا توجد قاعدة محلية بديلة ولا يُعرض نجاح زائف.
