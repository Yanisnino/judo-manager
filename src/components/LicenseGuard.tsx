"use client";

import { useState, useEffect } from "react";

const LICENSE_KEY_STORAGE = "judo_manager_active_license";

interface LicenseData {
  key: string;
  type: "trial" | "lifetime";
  activatedAt: number;
  expiresAt?: number;
  clubName: string;
}

export default function LicenseGuard({ children }: { children: React.ReactNode }) {
  const [isActivated, setIsActivated] = useState<boolean | null>(null);
  const [inputKey, setInputKey] = useState("");
  const [inputClub, setInputClub] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [licenseInfo, setLicenseInfo] = useState<LicenseData | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LICENSE_KEY_STORAGE);
      if (saved) {
        const data: LicenseData = JSON.parse(saved);
        // Check trial expiration (14 days = 14 * 24 * 60 * 60 * 1000 ms)
        if (data.type === "trial" && data.expiresAt && Date.now() > data.expiresAt) {
          setIsActivated(false);
          setErrorMsg("انتهت صلاحية النسخة التجريبية (14 يوماً). الرجاء إدخال ترخيص جديد مدفوع.");
          return;
        }
        setLicenseInfo(data);
        setIsActivated(true);
      } else {
        setIsActivated(false);
      }
    } catch (e) {
      setIsActivated(false);
    }
  }, []);

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const key = inputKey.trim().toUpperCase();
    const club = inputClub.trim();

    if (!key || !club) {
      setErrorMsg("الرجاء إدخال اسم النادي ومفتاح التفعيل");
      return;
    }

    let type: "trial" | "lifetime" | null = null;
    let expiresAt: number | undefined = undefined;

    if (key.startsWith("JUDO-TRL-")) {
      type = "trial";
      expiresAt = Date.now() + 14 * 24 * 60 * 60 * 1000; // 14 days
    } else if (key.startsWith("JUDO-PRO-") || key.startsWith("JUDO-LIFE-")) {
      type = "lifetime";
    }

    if (!type) {
      setErrorMsg("❌ مفتاح التفعيل غير صحيح. مفتاح التجربة يبتدئ بـ JUDO-TRL ورخص المدفوع تبتدئ بـ JUDO-PRO");
      return;
    }

    const newLicense: LicenseData = {
      key,
      type,
      activatedAt: Date.now(),
      expiresAt,
      clubName: club,
    };

    try {
      localStorage.setItem(LICENSE_KEY_STORAGE, JSON.stringify(newLicense));
      setLicenseInfo(newLicense);
      setIsActivated(true);
    } catch (err) {
      setErrorMsg("حدث خطأ أثناء تفعيل الترخيص");
    }
  };

  if (isActivated === null) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-400 font-bold">جاري التحقق من الترخيص...</div>;
  }

  if (!isActivated) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-4 font-sans dir-rtl">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-lg shadow-blue-500/20">
              🔒
            </div>
            <h1 className="text-2xl font-black text-white">تفعيل نظام JudoManager Pro</h1>
            <p className="text-slate-400 text-xs leading-relaxed">
              النظام مقيّد وتتطلب عملية التشغيل إدخال مفتاح التفعيل الخاص بناديك (تجريبي 14 يوماً أو ترخيص دائم).
            </p>
          </div>

          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3.5 rounded-xl font-bold text-center leading-relaxed">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleActivate} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">اسم النادي / الجمعية *</label>
              <input
                type="text"
                required
                placeholder="مثال: نادي الأمل للجودو"
                value={inputClub}
                onChange={(e) => setInputClub(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">مفتاح الترخيص (License Key) *</label>
              <input
                type="text"
                required
                placeholder="JUDO-TRL-XXXX-XXXX أو JUDO-PRO-XXXX"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono font-bold text-sm tracking-wider outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all"
            >
              ⚡ تفعيل وتشغيل النظام الآن
            </button>
          </form>

          <div className="border-t border-slate-800/80 pt-4 text-center text-slate-500 text-xs space-y-1">
            <p>للحصول على مفتاح تفعيل، تواصل عبر الواتساب:</p>

            <a
              href="https://wa.me/213553823611?text=السلام عليكم، أريد الحصول على مفتاح تفعيل لنظام JudoManager"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-400 font-bold hover:underline"
            >
              💬 واتساب: 0553823611
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
    </>
  );
}
