"use client";

import { useState } from "react";

interface SubscriptionItem {
  id: string;
  athleteName: string;
  planName: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: "paid" | "pending" | "expired";
}

const mockSubscriptions: SubscriptionItem[] = [
  {
    id: "SUB-101",
    athleteName: "محمد أمين بن علي",
    planName: "اشتراك شهري عادي",
    amount: 2500,
    startDate: "2026-07-01",
    endDate: "2026-08-01",
    status: "paid",
  },
  {
    id: "SUB-102",
    athleteName: "أحمد ياسين زروقي",
    planName: "اشتراك شهري عادي",
    amount: 2500,
    startDate: "2026-06-25",
    endDate: "2026-07-25",
    status: "pending",
  },
  {
    id: "SUB-103",
    athleteName: "يوسف بلقاسم",
    planName: "اشتراك 3 أشهر مكثف",
    amount: 6500,
    startDate: "2026-04-10",
    endDate: "2026-07-10",
    status: "expired",
  },
  {
    id: "SUB-104",
    athleteName: "سارة حداد",
    planName: "اشتراك سنوي شامل",
    amount: 22000,
    startDate: "2026-01-01",
    endDate: "2027-01-01",
    status: "paid",
  },
];

export default function SubscriptionsPage() {
  const [filter, setFilter] = useState("all");

  const filteredSubs = mockSubscriptions.filter((s) => {
    if (filter === "all") return true;
    return s.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Top Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">إدارة الاشتراكات والمدفوعات</h1>
          <p className="text-gray-500 text-sm mt-1">
            متابعة تجديد الاشتراكات، تسجيل المدفوعات وإرسال تذكيرات للأولياء
          </p>
        </div>
        <button
          onClick={() => alert("سيتم تسجيل الدفعة وتوليد الإيصال")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
        >
          <span>💳</span> تسجيل دفعة جديدة
        </button>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-bold text-gray-400 block mb-1">مداخيل الشهر الحالي</span>
          <div className="text-3xl font-black text-emerald-600">145,000 دج</div>
          <span className="text-xs text-gray-500 mt-2 block">مقارنة بـ 128,000 دج الشهر الماضي</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-bold text-gray-400 block mb-1">اشتراكات تنتهي خلال 7 أيام</span>
          <div className="text-3xl font-black text-amber-500">8 لاعبين</div>
          <span className="text-xs text-amber-600 font-semibold mt-2 block">يحتاجون إلى إشعارات تذكير</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-bold text-gray-400 block mb-1">اشتراكات منتهية غير مسددة</span>
          <div className="text-3xl font-black text-rose-600">5 لاعبين</div>
          <span className="text-xs text-rose-500 font-semibold mt-2 block">المبلغ المعلق: 12,500 دج</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === "all" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          جميع الاشتراكات ({mockSubscriptions.length})
        </button>
        <button
          onClick={() => setFilter("paid")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === "paid" ? "bg-emerald-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          نشطة ومسددة (Paid)
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === "pending" ? "bg-amber-500 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          تنتهي قريباً (Pending)
        </button>
        <button
          onClick={() => setFilter("expired")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === "expired" ? "bg-rose-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          منتهية (Expired)
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold text-xs">
            <tr>
              <th className="p-4">اللاعب</th>
              <th className="p-4">نوع الاشتراك</th>
              <th className="p-4">المبلغ</th>
              <th className="p-4">تاريخ البداية</th>
              <th className="p-4">تاريخ النهاية</th>
              <th className="p-4">حالة الدفع</th>
              <th className="p-4">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSubs.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="p-4 font-bold text-gray-900">{sub.athleteName}</td>
                <td className="p-4 text-gray-600">{sub.planName}</td>
                <td className="p-4 font-mono font-bold text-gray-900">{sub.amount} دج</td>
                <td className="p-4 text-gray-500 font-mono text-xs">{sub.startDate}</td>
                <td className="p-4 text-gray-500 font-mono text-xs">{sub.endDate}</td>
                <td className="p-4">
                  {sub.status === "paid" && (
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                      مسدد (Paid)
                    </span>
                  )}
                  {sub.status === "pending" && (
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">
                      ينتهي قريباً
                    </span>
                  )}
                  {sub.status === "expired" && (
                    <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-xs font-bold">
                      منتهي
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => alert(`تم إرسال إشعار تذكير لولي أمر ${sub.athleteName}`)}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-semibold text-xs transition-all border border-blue-200"
                  >
                    📩 إشعار تذكير
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
