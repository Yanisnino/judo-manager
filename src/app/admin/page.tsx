"use client";

import { useState, useEffect } from "react";
import { getAdminRequests, approveRequest, LicenseRequest } from "@/lib/licenseSystem";

export default function AdminControlPage() {
  const [requests, setRequests] = useState<LicenseRequest[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    setRequests(getAdminRequests());
  }, []);

  const handleApprove = (id: string) => {
    const res = approveRequest(id);
    if (res) {
      setRequests(getAdminRequests());
      alert(`تم قبول الطلب وتوليد المفتاح: ${res.key}`);
    }
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 selection:bg-blue-600 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-600/30">
              ⚙️
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">لوحة تفعيل اشتراكات أندية الجودو (Admin Panel)</h1>
              <p className="text-xs text-slate-400">إدارة طلبات التجربة المجانية والتحويلات عبر BaridiMob وتوليد المفاتيح</p>
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href="https://wa.me/213553823611"
              target="_blank"
              className="px-4 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold rounded-xl text-xs hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1.5"
            >
              💬 واتساب المبرمج (0553823611)
            </a>
            <a
              href="https://t.me/nisoo09"
              target="_blank"
              className="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold rounded-xl text-xs hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1.5"
            >
              ✈️ تلغرام (@nisoo09)
            </a>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📋</span> قائمة الطلبات المسجلة من الأندية ({requests.length})
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
                  <th className="p-3.5">وصل BaridiMob</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5 text-left">إجراء التفعيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-500 font-bold">
                      لا توجد طلبات جديدة حالياً.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-800/40 transition-all">
                      <td className="p-3.5 font-mono text-slate-400 font-bold">{req.id}</td>
                      <td className="p-3.5 font-bold text-white">{req.clubName}</td>
                      <td className="p-3.5">
                        <span className="block text-slate-300 font-medium">{req.managerName}</span>
                        <span className="font-mono text-blue-400 text-[11px]">{req.phone}</span>
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
                        {req.receiptUrl ? (
                          <span className="text-slate-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 font-mono text-[11px] block max-w-[180px] truncate">
                            {req.receiptUrl}
                          </span>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        {req.status === "APPROVED" ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                            ✅ تم القبول والتفعيل
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
                            <span className="font-mono text-emerald-400 font-black bg-slate-950 px-3 py-1 rounded-xl border border-emerald-500/30 text-xs">
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
                                href={`https://wa.me/213${req.phone.replace(/^0/, "")}?text=مرحباً%20${encodeURIComponent(req.managerName)}،%20تم%20قبول%20طلبكم%20لنظام%20JudoManager!%20مفتاح%20التفعيل%20الخاص%20بكم%20هو:%20${req.generatedKey}`}
                                target="_blank"
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px]"
                              >
                                💬 إرسال واتساب
                              </a>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleApprove(req.id)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-md text-xs"
                          >
                            ⚡ موافقة وتوليد المفتاح
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
