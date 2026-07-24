"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [clubName, setClubName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sportType, setSportType] = useState("الجودو (Judo)");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black text-white">
            <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-lg">🥋</span>
            JudoManager
          </Link>
          <h1 className="text-2xl font-bold text-white pt-2">تسجيل نادٍ جديد (تجربة مجانية)</h1>
          <p className="text-xs text-slate-400">احصل على 14 يوم تجربة مجانية بكافة المميزات بدون بطاقة ائتمانية</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">الرياضة الأساسية</label>
              <select
                value={sportType}
                onChange={(e) => setSportType(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-white text-sm"
              >
                <option>الجودو (Judo)</option>
                <option>الكاراتيه (Karate)</option>
                <option>التايكواندو (Taekwondo)</option>
                <option>فنون قتالية مختلطة (MMA)</option>
                <option>رياضة أخرى</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">اسم مدير النادي / صاحب الحساب</label>
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
            <label className="block text-xs font-bold text-slate-400 mb-1.5">البريد الإلكتروني</label>
            <input
              type="email"
              required
              placeholder="club@example.com"
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? <span>جاري إنشاء الحساب وإعداد النادي...</span> : <span>تفعيل التجربة المجانية والبدء ➔</span>}
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
