"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredLicense, LicenseStatus } from "@/lib/licenseSystem";

const ADMIN_WHATSAPP = "213553823611"; // رقم الأدمن

export default function ActivatePage() {
  const router = useRouter();
  const [status, setStatus] = useState<LicenseStatus | null>(null);

  // Form states
  const [clubName, setClubName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [requestType, setRequestType] = useState<"TRIAL_14_DAYS" | "LIFETIME_PRO">("TRIAL_14_DAYS");
  const [waSent, setWaSent] = useState(false);

  // Key activation
  const [licenseKey, setLicenseKey] = useState("");
  const [keyError, setKeyError] = useState("");
  const [keySuccess, setKeySuccess] = useState(false);

  useEffect(() => {
    const s = getStoredLicense();
    setStatus(s);
  }, []);

  const buildWhatsAppMessage = () => {
    const typeLabel = requestType === "TRIAL_14_DAYS"
      ? "🆓 فترة تجريبية مجانية (14 يوم)"
      : "💎 اشتراك دائم مدى الحياة — 9,000 دج";

    return encodeURIComponent(
      `🥋 *طلب تفعيل JudoManager Pro*\n\n` +
      `🏛️ *اسم النادي/الجمعية:* ${clubName}\n` +
      `👤 *اسم المسؤول/المدرب:* ${managerName || clubName}\n` +
      `📱 *رقم الهاتف:* ${phone}\n` +
      `📧 *البريد الإلكتروني:* ${email}\n\n` +
      `📦 *نوع الطلب:* ${typeLabel}\n\n` +
      `أرجو مراجعة الطلب وإرسال مفتاح التفعيل. شكراً 🙏`
    );
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubName.trim() || !phone.trim()) {
      alert("يرجى إدخال اسم النادي ورقم الهاتف على الأقل!");
      return;
    }
    const url = `https://wa.me/${ADMIN_WHATSAPP}?text=${buildWhatsAppMessage()}`;
    window.open(url, "_blank");
    setWaSent(true);
  };

  const handleActivateKey = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyError("");
    const key = licenseKey.trim().toUpperCase();

    if (!key) {
      setKeyError("يرجى إدخال مفتاح التفعيل!");
      return;
    }

    let type: "trial" | "lifetime" | null = null;
    let expiresAt: number | undefined;

    if (key.startsWith("JUDO-TRL-")) {
      type = "trial";
      expiresAt = Date.now() + 14 * 24 * 60 * 60 * 1000;
    } else if (key.startsWith("JUDO-PRO-") || key.startsWith("JUDO-LIFE-")) {
      type = "lifetime";
    } else {
      setKeyError("❌ المفتاح غير صحيح! تأكد من النسخ الصحيح للمفتاح الذي أرسله الأدمن.");
      return;
    }

    const licenseData = {
      key,
      type,
      activatedAt: Date.now(),
      expiresAt,
      clubName: clubName || "نادي الجودو",
    };

    localStorage.setItem("judo_manager_active_license", JSON.stringify(licenseData));
    setKeySuccess(true);
    setTimeout(() => router.push("/dashboard"), 1800);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #060b14 0%, #0d1b2e 50%, #060b14 100%)",
        fontFamily: "'Cairo', sans-serif",
      }}
    >
      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap');`}</style>

      <div style={{ width: "100%", maxWidth: 520 }}>

        {/* ── HEADER ── */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 72, height: 72,
            background: "linear-gradient(135deg,#a855f7,#6366f1)",
            borderRadius: 20,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 34, marginBottom: 14,
            boxShadow: "0 12px 40px rgba(168,85,247,.4)",
          }}>🥋</div>
          <h1 style={{ color: "#e8f0fe", fontSize: 22, fontWeight: 900, marginBottom: 6 }}>
            تفعيل JudoManager Pro
          </h1>
          <p style={{ color: "#4a5e78", fontSize: 12 }}>
            أرسل طلبك للأدمن عبر واتساب ثم أدخل مفتاح التفعيل
          </p>
        </div>

        {/* ── ALREADY ACTIVE BANNER ── */}
        {status?.isActivated && (
          <div style={{
            background: "rgba(46,216,168,.08)", border: "1px solid rgba(46,216,168,.25)",
            borderRadius: 14, padding: "14px 18px", marginBottom: 18, textAlign: "center",
          }}>
            <span style={{ color: "#2ed8a8", fontWeight: 800, fontSize: 13 }}>
              ✅ النظام مفعّل —{" "}
              {status.type === "LIFETIME_PRO"
                ? "ترخيص دائم مدى الحياة 🏆"
                : `تجربة مجانية — متبقٍ ${status.daysRemaining} يوم ⏱️`}
            </span>
            <div style={{ marginTop: 10 }}>
              <button
                onClick={() => router.push("/dashboard")}
                style={{
                  background: "linear-gradient(135deg,#2ed8a8,#4f8ef7)",
                  color: "#060b14", fontWeight: 800, fontSize: 12,
                  padding: "9px 22px", borderRadius: 10, border: "none", cursor: "pointer",
                }}
              >
                الدخول للوحة التحكم ←
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            CARD 1 — طلب عبر واتساب
        ════════════════════════════════════════ */}
        <div style={{
          background: "#0d1b2e", border: "1px solid rgba(255,255,255,.06)",
          borderRadius: 18, padding: "24px 22px", marginBottom: 16,
        }}>
          <h2 style={{ color: "#e8f0fe", fontSize: 14, fontWeight: 800, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>📲</span> أرسل طلبك للأدمن عبر واتساب
          </h2>

          {waSent ? (
            /* ─ تم الإرسال ─ */
            <div style={{ textAlign: "center", padding: "18px 0" }}>
              <div style={{ fontSize: 42, marginBottom: 10 }}>✅</div>
              <p style={{ color: "#2ed8a8", fontWeight: 800, fontSize: 14, marginBottom: 6 }}>
                تم فتح واتساب بنجاح!
              </p>
              <p style={{ color: "#4a5e78", fontSize: 12, lineHeight: 1.7 }}>
                أرسل الرسالة للأدمن، وبعد الموافقة ستستلم مفتاح التفعيل.
                <br />أدخله في الخانة أسفله لتفعيل النظام.
              </p>
              <button
                onClick={() => setWaSent(false)}
                style={{
                  marginTop: 14, background: "rgba(255,255,255,.05)",
                  border: "1px solid rgba(255,255,255,.08)", color: "#8fa8c8",
                  fontSize: 11, fontWeight: 700, padding: "7px 16px",
                  borderRadius: 9, cursor: "pointer",
                }}
              >
                ↺ إرسال طلب جديد
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendWhatsApp} style={{ display: "flex", flexDirection: "column", gap: 12 }}>

              {/* نوع الاشتراك */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setRequestType("TRIAL_14_DAYS")}
                  style={{
                    padding: "12px 10px", borderRadius: 12, cursor: "pointer",
                    border: `2px solid ${requestType === "TRIAL_14_DAYS" ? "#a855f7" : "rgba(255,255,255,.07)"}`,
                    background: requestType === "TRIAL_14_DAYS" ? "rgba(168,85,247,.12)" : "rgba(255,255,255,.02)",
                    color: requestType === "TRIAL_14_DAYS" ? "#a855f7" : "#4a5e78",
                    fontWeight: 800, fontSize: 12, textAlign: "center",
                    transition: "all .18s",
                  }}
                >
                  <div style={{ fontSize: 22 }}>⏱️</div>
                  <div style={{ marginTop: 5 }}>فترة تجريبية</div>
                  <div style={{ fontSize: 10, fontWeight: 600, marginTop: 2, color: requestType === "TRIAL_14_DAYS" ? "#c084fc" : "#4a5e78" }}>
                    مجانية — 14 يوم
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRequestType("LIFETIME_PRO")}
                  style={{
                    padding: "12px 10px", borderRadius: 12, cursor: "pointer",
                    border: `2px solid ${requestType === "LIFETIME_PRO" ? "#f59e0b" : "rgba(255,255,255,.07)"}`,
                    background: requestType === "LIFETIME_PRO" ? "rgba(245,158,11,.10)" : "rgba(255,255,255,.02)",
                    color: requestType === "LIFETIME_PRO" ? "#f59e0b" : "#4a5e78",
                    fontWeight: 800, fontSize: 12, textAlign: "center",
                    transition: "all .18s",
                  }}
                >
                  <div style={{ fontSize: 22 }}>💎</div>
                  <div style={{ marginTop: 5 }}>اشتراك دائم</div>
                  <div style={{ fontSize: 10, fontWeight: 600, marginTop: 2, color: requestType === "LIFETIME_PRO" ? "#fbbf24" : "#4a5e78" }}>
                    مدى الحياة — 9,000 دج
                  </div>
                </button>
              </div>

              {/* الحقول */}
              {[
                { id: "clubName",    label: "اسم النادي / الجمعية *",  placeholder: "مثال: نادي أبطال الجودو", value: clubName,    setter: setClubName,    required: true },
                { id: "managerName", label: "اسم المسؤول / المدرب",    placeholder: "مثال: الأستاذ أحمد",     value: managerName, setter: setManagerName, required: false },
                { id: "phone",       label: "رقم الهاتف *",             placeholder: "05XXXXXXXX",              value: phone,       setter: setPhone,       required: true },
                { id: "email",       label: "البريد الإلكتروني",        placeholder: "example@gmail.com",        value: email,       setter: setEmail,       required: false },
              ].map(f => (
                <div key={f.id}>
                  <label style={{ display: "block", color: "#8fa8c8", fontSize: 11, fontWeight: 700, marginBottom: 5 }}>
                    {f.label}
                  </label>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    value={f.value}
                    required={f.required}
                    onChange={e => f.setter(e.target.value)}
                    style={{
                      width: "100%", background: "rgba(255,255,255,.03)",
                      border: "1px solid rgba(255,255,255,.07)", borderRadius: 10,
                      padding: "10px 14px", color: "white", fontSize: 12,
                      outline: "none", boxSizing: "border-box",
                      fontFamily: "'Cairo',sans-serif",
                    }}
                  />
                </div>
              ))}

              {/* زر واتساب */}
              <button
                type="submit"
                style={{
                  width: "100%", padding: "13px",
                  background: "linear-gradient(135deg,#25D366,#128C7E)",
                  border: "none", borderRadius: 12, color: "white",
                  fontWeight: 900, fontSize: 14, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
                  boxShadow: "0 6px 24px rgba(37,211,102,.3)",
                  transition: "all .2s", marginTop: 4,
                  fontFamily: "'Cairo',sans-serif",
                }}
              >
                <span style={{ fontSize: 20 }}>💬</span>
                إرسال الطلب عبر واتساب
              </button>
            </form>
          )}
        </div>

        {/* ════════════════════════════════════════
            CARD 2 — إدخال مفتاح التفعيل
        ════════════════════════════════════════ */}
        <div style={{
          background: "#0d1b2e", border: "1px solid rgba(255,255,255,.06)",
          borderRadius: 18, padding: "24px 22px",
        }}>
          <h2 style={{ color: "#e8f0fe", fontSize: 14, fontWeight: 800, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>🔑</span> إدخال مفتاح التفعيل
          </h2>
          <p style={{ color: "#4a5e78", fontSize: 11, marginBottom: 16, lineHeight: 1.7 }}>
            بعد موافقة الأدمن سيرسل لك مفتاحاً مثل:&nbsp;
            <span style={{ fontFamily: "'JetBrains Mono',monospace", color: "#2ed8a8" }}>JUDO-PRO-XXXX-XXXX</span>
          </p>

          {keySuccess ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontSize: 42 }}>🎉</div>
              <p style={{ color: "#2ed8a8", fontWeight: 800, fontSize: 14, marginTop: 10 }}>
                تم التفعيل بنجاح! جاري الدخول...
              </p>
            </div>
          ) : (
            <form onSubmit={handleActivateKey} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {keyError && (
                <div style={{
                  background: "rgba(248,113,113,.08)", border: "1px solid rgba(248,113,113,.2)",
                  borderRadius: 9, padding: "9px 14px", color: "#f87171", fontSize: 12, fontWeight: 700,
                }}>
                  {keyError}
                </div>
              )}
              <input
                type="text"
                placeholder="JUDO-PRO-XXXX-XXXX  أو  JUDO-TRL-XXXX-XXXX"
                value={licenseKey}
                onChange={e => { setLicenseKey(e.target.value); setKeyError(""); }}
                style={{
                  width: "100%", background: "rgba(255,255,255,.03)",
                  border: "1px solid rgba(46,216,168,.25)", borderRadius: 10,
                  padding: "12px 14px", color: "#2ed8a8",
                  fontFamily: "'JetBrains Mono',monospace", fontSize: 14,
                  fontWeight: 600, textAlign: "center", letterSpacing: ".08em",
                  outline: "none", boxSizing: "border-box",
                }}
              />
              <button
                type="submit"
                style={{
                  width: "100%", padding: "13px",
                  background: "linear-gradient(135deg,#a855f7,#6366f1)",
                  border: "none", borderRadius: 12, color: "white",
                  fontWeight: 900, fontSize: 14, cursor: "pointer",
                  boxShadow: "0 6px 24px rgba(168,85,247,.35)",
                  transition: "all .2s", fontFamily: "'Cairo',sans-serif",
                }}
              >
                🚀 تفعيل النظام والدخول
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
