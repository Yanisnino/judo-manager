"use client";
import { useEffect, useState } from "react";

export default function InstallPage() {
  const [platform, setPlatform] = useState<"android" | "ios" | "desktop" | null>(null);
  const [installed, setInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // Detect platform
    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);
    const isStandalone =
      (window.navigator as any).standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches;

    if (isStandalone) {
      setInstalled(true);
    } else if (isIOS) {
      setPlatform("ios");
    } else if (isAndroid) {
      setPlatform("android");
    } else {
      setPlatform("desktop");
    }

    // Catch install prompt for Android/Chrome
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
    }
    setInstalling(false);
    setDeferredPrompt(null);
  };

  if (installed) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.icon}>✅</div>
          <h1 style={styles.title}>التطبيق مثبّت بنجاح!</h1>
          <p style={styles.sub}>يمكنك الآن استخدام JudoManager Pro من أيقونة الشاشة الرئيسية مباشرة.</p>
          <a href="/dashboard" style={{ ...styles.btn, background: "linear-gradient(135deg,#2ed8a8,#3b82f6)", color: "#0a1120" }}>
            🚀 الدخول للوحة التحكم
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>🥋</div>
          <div>
            <div style={styles.logoName}>JudoManager Pro</div>
            <div style={styles.logoSub}>نظام إدارة أندية الجودو</div>
          </div>
        </div>

        <h1 style={styles.title}>تثبيت التطبيق على هاتفك</h1>
        <p style={styles.sub}>ثبّت التطبيق مرة واحدة واستخدمه دائماً كأي تطبيق عادي — بدون متصفح وبدون إنترنت مستمر!</p>

        {/* Android - Auto Install */}
        {platform === "android" && (
          <div>
            {deferredPrompt ? (
              <div>
                <div style={styles.infoBox}>
                  <span style={{ fontSize: 20 }}>🤖</span>
                  <div>
                    <strong style={{ color: "#e8f0fe" }}>Android – تثبيت تلقائي</strong>
                    <p style={{ fontSize: 12, color: "#5a6a82", marginTop: 4 }}>
                      اضغط الزر أدناه وسيتم التثبيت فوراً على شاشتك
                    </p>
                  </div>
                </div>
                <button style={{ ...styles.btn, background: "linear-gradient(135deg,#4f8ef7,#7c6ff7)" }} onClick={handleInstall} disabled={installing}>
                  {installing ? "⏳ جاري التثبيت..." : "📲 تثبيت التطبيق الآن"}
                </button>
              </div>
            ) : (
              <div>
                <div style={styles.infoBox}>
                  <span style={{ fontSize: 20 }}>🤖</span>
                  <strong style={{ color: "#e8f0fe" }}>Android – Chrome</strong>
                </div>
                <StepsList steps={[
                  'افتح هذا الرابط في متصفح Chrome',
                  'اضغط على أيقونة النقاط الثلاث ⋮ في أعلى اليمين',
                  'اختر "إضافة إلى الشاشة الرئيسية" أو "تثبيت التطبيق"',
                  'اضغط "تثبيت" وستجد الأيقونة على شاشتك ✅',
                ]} />
              </div>
            )}
          </div>
        )}

        {/* iOS */}
        {platform === "ios" && (
          <div>
            <div style={styles.infoBox}>
              <span style={{ fontSize: 20 }}>🍎</span>
              <strong style={{ color: "#e8f0fe" }}>iPhone / iPad – Safari</strong>
            </div>
            <StepsList steps={[
              'افتح هذا الرابط في متصفح Safari (مهم: ليس Chrome)',
              'اضغط أيقونة المشاركة ↑ في شريط الأدوات السفلي',
              'مرر للأسفل واضغط "إضافة إلى الشاشة الرئيسية"',
              'اضغط "إضافة" في الأعلى ✅',
            ]} />
          </div>
        )}

        {/* Desktop */}
        {platform === "desktop" && (
          <div>
            <div style={styles.infoBox}>
              <span style={{ fontSize: 20 }}>🖥️</span>
              <div>
                <strong style={{ color: "#e8f0fe" }}>الكمبيوتر – Chrome / Edge</strong>
                <p style={{ fontSize: 12, color: "#5a6a82", marginTop: 4 }}>
                  ابحث عن أيقونة التثبيت في شريط العنوان
                </p>
              </div>
            </div>
            {deferredPrompt && (
              <button style={{ ...styles.btn, background: "linear-gradient(135deg,#4f8ef7,#7c6ff7)" }} onClick={handleInstall}>
                💻 تثبيت على الكمبيوتر
              </button>
            )}
          </div>
        )}

        {/* QR Code hint */}
        <div style={{ background: "rgba(46,216,168,0.06)", border: "1px solid rgba(46,216,168,0.18)", borderRadius: 12, padding: "14px 16px", marginTop: 20, fontSize: 12, color: "#5a6a82", lineHeight: 1.7 }}>
          💡 <strong style={{ color: "#e8f0fe" }}>ملاحظة:</strong> التطبيق يعمل من أي إنترنت في أي مكان. لا حاجة لنفس الواي فاي أبداً!
        </div>

        <a href="/dashboard" style={{ ...styles.btn, background: "rgba(255,255,255,0.05)", color: "#8fa8c8", border: "1px solid rgba(255,255,255,0.08)", marginTop: 12 }}>
          الدخول للوحة التحكم بدون تثبيت
        </a>
      </div>
    </div>
  );
}

function StepsList({ steps }: { steps: string[] }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "4px 0", marginTop: 12 }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", borderBottom: i < steps.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(79,142,247,0.15)", color: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
            {i + 1}
          </div>
          <p style={{ fontSize: 13, color: "#c8d4e8", lineHeight: 1.6, margin: 0 }}>{step}</p>
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(ellipse at 60% 30%, rgba(79,142,247,0.08) 0%, transparent 60%), #060b14",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    fontFamily: "'Cairo', 'Segoe UI', sans-serif",
  },
  card: {
    background: "#0d1b2e",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 24,
    padding: "32px 28px",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 22,
  },
  logoIcon: {
    width: 46,
    height: 46,
    background: "linear-gradient(135deg,#4f8ef7,#7c6ff7)",
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    flexShrink: 0,
    boxShadow: "0 6px 20px rgba(79,142,247,0.35)",
  },
  logoName: {
    color: "#e8f0fe",
    fontWeight: 900,
    fontSize: 15,
  },
  logoSub: {
    color: "#4a5e78",
    fontSize: 11,
    marginTop: 2,
  },
  icon: {
    fontSize: 52,
    textAlign: "center",
    marginBottom: 16,
  },
  title: {
    color: "#e8f0fe",
    fontSize: 20,
    fontWeight: 900,
    marginBottom: 10,
    lineHeight: 1.3,
  },
  sub: {
    color: "#5a6a82",
    fontSize: 13,
    lineHeight: 1.7,
    marginBottom: 20,
  },
  infoBox: {
    background: "rgba(79,142,247,0.08)",
    border: "1px solid rgba(79,142,247,0.18)",
    borderRadius: 11,
    padding: "12px 14px",
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
    fontSize: 13,
  },
  btn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    padding: "13px 20px",
    borderRadius: 13,
    fontFamily: "inherit",
    fontSize: 14,
    fontWeight: 800,
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    marginTop: 8,
    boxSizing: "border-box",
  },
};
