"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-blue-600/30">
              🥋
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">JudoManager</span>
              <span className="text-xs bg-blue-500/10 text-blue-400 font-bold px-2 py-0.5 rounded-md border border-blue-500/20 mr-2">SaaS</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#features" className="hover:text-blue-400 transition-colors">المميزات</a>
            <a href="#pricing" className="hover:text-blue-400 transition-colors">الخطط والأسعار</a>
            <a href="#qr-demo" className="hover:text-blue-400 transition-colors">بطاقات الـ QR</a>
            <a href="#faq" className="hover:text-blue-400 transition-colors">الأسئلة الشائعة</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-all border border-slate-800"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-105 transition-all"
            >
              تجربة مجانية (14 يوم)
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-8 animate-pulse">
            <span>✨ المنصة الأولى المخصصة لأندية الرياضات القتالية بالسوق الجزائري</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-tight max-w-5xl mx-auto">
            حول إدارة ناديك من الدفاتر التقليدية إلى{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300">
              نظام رقمي ذكي احترافي
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            منصة متكاملة لتنظيم اللاعبين، متابعة الحضور والغياب، الاشتراكات والمدفوعات، الأحزمة والاختبارات، البطولات، وبطاقات الـ QR الذكية للأولياء والمدربين.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-lg shadow-xl shadow-blue-600/30 hover:scale-105 transition-all flex items-center justify-center gap-3"
            >
              <span>🚀</span> ابدأ التجربة المجانية الآن
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              <span>💻</span> استعراض لوحة التحكم (Demo)
            </Link>
          </div>

          {/* Key Metrics Strip */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto border-t border-slate-800/80 pt-10">
            <div>
              <span className="block text-3xl sm:text-4xl font-black text-white">100%</span>
              <span className="text-xs sm:text-sm text-slate-400 font-medium">دعم الكامل للغة العربية و RTL</span>
            </div>
            <div>
              <span className="block text-3xl sm:text-4xl font-black text-blue-400">&lt; 1 دقيقة</span>
              <span className="text-xs sm:text-sm text-slate-400 font-medium">لتسجيل حضور الحصة التدريبية</span>
            </div>
            <div>
              <span className="block text-3xl sm:text-4xl font-black text-indigo-400">QR Code</span>
              <span className="text-xs sm:text-sm text-slate-400 font-medium">هوية رقمية آمنة لكل لاعب</span>
            </div>
            <div>
              <span className="block text-3xl sm:text-4xl font-black text-teal-400">تلقائي</span>
              <span className="text-xs sm:text-sm text-slate-400 font-medium">تذكيرات انتهاء الاشتراكات</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 bg-slate-900/50 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-blue-400 tracking-wider uppercase mb-2">مميزات المنصة</h2>
            <p className="text-3xl sm:text-4xl font-black text-white">كل ما يحتاجه مدير النادي والمدرب في مكان واحد</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🥋"
              title="إدارة شاملة للاعبين"
              desc="ملف شخصي ورياضي متكامل لكل لاعب يتضمن الحزام الحالي، المجموعة، الفئة العمرية، الوزن، وبيانات ولي الأمر."
            />
            <FeatureCard
              icon="⏱️"
              title="حضور وغياب سريع"
              desc="تسجيل حضور المجموعة كاملة بنقرة واحدة من الهاتف أو الكمبيوتر مع إحصائيات الغياب وتنبيهات الغياب المتكرر."
            />
            <FeatureCard
              icon="💰"
              title="متابعة الاشتراكات والمدفوعات"
              desc="تتبع حالة الدفع، تاريخ بداية ونهاية الاشتراك، وتوليد تذكيرات فورية للأولياء قبل الانتهاء بـ 7 أيام."
            />
            <FeatureCard
              icon="🟨"
              title="نظام الأحزمة والاختبارات"
              desc="تخصيص مستويات الأحزمة حسب الرياضة (جودو، كاراتيه، تايكواندو)، إنشاء دورات الاختبارات وترقية الناجحين تلقائياً."
            />
            <FeatureCard
              icon="📱"
              title="بطاقة الـ QR والهوية الرقمية"
              desc="كود فريد وبطاقة قابلة للطباعة أو العرض على الهاتف تضمن سلامة أطفال النادي مع أزرار الاتصال بالطوارئ."
            />
            <FeatureCard
              icon="📊"
              title="تقارير مالية ورياضية"
              desc="إحصائيات دقيقة حول مداخيل النادي، نسبة الحضور، عدد المشاركين في البطولات والميداليات المحققة."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-blue-400 tracking-wider uppercase mb-2">خطط الاشتراك</h2>
            <p className="text-3xl sm:text-4xl font-black text-white">أسعار بسيطة وشفافة تتماشى مع حجم ناديك</p>

            {/* Toggle Billing */}
            <div className="mt-8 inline-flex items-center bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  billingCycle === "monthly" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
                }`}
              >
                دفع شهري
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  billingCycle === "yearly" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
                }`}
              >
                <span>دفع سنوي</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full border border-emerald-500/30">خصم 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {/* Basic Plan */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">الخطة الأساسية (Basic)</h3>
                <p className="text-slate-400 text-sm mb-6">مناسبة للأندية والقاعات الصغيرة</p>
                <div className="mb-6">
                  <span className="text-4xl font-black text-white">
                    {billingCycle === "monthly" ? "3,500 دج" : "33,000 دج"}
                  </span>
                  <span className="text-slate-400 text-xs font-semibold"> /{billingCycle === "monthly" ? "شهرياً" : "سنوياً"}</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  <PlanFeature text="حتى 60 لاعب مسجل" />
                  <PlanFeature text="إدارة اللاعبين والحضور والغياب" />
                  <PlanFeature text="تتبع الاشتراكات والمدفوعات" />
                  <PlanFeature text="بطاقة الـ QR الرقمية" />
                  <PlanFeature text="حساب مدرب واحد + مدير النادي" />
                </ul>
              </div>
              <Link
                href="/register?plan=basic"
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white text-center font-bold rounded-xl transition-all border border-slate-700"
              >
                تجربة مجانية 14 يوم
              </Link>
            </div>

            {/* Pro Plan (Featured) */}
            <div className="bg-gradient-to-b from-blue-900/40 to-slate-900 p-8 rounded-3xl border-2 border-blue-500 flex flex-col justify-between shadow-2xl shadow-blue-900/30 relative">
              <div className="absolute -top-4 right-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-black px-4 py-1 rounded-full shadow-lg">
                الأكثر طلباً ⭐
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">الخطة الاحترافية (Pro)</h3>
                <p className="text-slate-300 text-sm mb-6">مناسبة للأندية المتوسطة والكبيرة</p>
                <div className="mb-6">
                  <span className="text-4xl font-black text-white">
                    {billingCycle === "monthly" ? "6,500 دج" : "62,000 دج"}
                  </span>
                  <span className="text-slate-300 text-xs font-semibold"> /{billingCycle === "monthly" ? "شهرياً" : "سنوياً"}</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-200 mb-8">
                  <PlanFeature text="عدد غير محدود من اللاعبين" />
                  <PlanFeature text="كل مميزات الخطة الأساسية" />
                  <PlanFeature text="إدارة الأحزمة والاختبارات والترقيات" />
                  <PlanFeature text="إدارة البطولات والنتائج والميداليات" />
                  <PlanFeature text="حسابات متعددة للمدربين والأولياء" />
                  <PlanFeature text="تقارير مالية ورياضية متقدمة" />
                </ul>
              </div>
              <Link
                href="/register?plan=pro"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-center font-black rounded-xl transition-all shadow-lg shadow-blue-600/30"
              >
                ابدأ التجربة الاحترافية مجاناً
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">الرابطة / الجمعيات</h3>
                <p className="text-slate-400 text-sm mb-6">خصيصاً للرابطات والولائيات والمجمعات الرياضية</p>
                <div className="mb-6">
                  <span className="text-3xl font-black text-white">حسب الطلب</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  <PlanFeature text="ربط عدة فروع وأندية متعددة" />
                  <PlanFeature text="دومين وتطبيق خاص باسم النادي" />
                  <PlanFeature text="دعم وتدريب مباشر للمدربين" />
                  <PlanFeature text="نسخ احتياطي يومي مخصص" />
                </ul>
              </div>
              <a
                href="https://wa.me/213550000000"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white text-center font-bold rounded-xl transition-all border border-slate-700"
              >
                تواصل معنا للتخصيص
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-slate-900/40 border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-blue-400 tracking-wider uppercase mb-2">الأسئلة الشائعة</h2>
            <p className="text-3xl font-black text-white">كل ما تحتاجه لإصدار قرارك بثقة</p>
          </div>

          <div className="space-y-4">
            <FaqItem
              index={1}
              question="كيف تمكّن المنصة أولياء الأمور من متابعة أبنائهم؟"
              answer="يحصل ولي الأمر على حساب خاص أو بطاقة QR يرى من خلالها حضور الطفل، حالة الاشتراك، تاريخ الاختبار القادم، وملاحظات المدرب بكل خصوصية وأمان."
              activeFaq={activeFaq}
              setActiveFaq={setActiveFaq}
            />
            <FaqItem
              index={2}
              question="هل يدعم التطبيق العمل على الهاتف الذكي والكمبيوتر؟"
              answer="نعم، المنصة مصممة بتجاوب كامل (Mobile First). يستطيع المدرب تسجيل الحضور في الصالة من هاتفه مباشرة في أقل من دقيقة."
              activeFaq={activeFaq}
              setActiveFaq={setActiveFaq}
            />
            <FaqItem
              index={3}
              question="هل بيانات النادي واللاعبين محمية ومفصولة؟"
              answer="نعم، المنصة تعمل بنظام Multi-Tenant آمن جداً. بيانات كل نادٍ مفصولة بالكامل ولا يمكن لأي طرف آخر الاطلاع عليها."
              activeFaq={activeFaq}
              setActiveFaq={setActiveFaq}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-white font-black text-xl">
            <span>🥋</span> JudoManager SaaS
          </div>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            النظام الرقمي المتكامل لإدارة أندية الجودو والفنون القتالية والرياضات الفردية والجماعية.
          </p>
          <div className="text-xs text-slate-600">
            جميع الحقوق محفوظة © 2026 JudoManager SaaS
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition-all hover:transform hover:-translate-y-1">
      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-3xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function PlanFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="text-blue-400 font-bold text-base">✓</span>
      <span>{text}</span>
    </li>
  );
}

function FaqItem({
  index,
  question,
  answer,
  activeFaq,
  setActiveFaq,
}: {
  index: number;
  question: string;
  answer: string;
  activeFaq: number | null;
  setActiveFaq: (i: number | null) => void;
}) {
  const isOpen = activeFaq === index;
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
      <button
        onClick={() => setActiveFaq(isOpen ? null : index)}
        className="w-full p-6 text-right font-bold text-white flex justify-between items-center gap-4 hover:bg-slate-800/50 transition-colors"
      >
        <span>{question}</span>
        <span className="text-blue-400 font-mono text-xl">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-slate-800/50 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
}
