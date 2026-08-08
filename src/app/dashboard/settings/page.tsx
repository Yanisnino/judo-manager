"use client";

import { useState } from "react";

export default function ClubSettingsPage() {
  const [clubName, setClubName] = useState("نادي الأبطال للجودو والفنون القتالية");
  const [ownerName, setOwnerName] = useState("محمد بن سالم");
  const [phone, setPhone] = useState("0550123456");
  const [language, setLanguage] = useState("ar");
  const [currency, setCurrency] = useState("DZD");
  const [showEmergencyOnQr, setShowEmergencyOnQr] = useState(true);
  const [sendExpiryAlerts, setSendExpiryAlerts] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900">إعدادات النادي والتطبيق</h1>
        <p className="text-gray-500 text-sm mt-1">
          إدارة بيانات النادي، خيارات الأمان والخصوصية، ولغة الواجهة
        </p>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-2xl text-sm font-bold animate-in fade-in">
          ✓ تم حفظ الإعدادات بنجاح!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Club Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2">بيانات النادي الأساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">اسم النادي</label>
              <input
                type="text"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">اسم المدير / صاحب الحساب</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">رقم هاتف النادي الرئيسي</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">العملة الافتراضية</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
              >
                <option value="DZD">الدينار الجزائري (دج / DZD)</option>
                <option value="EUR">اليورو (€)</option>
                <option value="USD">الدولار ($)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy & QR Security */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2">إعدادات الخصوصية والبطاقات الرقمية (QR)</h2>

          <div className="space-y-4 text-sm">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showEmergencyOnQr}
                onChange={(e) => setShowEmergencyOnQr(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-bold text-gray-900 block">إظهار أزرار اتصال الطوارئ عند مسح كود الـ QR</span>
                <span className="text-gray-500 text-xs">يتيح لمن يجد بطاقة الطفل مفقودة الاتصال الفوري بولي الأمر والنادي دون كشف عنوان المنزل أو البيانات الحساسة.</span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={sendExpiryAlerts}
                onChange={(e) => setSendExpiryAlerts(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-bold text-gray-900 block">تفعيل التذكيرات الفورية لاقتراب انتهاء الاشتراك</span>
                <span className="text-gray-500 text-xs">إرسال إشعار داخل التطبيق وتذكير تلقائي قبل 7 أيام وقبل 3 أيام من نهاية الاشتراك.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Database & Data Privacy Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2">مسار حفظ البيانات وأمان الخصوصية</h2>
          <div className="space-y-3 text-xs leading-relaxed">
            <p className="text-gray-600 font-semibold">
              يتم حفظ بيانات النادي الحقيقية (اللاعبين، الحضور، والمالية) أوفلاين بشكل دائم في مجلد محمي على حاسوبك:
            </p>
            <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl dir-ltr text-left overflow-x-auto shadow-inner">
              %APPDATA%\JudoManagerProData\athletes.json
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl font-bold flex items-center gap-2 text-xs">
              <span>🛡️</span>
              <span>بياناتك محفوظة 100% ولن تتأثر أو تُحذف عند تثبيت أي تحديثات جديدة للبرنامج.</span>
            </div>
          </div>
        </div>

        {/* Language & Localisation */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2">لغة واجهة النظام (Language)</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <button
              type="button"
              onClick={() => setLanguage("ar")}
              className={`p-4 rounded-xl border font-bold text-center transition-all ${
                language === "ar"
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              🇩🇿 العربية (RTL)
            </button>
            <button
              type="button"
              onClick={() => setLanguage("fr")}
              className={`p-4 rounded-xl border font-bold text-center transition-all ${
                language === "fr"
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              🇫🇷 Français (LTR)
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all"
          >
            💾 حفظ التغييرات والإعدادات
          </button>
        </div>
      </form>
    </div>
  );
}
