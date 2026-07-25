"use client";

import Link from "next/link";

export default function Home() {
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
              <span className="text-xs bg-blue-500/10 text-blue-400 font-bold px-2 py-0.5 rounded-md border border-blue-500/20 mr-2">نظام إدارة الأندية</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 transition-all"
            >
              تسجيل الدخول للنادي
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden flex-1 flex items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-8">
            <span>🥋 النظام الرياضي الشامل لإدارة أندية الجودو والفنون القتالية</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight max-w-4xl mx-auto">
            منصة رقمية محترفة لتنظيم النادي، الحضور، الإشعارات والأحزمة
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            اختر النظام أو البوابة المخصصة لك للبدء مباشرة:
          </p>

          {/* Three Portals Selector Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-right">
            {/* Club Main Portal */}
            <div className="bg-slate-900/90 p-8 rounded-3xl border-2 border-blue-600 shadow-2xl shadow-blue-900/20 flex flex-col justify-between space-y-6 hover:scale-105 transition-all">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center mb-4">
                  🏢
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">النظام الأصلي للنادي</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  مخصص لمدير النادي والمدربين لإدارة كافة اللاعبين، تسجيل الحضور، والمدفوعات، وإرسال الإشعارات.
                </p>
              </div>

              <Link
                href="/dashboard"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-center text-sm shadow-lg shadow-blue-600/30 block"
              >
                دخول نظام النادي ➔
              </Link>
            </div>

            {/* Parent Portal */}
            <div className="bg-slate-900/90 p-8 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-2xl flex items-center justify-center mb-4">
                  👨‍👩‍👧
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">تطبيق أولياء الأمور</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  مخصص لأولياء الأمور لمتابعة حضور أبنائهم، مستواهم، البطولات المقررة وتلقي الإشعارات الفورية.
                </p>
              </div>

              <Link
                href="/parent"
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-center text-sm border border-slate-700 block"
              >
                دخول تطبيق أولياء الأمور ➔
              </Link>
            </div>

            {/* Athlete Portal */}
            <div className="bg-slate-900/90 p-8 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-2xl flex items-center justify-center mb-4">
                  🥋
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">تطبيق اللاعب الرياضي</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  مخصص للاعبين لمشاهدة بطاقتهم الرقمية، كود الـ QR، مواعيد الحصص، ومستوى حزامهم.
                </p>
              </div>

              <Link
                href="/athlete"
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-center text-sm border border-slate-700 block"
              >
                دخول تطبيق اللاعب ➔
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 text-slate-500 text-xs text-center">
        جميع الحقوق محفوظة © 2026 JudoManager App System
      </footer>
    </div>
  );
}
