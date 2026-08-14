"use client";

import { useState, useEffect } from "react";

interface LicenseRequest {
  id: string;
  clubName: string;
  managerName: string;
  phone: string;
  email: string;
  requestType: "TRIAL_14_DAYS" | "LIFETIME_PRO";
  receiptUrl?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  generatedKey?: string;
  createdAt: string;
}

export default function AdminControlPage() {
  const [requests, setRequests] = useState<LicenseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // One-time download link states
  const [targetClubName, setTargetClubName] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

  const fetchRequestsFromMongo = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/license-requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestsFromMongo();
  }, []);

  const handleApproveInMongo = async (req: LicenseRequest) => {
    try {
      const res = await fetch("/api/license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "GENERATE_KEY",
          requestId: req.id,
          requestType: req.requestType,
          clubName: req.clubName,
          managerName: req.managerName,
          phone: req.phone,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(`✅ تم توليد المفتاح بنجاح وحفظه في MongoDB Atlas:\n${data.key}`);
        fetchRequestsFromMongo();
      }
    } catch (e) {
      alert("حدث خطأ أثناء الاتصال بقاعدة البيانات MongoDB");
    }
  };

  const handleGenerateOneTimeLink = async () => {
    if (!targetClubName.trim()) {
      alert("يرجى إدخال اسم النادي أولاً!");
      return;
    }
    setIsGeneratingLink(true);
    setGeneratedLink("");
    try {
      const res = await fetch("/api/download-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubName: targetClubName }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedLink(data.downloadUrl);
      }
    } catch (e) {
      alert("حدث خطأ أثناء إنشاء رابط التحميل المؤقت!");
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 selection:bg-purple-600 selection:text-white" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center font-black text-2xl shadow-lg shadow-purple-600/30">
              ⚡
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">لوحة الإدارة المركزية (MongoDB Atlas Admin)</h1>
              <p className="text-xs text-slate-400">التحكم بالتراخيص المركزية وقفل الأجهزة وتوليد روابط التحميل لمرة واحدة</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchRequestsFromMongo}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-purple-400 border border-purple-500/30 font-bold rounded-xl text-xs transition-all"
            >
              🔄 تحديث البيانات من MongoDB
            </button>
          </div>
        </div>

        {/* ── SECTION: توليد روابط تحميل مؤقتة لمرة واحدة ── */}
        <div className="bg-slate-900 border border-purple-500/20 rounded-3xl p-6 space-y-4 shadow-2xl">
          <h2 className="text-lg font-bold text-purple-300 flex items-center gap-2">
            <span>🔒</span> توليد رابط تحميل نظام JudoManager Pro (صالح لمرة واحدة فقط)
          </h2>
          <p className="text-xs text-slate-400">
            هذا الرابط يعمل لتنزيل النظام مرة واحدة فقط للعميل ثم يلغى تلقائياً لمنع مشاركة الملفات وحماية النظام.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="اسم النادي المستفيد من التحميل (مثال: نادي الأبطال)"
              value={targetClubName}
              onChange={(e) => setTargetClubName(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-purple-500 flex-1"
            />
            <button
              onClick={handleGenerateOneTimeLink}
              disabled={isGeneratingLink}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-600/20"
            >
              {isGeneratingLink ? "جاري التوليد..." : "⚡ توليد رابط التحميل الفردي"}
            </button>
          </div>

          {generatedLink && (
            <div className="mt-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="font-mono text-emerald-400 text-xs break-all dir-ltr">{generatedLink}</span>
              <button
                onClick={() => copyToClipboard(generatedLink)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shrink-0"
              >
                {copiedKey === generatedLink ? "✓ تم النسخ" : "📋 نسخ الرابط للعميل"}
              </button>
            </div>
          )}
        </div>

        {/* ── SECTION: قائمة طلبات التراخيص المسجلة ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📋</span> قائمة الطلبات في MongoDB Atlas ({requests.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">رقم الطلب</th>
                  <th className="p-3.5">اسم النادي / الجمعية</th>
                  <th className="p-3.5">المسؤول والهاتف</th>
                  <th className="p-3.5">نوع الطلب</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5 text-left">مفتاح التفعيل وقفل الجهاز</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400 font-bold">
                      جاري التحميل من MongoDB Atlas...
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-500 font-bold">
                      لا توجد طلبات في قاعدة البيانات حالياً.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-800/40 transition-all">
                      <td className="p-3.5 font-mono text-slate-400 font-bold">{req.id}</td>
                      <td className="p-3.5 font-bold text-white">{req.clubName}</td>
                      <td className="p-3.5">
                        <span className="block text-slate-300 font-medium">{req.managerName}</span>
                        <span className="font-mono text-purple-400 text-[11px]">{req.phone}</span>
                      </td>
                      <td className="p-3.5">
                        {req.requestType === "LIFETIME_PRO" ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                            🏆 اشتراك دائم مدى الحياة
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-[10px] border border-indigo-500/30">
                            ⏱️ تجربة 14 يوماً مجاناً
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        {req.status === "APPROVED" ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                            ✅ مفعل ومقترن بالـ MongoDB
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px]">
                            ⏳ قيد المراجعة
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-left space-y-1">
                        {req.status === "APPROVED" ? (
                          <div className="flex flex-col items-end gap-1">
                            <span className="font-mono text-emerald-400 font-black bg-slate-950 px-3 py-1 rounded-xl border border-emerald-500/30 text-xs dir-ltr">
                              {req.generatedKey}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => copyToClipboard(req.generatedKey!)}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-[10px]"
                              >
                                {copiedKey === req.generatedKey ? "✓ تم النسخ" : "📋 نسخ المفتاح"}
                              </button>
                              <a
                                href={`https://wa.me/213${req.phone.replace(/^0/, "")}?text=مرحباً%20${encodeURIComponent(req.managerName)}،%20تم%20قبول%20طلبكم!%20مفتاح%20تفعيلكم%20الخاص%20بالجهاز:%20${req.generatedKey}`}
                                target="_blank"
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px]"
                              >
                                💬 إرسال واتساب
                              </a>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleApproveInMongo(req)}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-md text-xs"
                          >
                            ⚡ موافقة وتوليد مفتاح لمرة واحدة
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
