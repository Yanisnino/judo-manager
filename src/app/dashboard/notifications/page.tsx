"use client";

import { useState, useEffect } from "react";
import { LocalAuthDb } from "@/lib/localAuthDb";

export default function ClubNotificationsPage() {
  const [targetGroup, setTargetGroup] = useState("all");
  const [notifType, setNotifType] = useState("تذكير بحصة تدريبية");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    setNotifications(LocalAuthDb.getNotifications());
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    LocalAuthDb.sendNotification({
      title,
      message,
      target: targetGroup,
    });

    setNotifications(LocalAuthDb.getNotifications());
    setStatusMsg("✓ تم إرسال وتوجيه الإشعار لأولياء الأمور بنجاح!");
    setTitle("");
    setMessage("");
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleWhatsAppSend = (parentPhone: string, text: string) => {
    const cleanPhone = parentPhone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("0") ? "213" + cleanPhone.slice(1) : cleanPhone;
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900">نظام الإشعارات والتواصل مع الأولياء</h1>
        <p className="text-gray-500 text-sm mt-1">
          إرسال وتوجيه إشعارات فورية حول الحصص التدريبية، تغيير المواعيد، والبطولات لأولياء الأمور عبر التطبيق وواتساب
        </p>
      </div>

      {statusMsg && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-2xl text-sm font-bold animate-in fade-in">
          {statusMsg}
        </div>
      )}

      {/* Dispatch Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 border-b pb-2">إنشاء إشعار / إعلان جديد للأولياء</h2>

        <form onSubmit={handleSend} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">فئة المستهدفين</label>
              <select
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
              >
                <option value="all">جميع أولياء الأمور</option>
                <option value="براعم">براعم (6-9 سنوات)</option>
                <option value="أشبال">أشبال (10-12 سنة)</option>
                <option value="أواسط">أواسط (13-16 سنة)</option>
                <option value="absent">اللاعبون الغائبون في الحصة الأخيرة</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">نوع الإشعار</label>
              <select
                value={notifType}
                onChange={(e) => {
                  setNotifType(e.target.value);
                  if (!title) setTitle(e.target.value);
                }}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
              >
                <option>تذكير بحصة تدريبية</option>
                <option>تغيير موعد التدريب / إلغاء حصة</option>
                <option>إشعار بطولة ومعاينة نتائج</option>
                <option>إشعار اختبار حزام جديد</option>
                <option>إعلان عام من النادي</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">عنوان الإشعار</label>
            <input
              type="text"
              required
              placeholder="مثال: تغيير موعد حصة الأشبال اليوم"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">محتوى الرسالة</label>
            <textarea
              required
              rows={3}
              placeholder="نحيطكم علماً بأن..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            ></textarea>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleWhatsAppSend("0550123456", `*${title}*\n${message}`)}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-2"
            >
              <span>💬</span> إرسال مباشر عبر WhatsApp
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/20"
            >
              🚀 إرسال للتطبيق (Push Notification)
            </button>
          </div>
        </form>
      </div>

      {/* Sent Notifications Log */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 border-b pb-2">سجل الإشعارات المرسلة</h2>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 text-sm">{n.title}</span>
                <span className="text-xs text-gray-400 font-mono">{n.date}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{n.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
