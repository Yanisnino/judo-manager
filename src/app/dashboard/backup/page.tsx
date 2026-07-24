"use client";

import { useState, useEffect } from "react";
import { GoogleSheetsSyncEngine, BackupData } from "@/lib/googleSheetsSync";

export default function BackupPage() {
  const [sheetUrl, setSheetUrl] = useState("");
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSheetUrl(GoogleSheetsSyncEngine.getSheetUrl());
    const lastTime = localStorage.getItem("judo_last_sync_time");
    if (lastTime) setLastSyncTime(lastTime);
  }, []);

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    GoogleSheetsSyncEngine.setSheetUrl(sheetUrl);
    setSyncStatus("✓ تم حفظ رابط غوغل شيت بنجاح!");
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const getBackupPayload = (): BackupData => {
    return {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      clubName: "نادي الأبطال للجودو والفنون القتالية",
      athletes: [
        { id: "ATH-001", name: "محمد أمين بن علي", belt: "أصفر", phone: "0555123456" },
        { id: "ATH-002", name: "أحمد ياسين زروقي", belt: "برتقالي", phone: "0661987654" },
        { id: "ATH-003", name: "يوسف بلقاسم", belt: "أخضر", phone: "0770112233" },
      ],
      attendance: [
        { date: "2026-07-20", athleteId: "ATH-001", status: "حاضر" },
        { date: "2026-07-20", athleteId: "ATH-002", status: "حاضر" },
      ],
      subscriptions: [
        { id: "SUB-101", athleteName: "محمد أمين بن علي", amount: 2500, status: "paid" },
      ],
      belts: [
        { name: "حزام أصفر", count: 24 },
        { name: "حزام برتقالي", count: 18 },
      ],
    };
  };

  const handleManualSync = async () => {
    setIsLoading(true);
    setSyncStatus("جاري المزامنة مع غوغل شيت...");
    
    const payload = getBackupPayload();
    const result = await GoogleSheetsSyncEngine.syncToGoogleSheets(payload);
    
    const now = new Date().toLocaleString("ar-DZ");
    localStorage.setItem("judo_last_sync_time", now);
    setLastSyncTime(now);
    
    setIsLoading(false);
    setSyncStatus(result.message);
  };

  const handleDownloadBackup = () => {
    const payload = getBackupPayload();
    GoogleSheetsSyncEngine.downloadLocalJsonBackup(payload);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900">النسخ الاحتياطي والمزامنة مع غوغل شيت</h1>
        <p className="text-gray-500 text-sm mt-1">
          حفظ بيانات النادي أوفلاين على جهازك ومزامنتها تلقائياً مع Google Sheets كاحتياط آمن
        </p>
      </div>

      {/* Sync Status Banner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl">
            📊
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">حالة المزامنة والنسخ الاحتياطي</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {lastSyncTime ? `آخر مزامنة ناجحة: ${lastSyncTime}` : "لم تقم بإجراء مزامنة بعد"}
            </p>
          </div>
        </div>

        <button
          onClick={handleManualSync}
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-sm"
        >
          {isLoading ? <span>جاري المزامنة...</span> : <span>🔄 مزامنة فورية إلى غوغل شيت</span>}
        </button>
      </div>

      {syncStatus && (
        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-2xl text-sm font-bold animate-in fade-in">
          {syncStatus}
        </div>
      )}

      {/* Google Sheets Webhook Configuration */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 border-b pb-2">ربط جدول غوغل شيت (Google Sheets API)</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          أدخل رابط Google Apps Script Webhook لربط تطبيقك بـ Google Sheet خاص بك. سيقوم البرنامج بنقل كافة بيانات اللاعبين والحضور والمالية تلقائياً.
        </p>

        <form onSubmit={handleSaveUrl} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">رابط Google Sheet Webhook URL</label>
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-xs"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md"
            >
              💾 حفظ رابط غوغل شيت
            </button>
          </div>
        </form>
      </div>

      {/* Local Export & Import Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 border-b pb-2">النسخ الاحتياطي المحلي واسترجاع البيانات</h2>
        <p className="text-xs text-gray-500">
          تستطيع تحميل ملف النسخة الاحتياطية كاملاً على جهاز الكمبيوتر في أي وقت وبدون إنترنت.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            onClick={handleDownloadBackup}
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition-all border border-gray-300 flex items-center justify-center gap-2"
          >
            <span>📥</span> تحميل ملف النسخة الاحتياطية (.JSON)
          </button>
          <button
            onClick={() => alert("يرجى اختيار ملف النسخة الاحتياطية لاسترجاع البيانات")}
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition-all border border-gray-300 flex items-center justify-center gap-2"
          >
            <span>📤</span> استرجاع البيانات من ملف محلي
          </button>
        </div>
      </div>
    </div>
  );
}
