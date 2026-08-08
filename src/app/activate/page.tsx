"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { activateLicense, getStoredLicense, submitLicenseRequest, LicenseStatus } from "@/lib/licenseSystem";

export default function ActivatePage() {
  const router = useRouter();
  const [licenseKeyInput, setLicenseKeyInput] = useState("");
  const [status, setStatus] = useState<LicenseStatus | null>(null);
  const [activeTab, setActiveTab] = useState<"KEY" | "REQUEST">("KEY");

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
        `السلام عليكم، أود طلب مفتاح تفعيل لبرنامج JudoManager Pro:\n- اسم النادي/الجمعية: ${clubName}\n- اسم المسؤول: ${managerName || clubName}\n- رقم الهاتف: ${phone}\n- البريد الإلكتروني: ${email}\n- نوع الترخيص: ${typeLabel}\n- رقم الطلب المرجعي: ${req.id}`
      );
      window.open(`https://wa.me/213553823611?text=${waText}`, "_blank");
    } catch(e) {
      alert("حدث خطأ أثناء الإرسال. يرجى إعادة المحاولة.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
      <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-blue-600/20 text-blue-400 border border-blue-500/30 font-black text-3xl flex items-center justify-center mx-auto shadow-inner">
            🥋
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">تفعيل JudoManager Pro</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            أدخل مفتاح التفعيل للبدء، أو اطلب مفتاح تفعيل جديد مباشرة من المسؤول
          </p>
        </div>

        {/* Current License Banner */}
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
            🔒 النظام مغلق: يلزم أدخال مفتاح تفعيل صادر من المسؤول لاستخدام البرنامج.
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setActiveTab("KEY"); setSubmittedReqId(null); }}
            className={`py-3 rounded-xl transition-all ${activeTab === "KEY" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
          >
            🔑 إدخال مفتاح التفعيل
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("REQUEST"); setSubmittedReqId(null); }}
            className={`py-3 rounded-xl transition-all ${activeTab === "REQUEST" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
          >
            📲 طلب مفتاح تفعيل جديد
          </button>
        </div>

        {/* Tab 1: Enter Key */}
        {activeTab === "KEY" && (
          <form onSubmit={handleKeySubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">مفتاح التفعيل (License Key)</label>
              <input
                type="text"
                placeholder="أدخل مفتاح التفعيل مثل: JUDO-TRIAL-XXXX-XXXX"
                value={licenseKeyInput}
                onChange={(e) => setLicenseKeyInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-center text-emerald-400 font-mono font-bold tracking-wider focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-2xl text-xs shadow-lg transition-all"
            >
              تأكيد وتفعيل النظام الآن ⚡
            </button>
          </form>
        )}

        {/* Tab 2: Request Key via WhatsApp & Server */}
        {activeTab === "REQUEST" && (
          <div className="space-y-4 pt-2">
            {submittedReqId ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 text-center space-y-3">
                <div className="text-3xl">📱✨</div>
                <h3 className="text-sm font-bold text-emerald-400">تم إرسال الطلب بنجاح!</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  تم تسجل طلبك بقاعدة البيانات ورقم الطلب: <strong className="text-white font-mono">{submittedReqId}</strong>.
                  <br />
                  تم فتح محادثة WhatsApp مباشرة مع المسؤول لاستلام مفتاح التفعيل.
                </p>
                <button
                  type="button"
                  onClick={() => { setActiveTab("KEY"); setSubmittedReqId(null); }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs"
                >
                  إدخال المفتاح المستلم الآن 🔑
                </button>
              </div>
            ) : (
              <form onSubmit={executeSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">اسم النادي / الجمعية *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: نادي الوفاق للجودو"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">اسم المسؤول / المدرب *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: كابتن أحمد"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">رقم الهاتف (الواتساب) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="05XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">البريد الإلكتروني *</label>
                    <input
                      type="email"
                      required
                      placeholder="example@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">نوع المفتاح المطلوب *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRequestType("TRIAL_14_DAYS")}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        requestType === "TRIAL_14_DAYS"
                          ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      <div className="text-xs font-bold">⏱️ تجربة مجانية</div>
                      <div className="text-[10px] opacity-70">لمدة 14 يوماً</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRequestType("LIFETIME_PRO")}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        requestType === "LIFETIME_PRO"
                          ? "bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      <div className="text-xs font-bold">🏆 ترخيص دائم</div>
                      <div className="text-[10px] opacity-70">مدى الحياة (Lifetime Pro)</div>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-2xl text-xs shadow-lg transition-all flex items-center justify-center space-x-2 space-x-reverse"
                >
                  <span>{isSubmitting ? "جاري تسجيل الطلب..." : "إرسال الطلب والتواصل عبر الواتساب 💬"}</span>
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
