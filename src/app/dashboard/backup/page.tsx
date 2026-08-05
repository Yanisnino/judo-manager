"use client";

import { useState, useEffect, useRef } from "react";
import { GoogleSheetsSyncEngine, BackupData } from "@/lib/googleSheetsSync";

export default function BackupPage() {
  const [sheetUrl, setSheetUrl] = useState("");
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Fetch REAL system data for payload
  const getRealBackupPayload = async (): Promise<BackupData> => {
    let athletes: any[] = [];
    let subscriptions: any[] = [];
    let beltExams: any[] = [];

    // 1. Fetch real athletes from API
    try {
      const res = await fetch("/api/athletes");
      if (res.ok) {
        athletes = await res.json();
      }
    } catch (e) {
      console.error("Failed to fetch athletes for backup", e);
    }

    // 2. Fetch real subscriptions from localStorage
    try {
      const storedSubs = localStorage.getItem("judo_subscriptions_v1");
      if (storedSubs) subscriptions = JSON.parse(storedSubs);
    } catch (e) {
      console.error("Failed to fetch subscriptions for backup", e);
    }

    // 3. Fetch real belt exams from localStorage
    try {
      const storedExams = localStorage.getItem("judo_belt_exams_v1");
      if (storedExams) beltExams = JSON.parse(storedExams);
    } catch (e) {
      console.error("Failed to fetch belt exams for backup", e);
    }

    return {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      clubName: "نادي الجودو والرياضات القتالية",
      athletes,
      attendance: [],
      subscriptions,
      belts: beltExams,
    };
  };

  const handleManualSync = async () => {
    setIsLoading(true);
    setSyncStatus("جاري تجميع البيانات الحقيقية والمزامنة مع غوغل شيت...");

    const payload = await getRealBackupPayload();
    const result = await GoogleSheetsSyncEngine.syncToGoogleSheets(payload);

    const now = new Date().toLocaleString("ar-DZ");
    localStorage.setItem("judo_last_sync_time", now);
    setLastSyncTime(now);

    setIsLoading(false);
    setSyncStatus(result.message);
  };

  const handleDownloadBackup = async () => {
    setIsLoading(true);
    const payload = await getRealBackupPayload();
    GoogleSheetsSyncEngine.downloadLocalJsonBackup(payload);
    setIsLoading(false);
    setSyncStatus("✓ تم تحميل ملف النسخة الاحتياطية الحقيقية بنجاح!");
    setTimeout(() => setSyncStatus(null), 4000);
  };

  // Handle restoring data from local JSON file
  const handleRestoreFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const backupData: BackupData = JSON.parse(content);

        if (!backupData || !Array.isArray(backupData.athletes)) {
          alert("تنبيه: ملف النسخة الاحتياطية غير صالح أو صيغته خاطئة!");
          return;
        }

        if (!confirm(`هل أنت متأكد من استرجاع البيانات؟ سيتم استرجاع ${backupData.athletes.length} لاعبين و ${backupData.subscriptions?.length || 0} اشتراكات.`)) {
          return;
        }

        setIsLoading(true);

        // 1. Restore athletes to system
        for (const ath of backupData.athletes) {
          await fetch("/api/athletes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ath),
          });
        }

        // 2. Restore subscriptions to localStorage
        if (Array.isArray(backupData.subscriptions)) {
          localStorage.setItem("judo_subscriptions_v1", JSON.stringify(backupData.subscriptions));
        }

        // 3. Restore belt exams to localStorage
        if (Array.isArray(backupData.belts)) {
          localStorage.setItem("judo_belt_exams_v1", JSON.stringify(backupData.belts));
        }

        setIsLoading(false);
        alert("🎉 تم استرجاع واستعادة كافة بيانات النادي بنجاح!");
        window.location.reload();
      } catch (err) {
        setIsLoading(false);
        alert("حدث خطأ أثناء قراءة واسترجاع ملف النسخة الاحتياطية!");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900">النسخ الاحتياطي والمزامنة مع غوغل شيت</h1>
        <p className="text-gray-500 text-sm mt-1">
          حفظ بيانات النادي الحقيقية أوفلاين على جهازك ومزامنتها تلقائياً مع Google Sheets كاحتياط آمن
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
          أدخل رابط <strong>Google Apps Script Webhook URL</strong> المباشر لنقل الحضور، واللاعبين والاشتراكات لجدولك في غوغل تلقائياً.
        </p>

        <form onSubmit={handleSaveUrl} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">رابط Google Sheet Webhook URL (مثال: https://script.google.com/macros/s/.../exec)</label>
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-xs"
            />
          </div>

          <div className="flex justify-between items-center flex-wrap gap-2 pt-1">
            <details className="text-xs text-gray-600 cursor-pointer">
              <summary className="font-bold text-blue-600 hover:underline">💡 كيف أحصل على رابط Webhook الخاص بشيت غوغل؟ (اضغط هنا)</summary>
              <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2 text-[11px] text-gray-700 leading-relaxed">
                <p>1. افتح جدول غوغل شيت الخاص بك واذهب إلى: <strong>Extensions ➔ Apps Script</strong> (الإضافات ➔ نص برمجيات تطبيق).</p>
                <p>2. امسح الكود القديم وضّع الكود التالي ثم اضغط <strong>Deploy ➔ New Deployment ➔ Web App</strong> (نشر ➔ نشر جديد ➔ تطبيق ويب) واجعل من يمكنه الوصول <em>Anyone (أي شخص)</em>:</p>
                <pre className="bg-slate-900 text-emerald-400 p-2.5 rounded-lg overflow-x-auto font-mono text-[10px] dir-ltr text-left">
                  {`function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([new Date(), "نسخة احتياطية", JSON.stringify(data)]);
  return ContentService.createTextOutput("OK");
}`}
                </pre>
                <p>3. انسخ رابط <strong>Web App URL</strong> وضع الرابط فوق واضغط حفظ!</p>
              </div>
            </details>

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md mr-auto"
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
          تستطيع تحميل ملف النسخة الاحتياطية كاملاً على جهاز الكمبيوتر في أي وقت، واستعادته بنقرة واحدة بدون الحاجة لإنترنت.
        </p>

        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={handleRestoreFile}
          className="hidden"
        />

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            onClick={handleDownloadBackup}
            disabled={isLoading}
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition-all border border-gray-300 flex items-center justify-center gap-2"
          >
            <span>📥</span> تحميل ملف النسخة الاحتياطية الحقيقية (.JSON)
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex-1 py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs transition-all border border-blue-200 flex items-center justify-center gap-2"
          >
            <span>📤</span> استرجاع البيانات من ملف محلي (.JSON)
          </button>
        </div>
      </div>
    </div>
  );
}
