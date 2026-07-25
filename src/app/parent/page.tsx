"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LocalAuthDb } from "@/lib/localAuthDb";
import { playNotificationSound } from "@/lib/notificationSound";
import BarcodeScannerModal from "@/components/BarcodeScannerModal";

export default function ParentPortalPage() {
  const [parentPhone, setParentPhone] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"children" | "attendance" | "competitions" | "notifications">("children");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showScanner, setShowScanner] = useState(false);

  // PWA Prompt event handler
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    const list = LocalAuthDb.getNotifications();
    setNotifications(list);

    // Listen for PWA installation prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setInstalledSuccess(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
      }
    } else {
      alert("💡 لتثبيت التطبيق على هاتفك:\nاضغط على خيارات المتصفح (⋮ أو ⬆️) ثم اختر 'الإضافة إلى الشاشة الرئيسية' (Add to Home screen).");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = parentPhone.replace(/\D/g, "");
    if (clean.length >= 8) {
      setIsLoggedIn(true);
      playNotificationSound();
    } else {
      alert("يرجى إدخال رقم هاتف صحيح (مثال: 0550123456)");
    }
  };

  const children = [
    {
      id: "ATH-001",
      name: "محمد أمين بن علي",
      code: "JUDO-2026-0001",
      sport: "الجودو (Judo)",
      belt: "حزام أصفر",
      beltColor: "bg-yellow-400 text-gray-900 font-bold",
      group: "أشبال (10-12 سنة)",
      attendanceRate: 94,
      subStatus: "paid",
      subEndDate: "2026-08-01",
      coach: "المدرب أحمد بن سالم",
    },
  ];

  const competitions = [
    {
      id: "C1",
      title: "بطولة الولاية للجودو (أشبال)",
      date: "2026-03-20",
      category: "أقل من 34 كغ",
      result: "🥇 الميدالية الذهبية (المركز الأول)",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Banner Installer for Parent Phone */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-3 text-center text-xs font-bold shadow-md flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-base">📲</span>
          <span>تطبيق أولياء الأمور الرسمـي</span>
        </div>
        <button
          onClick={handleInstallPwa}
          className="bg-white text-blue-900 px-3.5 py-1.5 rounded-full font-black text-xs hover:bg-blue-50 shadow-md transition-all border border-white/40"
        >
          {installedSuccess ? "✓ تم التثبيت!" : "تثبيت التطبيق على الهاتف ⬇️"}
        </button>
      </div>

      {/* Top Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 p-4 sticky top-0 z-40">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-600/30">
              👨‍👩‍👧
            </div>
            <div>
              <h1 className="font-black text-white text-base leading-tight">تطبيق أولياء الأمور</h1>
              <span className="text-[11px] text-blue-400 font-medium">JudoManager Parent App</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowScanner(true)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl border border-slate-700 text-xs font-bold flex items-center gap-1"
              title="مسح الكودبار"
            >
              📱 فحص الكود
            </button>
            <Link href="/" className="text-xs text-slate-400 hover:text-white border border-slate-800 px-3 py-2 rounded-xl">
              خروج
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {!isLoggedIn ? (
          /* Login Card for Parent */
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-5 my-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-2 shadow-inner">
                📲
              </div>
              <h2 className="text-2xl font-black text-white">دخول تطبيق ولي الأمر</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                أدخل رقم هاتفك المسجل لدى إدارة النادي لمتابعة الحضور، الأحزمة، والإشعارات فوراً.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">رقم هاتف ولي الأمر (أي صيغة)</label>
                <input
                  type="tel"
                  required
                  placeholder="مثال: 0550123456 أو 0661122334"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-white text-sm font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition-all text-sm"
              >
                الدخول لمتابعة الأبناء ➔
              </button>
            </form>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-2">
              <span className="text-xs font-bold text-slate-300 block">💡 لتثبيت التطبيق على الشاشة الرئيسية للهاتف:</span>
              <button
                onClick={handleInstallPwa}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold rounded-xl text-xs border border-slate-700"
              >
                اضغط هنا لتنزيل التطبيق على الهاتف 📲
              </button>
            </div>
          </div>
        ) : (
          /* Logged In Content */
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Nav Tabs */}
            <div className="grid grid-cols-4 gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-center text-xs font-bold">
              <button
                onClick={() => setActiveTab("children")}
                className={`py-2.5 rounded-xl transition-all ${activeTab === "children" ? "bg-blue-600 text-white shadow-md" : "text-slate-400"}`}
              >
                الأبناء
              </button>
              <button
                onClick={() => setActiveTab("attendance")}
                className={`py-2.5 rounded-xl transition-all ${activeTab === "attendance" ? "bg-blue-600 text-white shadow-md" : "text-slate-400"}`}
              >
                الحضور
              </button>
              <button
                onClick={() => setActiveTab("competitions")}
                className={`py-2.5 rounded-xl transition-all ${activeTab === "competitions" ? "bg-blue-600 text-white shadow-md" : "text-slate-400"}`}
              >
                البطولات
              </button>
              <button
                onClick={() => {
                  setActiveTab("notifications");
                  playNotificationSound();
                }}
                className={`py-2.5 rounded-xl transition-all relative ${activeTab === "notifications" ? "bg-blue-600 text-white shadow-md" : "text-slate-400"}`}
              >
                الإشعارات 🔔
              </button>
            </div>

            {/* Children Tab */}
            {activeTab === "children" && (
              <div className="space-y-4">
                {children.map((child) => (
                  <div key={child.id} className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-black text-2xl flex items-center justify-center border-2 border-blue-400 shadow-md">
                          {child.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg">{child.name}</h3>
                          <span className="text-xs text-slate-400 font-mono">{child.code}</span>
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${child.beltColor}`}>
                        {child.belt}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
                        <span className="text-slate-400 block mb-1">المجموعة</span>
                        <span className="font-bold text-white text-sm">{child.group}</span>
                      </div>
                      <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
                        <span className="text-slate-400 block mb-1">نسبة الحضور</span>
                        <span className="font-bold text-emerald-400 text-sm">{child.attendanceRate}%</span>
                      </div>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3.5 flex justify-between items-center text-xs">
                      <span className="text-emerald-400 font-bold">الاشتراك ساري وحاضر</span>
                      <span className="text-slate-300 font-mono">ينتهي: {child.subEndDate}</span>
                    </div>

                    <Link
                      href={`/qr/${child.code}`}
                      target="_blank"
                      className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-bold text-center block border border-slate-700 shadow-md"
                    >
                      📱 فتح بطاقة الـ QR والأنسبة للطوارئ
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Attendance History Tab */}
            {activeTab === "attendance" && (
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-3 shadow-xl">
                <h3 className="font-bold text-white text-sm mb-3">سجل حضور الطفل الحصص الأخيرة</h3>
                <AttendanceRow date="2026-07-20" status="حاضر" session="حصة الأشبال" />
                <AttendanceRow date="2026-07-18" status="حاضر" session="حصة الأشبال" />
                <AttendanceRow date="2026-07-15" status="غائب" session="حصة الأشبال" />
              </div>
            )}

            {/* Competitions Tab */}
            {activeTab === "competitions" && (
              <div className="space-y-3">
                {competitions.map((comp) => (
                  <div key={comp.id} className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-2 shadow-xl">
                    <div className="font-bold text-white text-sm">{comp.title}</div>
                    <div className="text-xs text-slate-400 font-mono">الفئة: {comp.category} | التاريخ: {comp.date}</div>
                    <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl text-amber-300 font-bold text-xs mt-2">
                      {comp.result}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div key={notif.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-1 shadow-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-400 text-xs">🔔 {notif.title}</span>
                      <span className="text-slate-500 text-[10px] font-mono">{notif.date}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pt-1">{notif.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Barcode / QR Scanner Modal */}
      {showScanner && <BarcodeScannerModal onClose={() => setShowScanner(false)} />}
    </div>
  );
}

function AttendanceRow({ date, status, session }: { date: string; status: string; session: string }) {
  return (
    <div className="flex justify-between items-center p-3.5 bg-slate-950 rounded-2xl text-xs border border-slate-800">
      <div>
        <span className="font-bold text-white block">{session}</span>
        <span className="text-slate-500 font-mono text-[10px]">{date}</span>
      </div>
      <span className={`px-3 py-1 rounded-full font-bold ${status === "حاضر" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
        {status}
      </span>
    </div>
  );
}
