"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { activateLicense, getStoredLicense, submitLicenseRequest, LicenseStatus } from "@/lib/licenseSystem";

export default function ActivatePage() {
  const router = useRouter();
  const [licenseKeyInput, setLicenseKeyInput] = useState("");
  const [status, setStatus] = useState<LicenseStatus | null>(null);
  const [activeTab, setActiveTab] = useState<"KEY" | "TRIAL" | "PAYMENT">("KEY");

  // Form states
  const [clubName, setClubName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [submittedReqId, setSubmittedReqId] = useState<string | null>(null);

  useEffect(() => {
    const s = getStoredLicense();
    setStatus(s);
  }, []);

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = activateLicense(licenseKeyInput);
    if (res.success && res.status) {
      setStatus(res.status);
      alert(res.message);
      router.push("/dashboard");
    } else {
      alert(res.message);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const executeSubmit = async (type: "TRIAL_14_DAYS" | "LIFETIME_PRO") => {
    if (!clubName.trim() || !phone.trim() || !email.trim()) {
      alert("يرجى ملء كافة البيانات المطلوبة: اسم النادي، رقم الهاتف، والبريد الإلكتروني!");
      return;
    }

    if (type === "LIFETIME_PRO" && !receiptUrl.trim()) {
      alert("يرجى إدخال رقم أو بيانات وصل دفع BaridiMob!");
      return;
    }

    setIsSubmitting(true);

    try {
      const req = await submitLicenseRequest({
        clubName,
        managerName: managerName || clubName,
        phone,
        email,
        requestType: type,
        receiptUrl: type === "LIFETIME_PRO" ? receiptUrl || "وصل تحويل بريدي موب مرفوق" : undefined,
      });

      setSubmittedReqId(req.id);

      // Open WhatsApp directly with formatted request
      const waText = encodeURIComponent(
        `السلام عليكم، قمت بإرسال طلب تفعيل JudoManager Pro:\n- اسم النادي: ${clubName}\n- رقم الطلب: ${req.id}\n- الإيميل: ${email}\n- الوصل/التحويل: ${receiptUrl || "تحويل بريدي موب"}`
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
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-blue-600/20 text-blue-400 border border-blue-500/30 font-black text-3xl flex items-center justify-center mx-auto shadow-inner">
            🥋
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">تفعيل نظام JudoManager Pro</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            تنشيط ترخيص الحساب واستلام مفتاح التفعيل عبر البريد الإلكتروني أو الواتساب
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
            ⚠️ أدخل مفتاح التفعيل، أو اطلب 14 يوماً تجريبياً وسنرسل لك المفتاح على إيميلك والواتساب فوراً.
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setActiveTab("KEY"); setSubmittedReqId(null); }}
            className={`py-2.5 rounded-xl transition-all ${activeTab === "KEY" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
          >
            🔑 إدخال مفتاح التفعيل
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("TRIAL"); setSubmittedReqId(null); }}
            className={`py-2.5 rounded-xl transition-all ${activeTab === "TRIAL" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
          >
            ⏱️ تجربة 14 يوماً مجاناً
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("PAYMENT"); setSubmittedReqId(null); }}
            className={`py-2.5 rounded-xl transition-all ${activeTab === "PAYMENT" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
          >
            💳 الشراء عبر BaridiMob
          </button>
        </div>

        {/* Tab 1: Enter Key */}
        {activeTab === "KEY" && (
          <form onSubmit={handleKeySubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">مفتاح التفعيل (License Key)</label>
              <input
                type="text"
                required
                placeholder="JUDO-TRL-XXXX-XXXX أو JUDO-PRO-XXXX-XXXX"
                value={licenseKeyInput}
                onChange={(e) => setLicenseKeyInput(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-white font-mono text-center tracking-widest text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition-all text-sm"
            >
              تنشيط النظام الآن 🚀
            </button>
          </form>
        )}

        {/* Tab 2: 14-Day Free Trial Request */}
        {activeTab === "TRIAL" && (
          <div className="space-y-4">
            {submittedReqId ? (
              <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-2xl p-6 text-center space-y-3">
                <span className="text-3xl block">📧</span>
                <h3 className="font-bold text-white text-base">تم تسجيل طلب الترخيص التجريبي بنجاح!</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  رقم طلبك: <strong className="text-indigo-400 font-mono">{submittedReqId}</strong>
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => executeSubmit("TRIAL_14_DAYS")}
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 shadow-lg"
                  >
                    💬 إرسال الطلب فورياً عبر الواتساب للأدمن
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">اسم النادي أو الجمعية الرياضية *</label>
                  <input
                    type="text"
                    required
                    placeholder="نادي الأمل الرياضي للجودو"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    className="w-full px-3.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">اسم المسؤول / المدرب</label>
                  <input
                    type="text"
                    placeholder="عبد القادر بلحاج"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full px-3.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">رقم الهاتف *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0553823611"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">البريد الإلكتروني (لتلقي المفتاح) *</label>
                    <input
                      type="email"
                      required
                      placeholder="club@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => executeSubmit("TRIAL_14_DAYS")}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/30 transition-all text-sm"
                >
                  إرسال طلب الحصول على 14 يوماً مجاناً ⏱️
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: BaridiMob Lifetime License Payment */}
        {activeTab === "PAYMENT" && (
          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-400">حساب بريدي موب (BaridiMob RIP)</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">00799999004034591143</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-400">مبلغ الترخيص الدائم مدى الحياة</span>
                <span className="font-mono text-white font-bold text-base">9,000 دج</span>
              </div>
              <div className="text-[11px] text-slate-400 pt-1">
                يرجى رفع بيانات وصل التحويل والبريد الإلكتروني، وسيتم إرسال مفتاح التفعيل الدائم على إيميلك والواتساب فور تأكيد التحويل.
              </div>
            </div>

            {submittedReqId ? (
              <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-3">
                <span className="text-3xl block">💳</span>
                <h3 className="font-bold text-white text-base">تم إرسال وصل الدفع والطلب للأدمن بنجاح!</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  رقم العملية الخاص بطلبك: <strong className="text-emerald-400 font-mono">{submittedReqId}</strong>
                </p>
                <p className="text-xs text-slate-300">
                  سيتم التحقق من التحويل من الأدمن وإرسال مفتاح الترخيص مدى الحياة إلى بريدك الإلكتروني: <strong className="text-white font-mono">{email}</strong>
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => executeSubmit("LIFETIME_PRO")}
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 shadow-lg"
                  >
                    💬 إعادة فتح المحادثة المباشرة مع الأدمن عبر الواتساب
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">اسم النادي أو الجمعية *</label>
                  <input
                    type="text"
                    required
                    placeholder="نادي الأبطال للجودو"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    className="w-full px-3.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">رقم الهاتف *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0553823611"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">البريد الإلكتروني (لتلقي المفتاح) *</label>
                    <input
                      type="email"
                      required
                      placeholder="club@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">بيانات/رقم وصل دفع BaridiMob *</label>
                  <input
                    type="text"
                    required
                    placeholder="رقم عملية التحويل #00982415 أو صورة الوصل"
                    value={receiptUrl}
                    onChange={(e) => setReceiptUrl(e.target.value)}
                    className="w-full px-3.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => executeSubmit("LIFETIME_PRO")}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 transition-all text-sm"
                >
                  إرسال وصل الدفع والفتح المباشر لـ WhatsApp 💳
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
