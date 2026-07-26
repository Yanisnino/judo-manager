import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-3xl border border-slate-700 text-center space-y-4 shadow-2xl">
        <div className="w-16 h-16 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center text-3xl mx-auto font-black">
          🔍
        </div>
        <h2 className="text-2xl font-black text-white">الصفحة غير موجودة</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          عذراً، الصفحة التي تبحث عنها غير متاحة أو تم تغيير مسارها.
        </p>
        <Link
          href="/dashboard"
          className="inline-block w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs shadow-lg transition-all"
        >
          العودة للوحة التحكم الرئيسية ➔
        </Link>
      </div>
    </div>
  );
}
