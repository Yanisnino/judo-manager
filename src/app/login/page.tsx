"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = Router();
  const [role, setRole] = useState<"owner" | "coach" | "parent">("owner");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black text-white">
            <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-lg">🥋</span>
            JudoManager
          </Link>

          <h1 className="text-2xl font-bold text-white pt-2">تسجيل الدخول للنظام</h1>
          <p className="text-xs text-slate-400">اختر نوع حسابك وأدخل بيانات الدخول الخاصة بك</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => setRole("owner")}
            className={`py-2 rounded-xl transition-all ${
              role === "owner" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            🏢 مدير النادي
          </button>
          <button
            type="button"
            onClick={() => setRole("coach")}
            className={`py-2 rounded-xl transition-all ${
              role === "coach" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            🥋 المدرب
          </button>
          <button
            type="button"
            onClick={() => setRole("parent")}
            className={`py-2 rounded-xl transition-all ${
              role === "parent" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            👨‍👩‍👧 ولي الأمر
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">البريد الإلكتروني / رقم الهاتف</label>
            <input
              type="text"
              required
              placeholder="example@club.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">كلمة المرور</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-white text-sm"
            />
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded bg-slate-950 border-slate-800 text-blue-600" />
              <span>تذكرني على هذا الجهاز</span>
            </label>
            <a href="#" className="hover:text-blue-400 transition-colors">نسيت كلمة المرور؟</a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <span>جاري تسجيل الدخول...</span> : <span>تسجيل الدخول ➔</span>}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-800/80">
          ليس لديك حساب بعد؟{" "}
          <Link href="/register" className="text-blue-400 font-bold hover:underline">
            إنشاء حساب جديد مجاناً
          </Link>
        </div>
      </div>
    </div>
  );
}

function Router() {
  return useRouter();
}
