"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 p-8 rounded-3xl border border-slate-800 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-red-600/20 text-red-400 rounded-full flex items-center justify-center text-3xl mx-auto font-black">
            ⚠️
          </div>
          <h2 className="text-2xl font-black text-white">حدث خطأ مؤقت في النظام</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            تمت إعادة ضبط ذاكرة المؤقتة. اضغط أسفله لإعادة التشغيل الفوري.
          </p>
          <div className="space-y-2 pt-2">
            <button
              onClick={() => reset()}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs shadow-lg transition-all"
            >
              إعادة التحميل الآن 🔄
            </button>
            <Link
              href="/dashboard"
              className="block w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl text-xs"
            >
              الذهاب للوحة التحكم ➔
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
