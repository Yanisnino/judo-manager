"use client";

import { useState, useEffect } from "react";

interface ParentShareModalProps {
  onClose: () => void;
}

export default function ParentShareModal({ onClose }: ParentShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [parentPhone, setParentPhone] = useState("");
  const [customDomain, setCustomDomain] = useState("");

  const [localIpUrl, setLocalIpUrl] = useState("http://192.168.1.35:3000/parent");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const port = window.location.port ? `:${window.location.port}` : "";
      const protocol = window.location.protocol;
      
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        setLocalIpUrl(`${protocol}//192.168.1.35${port}/parent`);
      } else {
        setLocalIpUrl(`${window.location.origin}/parent`);
      }
    }
  }, []);

  const activeUrl = customDomain.trim() ? customDomain.trim() : localIpUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppSend = () => {
    const text = `السلام عليكم ورحمة الله وبركاته،\nمرحباً بكم في *تطبيق أولياء الأمور للنادي الرياضي* 🥋\nيمكنكم تثبيت التطبيق ومتابعة حضور ومستوى أبنائكم ومواعيد التدريب والبطولات عبر الرابط التالي:\n${activeUrl}`;
    const cleanPhone = parentPhone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("0") ? "213" + cleanPhone.slice(1) : cleanPhone;
    const url = formattedPhone ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">👨‍👩‍👧</span>
            <h3 className="font-bold text-white text-lg">رابط ومسح تطبيق الأولياء</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-xl">✕</button>
        </div>

        {/* IP Explanation Alert */}
        <div className="bg-blue-950/60 border border-blue-800/80 p-3.5 rounded-2xl text-xs text-blue-200 space-y-1">
          <strong className="text-blue-300 block">💡 تنبيه هام لفتح الرابط على الهواتف:</strong>
          <p className="leading-relaxed">
            كلمة <code className="bg-slate-900 px-1 py-0.5 rounded text-yellow-300 font-mono">localhost</code> تعمل فقط داخل حاسوبك. لفتح الرابط على هاتف ولي الأمر استخدم رابط شبكة الواي فاي أو رابط الموقع أونلاين بالأسفل.
          </p>
        </div>

        {/* QR Code Section */}
        <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 text-center space-y-2">
          <div className="bg-white p-3.5 rounded-2xl inline-block shadow-lg mx-auto">
            <svg className="w-32 h-32 mx-auto" viewBox="0 0 100 100">
              <rect width="100" height="100" fill="white" />
              <rect x="10" y="10" width="25" height="25" fill="black" />
              <rect x="15" y="15" width="15" height="15" fill="white" />
              <rect x="18" y="18" width="9" height="9" fill="black" />

              <rect x="65" y="10" width="25" height="25" fill="black" />
              <rect x="70" y="15" width="15" height="15" fill="white" />
              <rect x="73" y="18" width="9" height="9" fill="black" />

              <rect x="10" y="65" width="25" height="25" fill="black" />
              <rect x="15" y="70" width="15" height="15" fill="white" />
              <rect x="18" y="73" width="9" height="9" fill="black" />

              <rect x="40" y="15" width="8" height="8" fill="black" />
              <rect x="50" y="25" width="8" height="8" fill="black" />
              <rect x="42" y="42" width="16" height="16" fill="#2563eb" rx="2" />
              <rect x="68" y="68" width="12" height="12" fill="black" />
            </svg>
          </div>
          <p className="text-[11px] text-slate-300">
            امسح الرمز أعلاه بكاميرا هاتف ولي الأمر (على شبكة الواي فاي نفسها) 📲
          </p>
        </div>

        {/* Wifi IP Link */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-300">رابط الشباكة المحلية للواي فاي (داخل الصالة):</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={localIpUrl}
              className="flex-1 px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 font-bold"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all"
            >
              {copied ? "✓ تم النسخ!" : "نسخ الرابط"}
            </button>
          </div>
        </div>

        {/* Online Domain Option */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-400">أو أدخل رابط الموقع أونلاين (إن وجد):</label>
          <input
            type="url"
            placeholder="مثال: https://judo-club.vercel.app/parent"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white"
          />
        </div>

        {/* Send via WhatsApp */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="block text-xs font-bold text-slate-400">إرسال لـ WhatsApp ولي الأمر مباشرة:</label>
          <div className="flex gap-2">
            <input
              type="tel"
              placeholder="0550123456"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white"
            />
            <button
              onClick={handleWhatsAppSend}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1"
            >
              💬 إرسال
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
