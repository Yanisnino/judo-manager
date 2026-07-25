"use client";

import { useState } from "react";

interface ParentShareModalProps {
  onClose: () => void;
}

export default function ParentShareModal({ onClose }: ParentShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [parentPhone, setParentPhone] = useState("");

  const parentUrl = typeof window !== "undefined" ? `${window.location.origin}/parent` : "http://localhost:3000/parent";

  const handleCopy = () => {
    navigator.clipboard.writeText(parentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppSend = () => {
    const text = `السلام عليكم ورحمة الله وبركاته،\nمرحباً بكم في *تطبيق أولياء الأمور للنادي الرياضي* 🥋\nيمكنكم تثبيت التطبيق ومتابعة حضور ومستوى أبنائكم ومواعيد التدريب والبطولات عبر الرابط التالي:\n${parentUrl}`;
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

        {/* QR Code Section */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 text-center space-y-3">
          <div className="bg-white p-4 rounded-2xl inline-block shadow-lg mx-auto">
            {/* SVG QR Code representation */}
            <svg className="w-36 h-36 mx-auto" viewBox="0 0 100 100">
              <rect width="100" height="100" fill="white" />
              {/* Outer corners */}
              <rect x="10" y="10" width="25" height="25" fill="black" />
              <rect x="15" y="15" width="15" height="15" fill="white" />
              <rect x="18" y="18" width="9" height="9" fill="black" />

              <rect x="65" y="10" width="25" height="25" fill="black" />
              <rect x="70" y="15" width="15" height="15" fill="white" />
              <rect x="73" y="18" width="9" height="9" fill="black" />

              <rect x="10" y="65" width="25" height="25" fill="black" />
              <rect x="15" y="70" width="15" height="15" fill="white" />
              <rect x="18" y="73" width="9" height="9" fill="black" />

              {/* Data pattern */}
              <rect x="40" y="15" width="8" height="8" fill="black" />
              <rect x="50" y="25" width="8" height="8" fill="black" />
              <rect x="42" y="42" width="16" height="16" fill="#2563eb" rx="2" />
              <rect x="68" y="68" width="12" height="12" fill="black" />
              <rect x="45" y="75" width="8" height="8" fill="black" />
              <rect x="75" y="45" width="8" height="8" fill="black" />
            </svg>
          </div>
          <p className="text-xs text-slate-300">
            امسح الرمز أعلاه بكاميرا هاتف ولي الأمر لتنزل معه صفحة الأولياء فوراً 📲
          </p>
        </div>

        {/* Copy Link Input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-400">الرابط المباشر لتطبيق الأولياء:</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={parentUrl}
              className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-blue-400"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all"
            >
              {copied ? "✓ تم النسخ!" : "نسخ الرابط"}
            </button>
          </div>
        </div>

        {/* Send via WhatsApp */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="block text-xs font-bold text-slate-400">إرسال لـ WhatsApp ولي الأمر:</label>
          <div className="flex gap-2">
            <input
              type="tel"
              placeholder="0550123456"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white"
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
