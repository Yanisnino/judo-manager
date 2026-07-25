"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LocalAuthDb } from "@/lib/localAuthDb";

export default function ParentPortalPage() {
  const [parentPhone, setParentPhone] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"children" | "attendance" | "competitions" | "notifications">("children");
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    setNotifications(LocalAuthDb.getNotifications());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (parentPhone.trim()) {
      setIsLoggedIn(true);
    }
  };

  const children = [
    {
      id: "ATH-001",
      name: "محمد أمين بن علي",
      code: "JUDO-2026-0001",
      sport: "الجودو (Judo)",
      belt: "حزام أصفر",
      beltColor: "bg-yellow-400 text-gray-900",
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
      category: "اقل من 34 كغ",
      result: "🥇 الميدالية الذهبية (المركز الأول)",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-40">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg">👨‍👩‍👧</span>
            <div>
              <h1 className="font-bold text-white text-base">بوابة أولياء الأمور</h1>
              <span className="text-xs text-blue-400">تطبيق متابعة أطفال النادي</span>
            </div>
          </div>
          <Link href="/" className="text-xs text-slate-400 hover:text-white border border-slate-800 px-3 py-1.5 rounded-lg">
            الرئيسية
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {!isLoggedIn ? (
          /* Login Card for Parent */
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-4 my-8">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2">
                📲
              </div>
              <h2 className="text-xl font-bold text-white">متابعة الأبناء والنادي</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                أدخل رقم هاتفك المسجل لدى النادي لمشاهدة مستوى طفلك، التنبيهات، وحضور الحصص.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">رقم هاتف ولي الأمر</label>
                <input
                  type="tel"
                  required
                  placeholder="0550123456"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-white text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 transition-all text-sm"
              >
                الدخول لمتابعة الأبناء ➔
              </button>
            </form>
          </div>
        ) : (
          /* Logged In Content */
          <div className="space-y-6">
            {/* Nav Tabs */}
            <div className="grid grid-cols-4 gap-1 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-center text-xs font-bold">
              <button
                onClick={() => setActiveTab("children")}
                className={`py-2 rounded-xl transition-all ${activeTab === "children" ? "bg-blue-600 text-white" : "text-slate-400"}`}
              >
                الأبناء
              </button>
              <button
                onClick={() => setActiveTab("attendance")}
                className={`py-2 rounded-xl transition-all ${activeTab === "attendance" ? "bg-blue-600 text-white" : "text-slate-400"}`}
              >
                الحضور
              </button>
              <button
                onClick={() => setActiveTab("competitions")}
                className={`py-2 rounded-xl transition-all ${activeTab === "competitions" ? "bg-blue-600 text-white" : "text-slate-400"}`}
              >
                البطولات
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`py-2 rounded-xl transition-all relative ${activeTab === "notifications" ? "bg-blue-600 text-white" : "text-slate-400"}`}
              >
                الإشعارات
                {notifications.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1 left-2"></span>
                )}
              </button>
            </div>

            {/* Children Tab */}
            {activeTab === "children" && (
              <div className="space-y-4">
                {children.map((child) => (
                  <div key={child.id} className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-black text-xl flex items-center justify-center border-2 border-blue-400">
                          {child.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-base">{child.name}</h3>
                          <span className="text-xs text-slate-400 font-mono">{child.code}</span>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${child.beltColor}`}>
                        {child.belt}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                        <span className="text-slate-400 block mb-1">المجموعة</span>
                        <span className="font-bold text-white">{child.group}</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                        <span className="text-slate-400 block mb-1">نسبة الحضور</span>
                        <span className="font-bold text-emerald-400">{child.attendanceRate}%</span>
                      </div>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 flex justify-between items-center text-xs">
                      <span className="text-emerald-400 font-bold">الاشتراك ساري وحاضر</span>
                      <span className="text-slate-300 font-mono">ينتهي: {child.subEndDate}</span>
                    </div>

                    <Link
                      href={`/qr/${child.code}`}
                      target="_blank"
                      className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold text-center block border border-slate-700"
                    >
                      📱 عرض بطاقة الـ QR الخاصة بالطوارئ
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Attendance History Tab */}
            {activeTab === "attendance" && (
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-3">
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
                  <div key={comp.id} className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-2">
                    <div className="font-bold text-white text-sm">{comp.title}</div>
                    <div className="text-xs text-slate-400 font-mono">الفئة: {comp.category} | التاريخ: {comp.date}</div>
                    <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-amber-300 font-bold text-xs mt-2">
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
                  <div key={notif.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-1">
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
    </div>
  );
}

function AttendanceRow({ date, status, session }: { date: string; status: string; session: string }) {
  return (
    <div className="flex justify-between items-center p-3 bg-slate-950 rounded-xl text-xs border border-slate-800">
      <div>
        <span className="font-bold text-white block">{session}</span>
        <span className="text-slate-500 font-mono text-[10px]">{date}</span>
      </div>
      <span className={`px-2.5 py-1 rounded-full font-bold ${status === "حاضر" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
        {status}
      </span>
    </div>
  );
}
