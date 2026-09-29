# إعداد Supabase المستقل لمودة

لا تستخدم المشروع `room.chat`. هذه الخطوات تخص مشروع Mawada مستقلًا.

## الإعداد المطلوب

1. أنشئ المشروع بعد اعتماد المؤسسة والتكلفة، واختر منطقة أوروبية قريبة عند إنشاء المشروع.
2. طبّق `supabase/migrations/20260929160226_initial_mawada_invitation_tables.sql` عبر Supabase SQL Editor أو `supabase db push`.
3. انشر الدالتين `invitation-admin` و`invitation-public` من مجلد `supabase/functions/`. تحتفظ `invitation-admin` بتحقق المنصة من JWT (`verify_jwt=true`) وتتحقق داخلها من عضوية الفريق أيضًا. تُعطّل `invitation-public` تحقق JWT الخاص بالمنصة لأنها تستقبل المفتاح العام وتتحقق منه داخل الدالة عبر `withSupabase({ auth: 'publishable' })`.
4. أنشئ مستخدم الفريق من لوحة Auth دون إتاحة التسجيل العام. أضف UUID الخاص به إلى `public.team_members`:

   ```sql
   insert into public.team_members (user_id)
   select id from auth.users where email = 'TEAM_EMAIL';
   ```

5. في إعدادات Auth أضف رابط إعادة التوجيه `https://mohamad-adib-tawil.github.io/Mawada-Project/admin/`، وحدد الموقع الأساسي على عنوان Pages أعلاه.
6. في GitHub Repository Settings → Secrets and variables → Actions خزّن `VITE_SUPABASE_URL` و`VITE_SUPABASE_PUBLISHABLE_KEY`، ثم شغّل workflow للنشر مجددًا.

## صلاحيات البيانات

- جداول القوالب والفريق والدعوات مفعّل عليها RLS، ولا توجد سياسات للعميل المباشر. صلاحيات الجداول محصورة بدور `service_role` الذي لا يصل إلى ملفات الواجهة.
- واجهة الموقع تستخدم مفتاحًا عامًا فقط. لا تضف `service_role` أو `secret key` إلى متغير يبدأ بـ`VITE_` أو إلى GitHub Pages.
- تنشئ دالة الإدارة دعوة ضمن فريق موثّق، وتفرض معرّف حفظ idempotent ورقم مراجعة عند التعديل. دالة الضيوف تقرأ الدعوات المنشورة فقط.
- إعدادات CORS الافتراضية تسمح بنطاق GitHub Pages الخاص بالمشروع وlocalhost للاختبار. اضبط سر `ALLOWED_ORIGIN` إذا تغير النطاق.

## حدود النسخة الحالية قبل هذا الإعداد

عند غياب أسرار Supabase، يبقى الموقع والمعرض والمعاينة والواجهة قابلة للعرض. تسجيل الفريق والنشر العام للدعوات لا يعملان؛ لا توجد قاعدة محلية بديلة ولا يُعرض نجاح زائف.
