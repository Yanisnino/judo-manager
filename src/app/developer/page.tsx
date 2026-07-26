"use client";

import { useState } from "react";
import Link from "next/link";

export default function DeveloperPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Developer Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 p-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-600/30">
              💻
            </div>
            <div>
              <h1 className="font-black text-white text-lg leading-tight">بوابة المبرمج والتثبيت الرسمي</h1>
              <span className="text-xs text-blue-400 font-medium">JudoManager Developer & Distribution Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              الذهاب للوحة تحكم النادي ➔
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 my-4">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-8 rounded-3xl border border-blue-800/40 shadow-2xl space-y-4 text-center md:text-right relative overflow-hidden">
          <div className="absolute left-4 top-4 text-6xl opacity-10 font-black">🥋</div>
          <span className="px-3.5 py-1 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-full font-bold text-xs inline-block">
            المنصة الرسمية لإدارة أندية الجودو والفنون القتالية
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-snug">
            تثبيت وتشغيل نظام JudoManager للأندية والجمعيات الرياضية
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
            مرحباً بكم في صفحة المبرمج الرسمية. يمكنكم الآن تحميل وتثبيت النظام أوفلاين على حواسيب النادي، أو استخدامه مباشرة عبر الهواتف واللوحات الرقمية.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
            <button
              onClick={handleCopyLink}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <span>🔗</span> {copied ? "✓ تم نسخ رابط المنصة!" : "نسخ رابط التثبيت للأندية"}
            </button>
            <a
              href="https://wa.me/213550123456?text=السلام%20عليكم،%20أريد%20تثبيت%20نظام%20إدارة%20أندية%20الجودو"
              target="_blank"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
            >
              <span>💬</span> التواصل المباشر مع المبرمج (WhatsApp)
            </a>
          </div>
        </div>

        {/* Installation Package Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PC Installation Package */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-2xl flex items-center justify-center">
                🖥️
              </div>
              <h3 className="text-xl font-bold text-white">تثبيت النظام على أجهزة الكمبيوتر (PC)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                حزمة التثبيت المستقلة لأجهزة الويندوز داخل قاعة أو مكتب إدارة النادي. تعمل بدون حاجة لاتصال مستمر بالإنترنت.
              </p>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>الملف التنفيذي:</span>
                  <span className="font-mono text-blue-400 font-bold">تثبيت_وتشغيل_تطبيق_الجودو.vbs</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>نوع التشغيل:</span>
                  <span className="font-bold text-emerald-400">بنقرة واحدة (One-Click)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>دعم قاعدة البيانات:</span>
                  <span className="font-bold text-purple-400">Local JSON & IndexedDB</span>
                </div>
              </div>
            </div>

            <a
              href="/تثبيت_وتشغيل_التطبيق.bat"
              download
              className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs text-center border border-slate-700 block transition-all shadow-md mt-2"
            >
              📥 تحميل ملف تثبيت الويندوز المباشر (.bat)
            </a>
          </div>

          {/* Mobile Phone Package */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-bold text-2xl flex items-center justify-center">
                📱
              </div>
              <h3 className="text-xl font-bold text-white">تثبيت تطبيقات الهواتف (Android & iOS)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                تطبيقات PWA خفيفة وسريعة يتم تنزيلها كـ تطبيق أصلي على شاشة هواتف المدربين وأولياء الأمور بنقرة واحدة.
              </p>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>تطبيق الأولياء:</span>
                  <span className="font-mono text-emerald-400 font-bold">/parent</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>تطبيق اللاعبين:</span>
                  <span className="font-mono text-blue-400 font-bold">/athlete</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>طريقة التثبيت:</span>
                  <span className="font-bold text-amber-400">Add to Home Screen</span>
                </div>
              </div>
            </div>

            <Link
              href="/تثبيت_تطبيق_الأولياء.html"
              target="_blank"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs text-center block transition-all shadow-md shadow-emerald-600/20 mt-2"
            >
              📲 فتح صفحة تثبيت تطبيق الأولياء الهواتف
            </Link>
          </div>
        </div>

        {/* Step-by-Step Activation Guide */}
        <div className="bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <span>⚙️</span> خطوات تفعيل النظام لأي نادي جديد
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center">1</span>
              <h4 className="font-bold text-white text-sm">نسخ ملفات التثبيت</h4>
              <p className="text-slate-400 leading-relaxed">
                انسخ مجلد النظام أو ملف التثبيت على فلاشة USB وضعه في كمبيوتر النادي.
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center">2</span>
              <h4 className="font-bold text-white text-sm">التشغيل الأولي</h4>
              <p className="text-slate-400 leading-relaxed">
                اضغط مرتين على ملف التثبيت ليفتح النظام فوراً على محرك الأقراص المحلي.
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center">3</span>
              <h4 className="font-bold text-white text-sm">إدخال اللاعبين ومشاركة الرابط</h4>
              <p className="text-slate-400 leading-relaxed">
                يبدأ النادي بملء بياناته الخاصة وطباعة الكودبار ومشاركة رابط الأولياء عبر الواتساب.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Developer Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 p-6 text-center text-xs text-slate-400">
        منصة إدارة أندية الجودو والفنون القتالية © JudoManager SaaS - تطوير وبرمجة رسمية
      </footer>
    </div>
  );
}
