"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const LICENSE_KEY_STORAGE = "judo_manager_active_license";
const ADMIN_WHATSAPP = "213553823611";

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
  const [expiredMsg, setExpiredMsg] = useState("");

  // Form: WhatsApp request
  const [tab, setTab] = useState<"request" | "key">("request");
  const [clubName, setClubName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [phone, setPhone] = useState("");
  const [requestType, setRequestType] = useState<"TRIAL_14_DAYS" | "LIFETIME_PRO">("TRIAL_14_DAYS");
  const [waSent, setWaSent] = useState(false);

  // Key activation
  const [licenseKey, setLicenseKey] = useState("");
  const [keyError, setKeyError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LICENSE_KEY_STORAGE);
      if (!saved) { setIsActivated(false); return; }
      const data = JSON.parse(saved);

      // صيغة licenseSystem.ts الموحدة
      if (data.isActivated === true) {
        // تحقق من انتهاء الفترة التجريبية
        if (data.type === "TRIAL_14_DAYS" && data.expiresAt) {
          const expTime = new Date(data.expiresAt).getTime();
          if (Date.now() > expTime) {
            localStorage.removeItem(LICENSE_KEY_STORAGE);
            setExpiredMsg("⚠️ انتهت صلاحية الفترة التجريبية (14 يوماً). تواصل مع الأدمن للحصول على الترخيص الدائم.");
            setIsActivated(false);
            return;
          }
        }
        setIsActivated(true);
        return;
      }

      // صيغة قديمة احتياطية (trial/lifetime)
      if (data.type === "trial" && data.expiresAt && Date.now() > data.expiresAt) {
        localStorage.removeItem(LICENSE_KEY_STORAGE);
        setExpiredMsg("⚠️ انتهت صلاحية الفترة التجريبية (14 يوماً). تواصل مع الأدمن للحصول على الترخيص الدائم.");
        setIsActivated(false);
        return;
      }

      if (data.type === "trial" || data.type === "lifetime") {
        setIsActivated(true);
        return;
      }

      setIsActivated(false);
    } catch {
      setIsActivated(false);
    }
  }, []);

  const buildWhatsAppMessage = () => {
    const typeLabel = requestType === "TRIAL_14_DAYS"
      ? "🆓 فترة تجريبية مجانية (14 يوم)"
      : "💎 اشتراك دائم مدى الحياة — 9,000 دج";
    return encodeURIComponent(
      `🥋 *طلب تفعيل JudoManager Pro*\n\n` +
      `🏛️ *اسم النادي/الجمعية:* ${clubName}\n` +
      `👤 *اسم المسؤول/المدرب:* ${managerName || clubName}\n` +
      `📱 *رقم الهاتف:* ${phone}\n\n` +
      `📦 *نوع الطلب:* ${typeLabel}\n\n` +
      `أرجو مراجعة الطلب وإرسال مفتاح التفعيل. شكراً 🙏`
    );
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubName.trim() || !phone.trim()) {
      alert("يرجى إدخال اسم النادي ورقم الهاتف!");
      return;
    }
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${buildWhatsAppMessage()}`, "_blank");
    setWaSent(true);
    setTab("key");
  };

  const handleActivateKey = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyError("");
    const key = licenseKey.trim().toUpperCase();
    if (!key) { setKeyError("يرجى إدخال مفتاح التفعيل!"); return; }

    let licType: "TRIAL_14_DAYS" | "LIFETIME_PRO";
    let legacyType: "trial" | "lifetime";
    let days: number;

    if (key.startsWith("JUDO-TRL-")) {
      licType = "TRIAL_14_DAYS";
      legacyType = "trial";
      days = 14;
    } else if (key.startsWith("JUDO-PRO-") || key.startsWith("JUDO-LIFE-")) {
      licType = "LIFETIME_PRO";
      legacyType = "lifetime";
      days = 3650;
    } else {
      setKeyError("❌ المفتاح غير صحيح! تأكد من النسخ الصحيح للمفتاح الذي أرسله الأدمن.");
      return;
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const club = clubName || "نادي الجودو";

    // ── صيغة licenseSystem.ts (يستخدمها dashboard/page.tsx) ──
    const licenseStatus = {
      isActivated: true,
      licenseKey: key,
      type: licType,
      clubName: club,
      activatedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      daysRemaining: days,
    };
    localStorage.setItem(LICENSE_KEY_STORAGE, JSON.stringify(licenseStatus));

    // ── صيغة LicenseGuard القديمة (احتياطي) ──
    localStorage.setItem("judo_manager_active_license_v2", JSON.stringify({
      key,
      type: legacyType,
      activatedAt: Date.now(),
      expiresAt: expiresAt.getTime(),
      clubName: club,
    }));

    setIsActivated(true);
  };

  /* ── Loading ── */
  if (isActivated === null) {
    return (
      <div style={{
        height: "100vh", background: "#060b14",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#8fa8c8", fontFamily: "'Cairo',sans-serif", fontSize: 14, fontWeight: 700,
      }}>
        جاري التحقق من الترخيص...
      </div>
    );
  }

  /* ── Not Activated → Show activation UI ── */
  if (!isActivated) {
    return (
      <div
        dir="rtl"
        style={{
          minHeight: "100vh", display: "flex", alignItems: "center",
          justifyContent: "center", padding: 16,
          background: "linear-gradient(135deg,#060b14 0%,#0d1b2e 50%,#060b14 100%)",
          fontFamily: "'Cairo',sans-serif",
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap'); * { box-sizing:border-box; }`}</style>

        <div style={{ width: "100%", maxWidth: 480 }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{
              width: 68, height: 68,
              background: "linear-gradient(135deg,#a855f7,#6366f1)",
              borderRadius: 20,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, marginBottom: 12,
              boxShadow: "0 12px 40px rgba(168,85,247,.4)",
            }}>🥋</div>
            <h1 style={{ color: "#e8f0fe", fontSize: 20, fontWeight: 900, margin: "0 0 6px" }}>
              JudoManager Pro
            </h1>
            <p style={{ color: "#4a5e78", fontSize: 12, margin: 0 }}>
              يتطلب مفتاح ترخيص للعمل
            </p>
          </div>

          {/* Expired warning */}
          {expiredMsg && (
            <div style={{
              background: "rgba(248,113,113,.08)", border: "1px solid rgba(248,113,113,.2)",
              borderRadius: 12, padding: "12px 16px", marginBottom: 16,
              color: "#f87171", fontSize: 12, fontWeight: 700, textAlign: "center",
            }}>
              {expiredMsg}
            </div>
          )}

          {/* Tabs */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            background: "rgba(255,255,255,.03)",
            border: "1px solid rgba(255,255,255,.06)",
            borderRadius: 14, padding: 4, marginBottom: 16, gap: 4,
          }}>
            {(["request", "key"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "9px 0", borderRadius: 10, border: "none",
                  background: tab === t ? "linear-gradient(135deg,#a855f7,#6366f1)" : "transparent",
                  color: tab === t ? "white" : "#4a5e78",
                  fontWeight: 800, fontSize: 12, cursor: "pointer",
                  fontFamily: "'Cairo',sans-serif", transition: "all .18s",
                  boxShadow: tab === t ? "0 4px 14px rgba(168,85,247,.3)" : "none",
                }}
              >
                {t === "request" ? "📲 طلب عبر واتساب" : "🔑 إدخال المفتاح"}
              </button>
            ))}
          </div>

          {/* Card */}
          <div style={{
            background: "#0d1b2e", border: "1px solid rgba(255,255,255,.06)",
            borderRadius: 18, padding: "22px 20px",
          }}>

            {/* ── TAB: WhatsApp Request ── */}
            {tab === "request" && (
              <>
                {waSent ? (
                  <div style={{ textAlign: "center", padding: "10px 0" }}>
                    <div style={{ fontSize: 46, marginBottom: 10 }}>✅</div>
                    <p style={{ color: "#2ed8a8", fontWeight: 800, fontSize: 14, marginBottom: 8 }}>تم فتح واتساب!</p>
                    <p style={{ color: "#4a5e78", fontSize: 12, lineHeight: 1.8 }}>
                      أرسل الرسالة للأدمن وانتظر مفتاح التفعيل،
                      <br />ثم انتقل لتبويب <strong style={{ color: "#a855f7" }}>إدخال المفتاح</strong>
                    </p>
                    <button
                      onClick={() => { setWaSent(false); setTab("key"); }}
                      style={{
                        marginTop: 14,
                        background: "linear-gradient(135deg,#a855f7,#6366f1)",
                        border: "none", color: "white", fontWeight: 800, fontSize: 12,
                        padding: "9px 22px", borderRadius: 10, cursor: "pointer",
                        fontFamily: "'Cairo',sans-serif",
                      }}
                    >
                      إدخال مفتاح التفعيل ←
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSendWhatsApp} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* نوع الاشتراك */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {[
                        { v: "TRIAL_14_DAYS" as const, icon: "⏱️", label: "تجريبي", sub: "مجانية — 14 يوم", ac: "#a855f7" },
                        { v: "LIFETIME_PRO" as const,  icon: "💎", label: "دائم",    sub: "9,000 دج",      ac: "#f59e0b" },
                      ].map(opt => (
                        <button
                          key={opt.v} type="button"
                          onClick={() => setRequestType(opt.v)}
                          style={{
                            padding: "11px 8px", borderRadius: 12, cursor: "pointer",
                            border: `2px solid ${requestType === opt.v ? opt.ac : "rgba(255,255,255,.07)"}`,
                            background: requestType === opt.v ? `${opt.ac}18` : "rgba(255,255,255,.02)",
                            color: requestType === opt.v ? opt.ac : "#4a5e78",
                            fontWeight: 800, fontSize: 12, fontFamily: "'Cairo',sans-serif",
                            transition: "all .18s", textAlign: "center",
                          }}
                        >
                          <div style={{ fontSize: 22 }}>{opt.icon}</div>
                          <div style={{ marginTop: 4 }}>{opt.label}</div>
                          <div style={{ fontSize: 10, fontWeight: 600, marginTop: 2, opacity: .8 }}>{opt.sub}</div>
                        </button>
                      ))}
                    </div>

                    {/* Fields */}
                    {[
                      { label: "اسم النادي / الجمعية *", placeholder: "نادي أبطال الجودو", val: clubName, set: setClubName, req: true },
                      { label: "اسم المسؤول / المدرب",   placeholder: "الأستاذ أحمد",       val: managerName, set: setManagerName, req: false },
                      { label: "رقم الهاتف *",            placeholder: "05XXXXXXXX",          val: phone, set: setPhone, req: true },
                    ].map(f => (
                      <div key={f.label}>
                        <label style={{ display: "block", color: "#8fa8c8", fontSize: 11, fontWeight: 700, marginBottom: 5 }}>{f.label}</label>
                        <input
                          type="text" required={f.req}
                          placeholder={f.placeholder} value={f.val}
                          onChange={e => f.set(e.target.value)}
                          style={{
                            width: "100%", background: "rgba(255,255,255,.03)",
                            border: "1px solid rgba(255,255,255,.07)", borderRadius: 10,
                            padding: "10px 13px", color: "white", fontSize: 12,
                            outline: "none", fontFamily: "'Cairo',sans-serif",
                          }}
                        />
                      </div>
                    ))}

                    <button
                      type="submit"
                      style={{
                        width: "100%", padding: "13px",
                        background: "linear-gradient(135deg,#25D366,#128C7E)",
                        border: "none", borderRadius: 12, color: "white",
                        fontWeight: 900, fontSize: 14, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
                        boxShadow: "0 6px 24px rgba(37,211,102,.3)",
                        fontFamily: "'Cairo',sans-serif", marginTop: 4,
                      }}
                    >
                      <span style={{ fontSize: 20 }}>💬</span>
                      إرسال الطلب عبر واتساب
                    </button>
                  </form>
                )}
              </>
            )}

            {/* ── TAB: License Key ── */}
            {tab === "key" && (
              <form onSubmit={handleActivateKey} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={{ color: "#4a5e78", fontSize: 12, margin: "0 0 4px", lineHeight: 1.7 }}>
                  أدخل المفتاح الذي أرسله الأدمن عبر واتساب:
                  <br />
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", color: "#2ed8a8", fontSize: 11 }}>
                    JUDO-PRO-XXXX-XXXX &nbsp;|&nbsp; JUDO-TRL-XXXX-XXXX
                  </span>
                </p>

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
                  placeholder="JUDO-PRO-XXXX-XXXX"
                  value={licenseKey}
                  onChange={e => { setLicenseKey(e.target.value); setKeyError(""); }}
                  style={{
                    width: "100%", background: "rgba(255,255,255,.03)",
                    border: "1px solid rgba(46,216,168,.25)", borderRadius: 10,
                    padding: "13px 14px", color: "#2ed8a8",
                    fontFamily: "'JetBrains Mono',monospace", fontSize: 15,
                    fontWeight: 600, textAlign: "center", letterSpacing: ".1em",
                    outline: "none",
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
                    fontFamily: "'Cairo',sans-serif",
                  }}
                >
                  🚀 تفعيل النظام والدخول
                </button>

                <button
                  type="button"
                  onClick={() => setTab("request")}
                  style={{
                    background: "none", border: "none", color: "#4a5e78",
                    fontSize: 11, cursor: "pointer", fontFamily: "'Cairo',sans-serif",
                    fontWeight: 700, textAlign: "center",
                  }}
                >
                  ← العودة لطلب مفتاح عبر واتساب
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    );
  }

  return <>{children}</>;
}
