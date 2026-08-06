"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const LICENSE_KEY_STORAGE = "judo_manager_active_license";

interface LicenseData {
  key: string;
  type: "trial" | "lifetime";
  activatedAt: number;
  expiresAt?: number;
  clubName: string;
}

export default function LicenseGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isActivated, setIsActivated] = useState<boolean | null>(null);
  const [inputKey, setInputKey] = useState("");
  const [inputClub, setInputClub] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [licenseInfo, setLicenseInfo] = useState<LicenseData | null>(null);

  const checkLicenseValidity = async (data: LicenseData) => {
    // 1. Check trial expiration
    if (data.type === "trial" && data.expiresAt && Date.now() > data.expiresAt) {
      localStorage.removeItem(LICENSE_KEY_STORAGE);
      setIsActivated(false);
      setErrorMsg("⚠️ انتهت صلاحية الفترة التجريبية (14 يوماً). يرجى التواصل مع الأدمن للحصول على المفتاح الدائم.");
      return;
    }

    // 2. Check online revocation status with cloud API
    try {
      const res = await fetch("/api/license-requests");
      if (res.ok) {
        const requests = await res.json();
        if (Array.isArray(requests)) {
          // Find if this key or club was rejected/revoked by admin
          const revoked = requests.find((r: any) => r.status === "REJECTED" && (r.key === data.key || r.clubName === data.clubName));
          if (revoked) {
            localStorage.removeItem(LICENSE_KEY_STORAGE);
            setIsActivated(false);
            setErrorMsg("❌ تم إلغاء وتعليق هذا الترخيص من قبل أدمن النظام. يرجى التواصل لإعادة التفعيل.");
            return;
          }
        }
      }
    } catch (e) {
      // Offline fallback
    }

    setLicenseInfo(data);
    setIsActivated(true);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LICENSE_KEY_STORAGE);
      if (saved) {
        const data: LicenseData = JSON.parse(saved);
        checkLicenseValidity(data);
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
      setErrorMsg("الرجاء إدخال اسم النادي ومفتاح التفعيل الممنوح لك من الأدمن");
      return;
    }

    let type: "trial" | "lifetime" | null = null;
    let expiresAt: number | undefined = undefined;

    if (key.startsWith("JUDO-TRL-")) {
      type = "trial";
      expiresAt = Date.now() + 14 * 24 * 60 * 60 * 1000;
    } else if (key.startsWith("JUDO-PRO-") || key.startsWith("JUDO-LIFE-")) {
      type = "lifetime";
    } else {
      setErrorMsg("مفتاح التفعيل غير صحيح! يرجى التحقق من الرقم الممنوح من الأدمن.");
      return;
    }

    const newData: LicenseData = {
      key,
      type,
      activatedAt: Date.now(),
      expiresAt,
      clubName: club,
    };

    localStorage.setItem(LICENSE_KEY_STORAGE, JSON.stringify(newData));
    setLicenseInfo(newData);
    setIsActivated(true);
    alert("🎉 تم تنشيط الترخيص بنجاح! مرحباً بك في JudoManager Pro");
  };

  if (isActivated === null) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center text-white font-bold text-sm">
        جاري التحقق من الترخيص...
      </div>
    );
  }

  if (!isActivated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white dir-rtl">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-right">
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 border border-amber-500/20 font-black text-3xl flex items-center justify-center mx-auto">
              🔒
            </div>
            <h2 className="text-2xl font-black text-white">النظام مغلق - يتطلب التفعيل</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              تطبيق JudoManager Pro يتطلب مفتاح ترخيص مفعل للوصول لخدمات إدارة النادي
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-bold leading-relaxed">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleActivate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">اسم النادي أو الجمعية *</label>
              <input
                type="text"
                required
                placeholder="نادي الأبطال للجودو"
                value={inputClub}
                onChange={(e) => setInputClub(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">مفتاح التفعيل (License Key) *</label>
              <input
                type="text"
                required
                placeholder="JUDO-PRO-XXXX-XXXX"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-center tracking-widest text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 text-xs transition-all"
            >
              تنشيط النظام والدخول 🚀
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center">
            <button
              onClick={() => router.push("/activate")}
              className="text-xs font-bold text-emerald-400 hover:underline"
            >
              💳 طلب مفتاح التفعيل عبر BaridiMob أو تجربة 14 يوماً ➔
            </button>
          </div>

        </div>
      </div>
    );
  }

  return <>{children}</>;
}
