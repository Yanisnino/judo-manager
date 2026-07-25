"use client";

import { useState, useEffect } from "react";

export default function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 max-w-md bg-blue-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-blue-500/30 flex items-center justify-between gap-4 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xl shadow-md">
          📱
        </div>
        <div>
          <h4 className="font-bold text-sm">تثبيت تطبيق JudoManager</h4>
          <p className="text-xs text-blue-200">ثبت التطبيق على هاتفك أو حاسوبك للاستخدام السريع والعمل أوفلاين</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleInstallClick}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl text-xs shadow-md whitespace-nowrap"
        >
          تثبيت الآن
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="text-blue-300 hover:text-white px-2 py-1 text-xs font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
