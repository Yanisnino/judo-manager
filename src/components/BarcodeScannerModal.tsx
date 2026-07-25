"use client";

import { useState } from "react";
import Link from "next/link";

interface ScannerModalProps {
  onClose: () => void;
}

export default function BarcodeScannerModal({ onClose }: ScannerModalProps) {
  const [scannedCode, setScannedCode] = useState("");
  const [scanResult, setScanResult] = useState<any | null>(null);

  const mockDatabase: Record<string, any> = {
    "JUDO-2026-0001": {
      name: "محمد أمين بن علي",
      code: "JUDO-2026-0001",
      club: "نادي الأبطال للرياضات القتالية",
      sport: "الجودو (Judo)",
      belt: "حزام أصفر",
      beltColor: "bg-yellow-400 text-gray-900",
      group: "أشبال (10-12 سنة)",
      status: "اشتراك نشط مـعتمد (PAID)",
      emergencyPhone: "0661987654",
    },
    "JUDO-2026-0002": {
      name: "أحمد ياسين زروقي",
      code: "JUDO-2026-0002",
      club: "نادي الأبطال للرياضات القتالية",
      sport: "الجودو (Judo)",
      belt: "حزام برتقالي",
      beltColor: "bg-orange-500 text-white",
      group: "أشبال (10-12 سنة)",
      status: "اشتراك معلق (PENDING)",
      emergencyPhone: "0550123456",
    },
  };

  const handleScan = (codeToSearch: string) => {
    const cleanCode = codeToSearch.trim().toUpperCase();
    const result = mockDatabase[cleanCode] || {
      name: "لاعب مسجل بالنادي",
      code: cleanCode,
      club: "نادي الأبطال للرياضات القتالية",
      sport: "الجودو (Judo)",
      belt: "حزام أبيض",
      beltColor: "bg-gray-100 text-gray-800",
      group: "براعم",
      status: "اشتراك نشط مـعتمد (PAID)",
      emergencyPhone: "0550123456",
    };
    setScanResult(result);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📱</span>
            <h3 className="font-bold text-white text-lg">فحص ومسح كودبار / QR اللاعب</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-xl">✕</button>
        </div>

        {!scanResult ? (
          <div className="space-y-4 text-center">
            {/* Simulated Camera Viewfinder */}
            <div className="bg-slate-950 border-2 border-dashed border-blue-500/50 rounded-3xl p-8 relative overflow-hidden flex flex-col items-center justify-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center text-3xl border border-blue-500/20 animate-pulse">
                📷
              </div>
              <span className="text-xs text-slate-300 font-medium">وجه كاميرا الهاتف نحو الكودبار أو رمز الـ QR</span>
              <div className="w-48 h-0.5 bg-blue-500 shadow-lg shadow-blue-500 animate-pulse mt-2"></div>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-slate-400 block">أو أدخل الكودبار يدوياً للتجربة السريعة:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="مثال: JUDO-2026-0001"
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 text-white text-xs font-mono uppercase"
                />
                <button
                  onClick={() => handleScan(scannedCode || "JUDO-2026-0001")}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  فحص الرمز
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Scanned Result Card */
          <div className="space-y-4 animate-in zoom-in duration-200">
            <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-3 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-black text-2xl flex items-center justify-center mx-auto border-2 border-blue-400">
                {scanResult.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">{scanResult.name}</h4>
                <span className="text-xs font-mono text-slate-400">{scanResult.code}</span>
              </div>

              <div className="flex justify-center gap-2 text-xs">
                <span className={`px-3 py-0.5 rounded-full font-bold ${scanResult.beltColor}`}>
                  {scanResult.belt}
                </span>
                <span className="bg-slate-800 text-slate-300 px-3 py-0.5 rounded-full font-bold">
                  {scanResult.group}
                </span>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl text-emerald-400 font-bold text-xs">
                ✓ {scanResult.status}
              </div>
            </div>

            <div className="space-y-2">
              <a
                href={`tel:${scanResult.emergencyPhone}`}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                📞 الاتصال بولي الأمر فوراً (طوارئ)
              </a>
              <button
                onClick={() => setScanResult(null)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
              >
                فحص كودبار آخر
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
