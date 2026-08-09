"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { activateLicense, getStoredLicense, submitLicenseRequest, LicenseStatus } from "@/lib/licenseSystem";

export default function ActivatePage() {
  const router = useRouter();
  const [licenseKeyInput, setLicenseKeyInput] = useState("");
  const [status, setStatus] = useState<LicenseStatus | null>(null);

  // Form states
  const [clubName, setClubName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [requestType, setRequestType] = useState<"TRIAL_14_DAYS" | "LIFETIME_PRO">("TRIAL_14_DAYS");
  const [submittedReqId, setSubmittedReqId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const s = getStoredLicense();
    setStatus(s);
  }, []);

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKeyInput.trim()) {
      alert("يرجى إدخال مفتاح التفعيل!");
      return;
    }
    const res = activateLicense(licenseKeyInput.trim());
    if (res.success && res.status) {
      setStatus(res.status);
      alert(res.message);
      router.push("/dashboard");
    } else {
      alert(res.message);
    }
  };

  const executeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubName.trim() || !phone.trim() || !email.trim()) {
      alert("يرجى ملء كافة البيانات المطلوبة: اسم النادي، رقم الهاتف، والبريد الإلكتروني!");
      return;
    }

    setIsSubmitting(true);

    try {
      const req = await submitLicenseRequest({
        clubName,
        managerName: managerName || clubName,
        phone,
        email,
        requestType,
      });

      setSubmittedReqId(req.id);

      const typeLabel = requestType === "TRIAL_14_DAYS" ? "فترة تجريبية (14 يوماً)" : "اشتراك مدى الحياة (Lifetime Pro)";

      // Open WhatsApp directly with formatted request
      const waText = encodeURIComponent(
        `السلام عليكم، أود طلب مفتاح تفعيل لبرنامج JudoManager Pro:\n- اسم النادي/الجمعية: ${clubName}\n- اسم المسؤول: ${managerName || clubName}\n- رقم الهاتف: ${phone}\n- البريد الإلكتروني: ${email}\n- نوع الترخيص المطلوبة: ${typeLabel}\n- رقم الطلب المرجعي: ${req.id}`
      );
      window.open(`https://wa.me/213553823611?text=${waText}`, "_blank");
    } catch (e) {
      alert("حدث خطأ أثناء الإرسال. يرجى التكرم بفتح الواتساب مباشرة.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-blue-600/20 text-blue-400 border border-blue-500/30 font-black text-3xl flex items-center justify-center mx-auto shadow-inner">
            🥋
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">تفعيل JudoManager Pro</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            أدخل مفتاح التفعيل الخاص بك للدخول، أو أرسل طلب استلام مفتاح جديد عبر الواتساب
          </p>
        </div>

        {/* License Status Banner */}
        {status?.isActivated ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center space-y-2">
            <span className="text-xs text-emerald-400 font-bold block">
              ✅ النظام مفعل حالياً ({status.type === "LIFETIME_PRO" ? "ترخيص دائم مدى الحياة 🏆" : `تجربة مجانية متبقي منها ${status.daysRemaining} أيام ⏱️`})
            </span>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md"
            >
              الدخول لـ لوحة التحكم ➔
            </button>
          </div>
        ) : (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 text-center text-xs text-amber-300 font-medium">
            🔒 النظام مغلق: أدخل مفتاح التفعيل أدناه أو أرسل طلباً لاستلام المفتاح عبر الواتساب.
          </div>
        )}

        {/* SECTION 1: Enter Key */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 md:p-5 space-y-3">
          <h2 className="text-xs font-bold text-blue-400 flex items-center gap-2">
            <span>🔑</span> إدخال مفتاح التفعيل
          </h2>
          <form onSubmit={handleKeySubmit} className="space-y-3">
            <input
              type="text"
              placeholder="أدخل المفتاح مثل: JUDO-PRO-XXXX-XXXX أو JUDO-TRL-XXXX-XXXX"
              value={licenseKeyInput}
              onChange={(e) => setLicenseKeyInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs md:text-sm text-center text-emerald-400 font-mono font-bold tracking-wider focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all"
            >
              تنشيط النظام الآن 🚀
            </button>
          </form>
        </div>

        {/* SECTION 2: Request Key via WhatsApp */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 md:p-5 space-y-3">
          <h2 className="text-xs font-bold text-indigo-400 flex items-center gap-2">
            <span>💬</span> طلب مفتاح تفعيل جديد (عبر الواتساب)
          </h2>

          {submittedReqId ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center space-y-2">
              <div className="text-2xl">📱✨</div>
              <h3 className="text-xs font-bold text-emerald-400">تم إرسال الطلب بنجاح!</h3>
              <p className="text-[11px] text-slate-300">
                رقم الطلب المرجعي: <strong className="text-white font-mono">{submittedReqId}</strong>
                <br />
                سيقوم الأدمن بتوليد وموافاتك بالمفتاح عبر الواتساب مباشرة.
              </p>
            </div>
          ) : (
            <form onSubmit={executeSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">اسم النادي / الجمعية *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: نادي أبطال الجودو"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">اسم المسؤول / المدرب *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: الكابتن محمد"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">رقم الهاتف (الواتساب) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="05XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1.5">نوع الترخيص المطلوبة *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRequestType("TRIAL_14_DAYS")}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      requestType === "TRIAL_14_DAYS"
                        ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold"
                        : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  >
                    <div className="text-xs">⏱️ تجربة مجانية (14 يوماً)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRequestType("LIFETIME_PRO")}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      requestType === "LIFETIME_PRO"
                        ? "bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold"
                        : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  >
                    <div className="text-xs">🏆 اشتراك دائم (مدى الحياة)</div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all flex items-center justify-center space-x-2 space-x-reverse"
              >
                <span>{isSubmitting ? "جاري تجهيز الطلب..." : "إرسال الطلب عبر الواتساب مباشرة 💬"}</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
