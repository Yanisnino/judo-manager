"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LocalAuthDb } from "@/lib/localAuthDb";

export default function RegisterPage() {
  const router = useRouter();
  const [clubName, setClubName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    LocalAuthDb.registerUser({
      name: ownerName,
      email: email || phone,
      phone,
      role: "owner",
      clubName,
    });

    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-lg w-full bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black text-white">
            <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-lg">🥋</span>
            JudoManager
          </Link>
          <h1 className="text-2xl font-bold text-white pt-2">تسجيل نادٍ جديد على الجهاز</h1>
          <p className="text-xs text-slate-400">سيتم إنشاء وتخزين حساب ناديك على جهازك مباشرة</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">اسم النادي / الجمعية</label>
            <input
              type="text"
              required
              placeholder="نادي أبطال الجودو"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-white text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">اسم مدير النادي</label>
              <input
                type="text"
                required
                placeholder="محمد بن سالم"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">رقم الهاتف</label>
              <input
                type="tel"
                required
                placeholder="0550123456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-white text-sm"
              />
            </div>
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? <span>جاري إعداد حساب النادي...</span> : <span>إنشاء وتخزين الحساب محلياً ➔</span>}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-800/80">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="text-blue-400 font-bold hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
