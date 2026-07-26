"use client";

import { useEffect } from "react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 font-sans">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl">
        <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center text-3xl mx-auto border border-blue-500/20">
          🥋
        </div>
        <h2 className="text-xl font-bold text-white">تحديث وجهات الصفحة</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          جاري تجميع وإعادة تنشيط الصفحة بنجاح.
        </p>
        <button
          onClick={() => reset()}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition-all"
        >
          إعادة التحميل
        </button>
      </div>
    </div>
  );
}
