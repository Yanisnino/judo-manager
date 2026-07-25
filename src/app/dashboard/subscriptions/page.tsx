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

const initialSubscriptions: SubscriptionItem[] = [
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
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(initialSubscriptions);
  const [filter, setFilter] = useState("all");
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSub, setEditingSub] = useState<SubscriptionItem | null>(null);
  const [receiptSub, setReceiptSub] = useState<SubscriptionItem | null>(null);

  // Form states
  const [athleteName, setAthleteName] = useState("");
  const [planName, setPlanName] = useState("اشتراك شهري عادي");
  const [amount, setAmount] = useState(2500);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("2026-08-30");
  const [status, setStatus] = useState<"paid" | "pending" | "expired">("paid");

  const filteredSubs = subscriptions.filter((s) => {
    if (filter === "all") return true;
    return s.status === filter;
  });

  const totalRevenue = subscriptions.reduce((sum, s) => sum + s.amount, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSub: SubscriptionItem = {
      id: "SUB-" + (subscriptions.length + 101),
      athleteName,
      planName,
      amount: Number(amount),
      startDate,
      endDate,
      status,
    };
    setSubscriptions([newSub, ...subscriptions]);
    setShowAddModal(false);
    resetForm();
  };

  const handleRenew = (sub: SubscriptionItem) => {
    const today = new Date();
    const nextMonth = new Date(today.setMonth(today.getMonth() + 1)).toISOString().split("T")[0];
    
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === sub.id
          ? {
              ...s,
              startDate: new Date().toISOString().split("T")[0],
              endDate: nextMonth,
              status: "paid",
            }
          : s
      )
    );
    alert(`تم تجديد اشتراك اللاعب "${sub.athleteName}" لغاية ${nextMonth} بنجاح!`);
  };

  const handleEditClick = (sub: SubscriptionItem) => {
    setEditingSub(sub);
    setAthleteName(sub.athleteName);
    setPlanName(sub.planName);
    setAmount(sub.amount);
    setStartDate(sub.startDate);
    setEndDate(sub.endDate);
    setStatus(sub.status);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub) return;

    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === editingSub.id
          ? {
              ...s,
              athleteName,
              planName,
              amount: Number(amount),
              startDate,
              endDate,
              status,
            }
          : s
      )
    );
    setEditingSub(null);
    resetForm();
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`هل أنت تأكد من رغبتك في حذف سجل اشتراك اللاعب "${name}"؟`)) {
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const resetForm = () => {
    setAthleteName("");
    setPlanName("اشتراك شهري عادي");
    setAmount(2500);
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate("2026-08-30");
    setStatus("paid");
  };

  return (
    <div className="space-y-6">
      {/* Top Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">إدارة الاشتراكات والمدفوعات</h1>
          <p className="text-gray-500 text-sm mt-1">
            تسجيل المدفوعات، التجديد بنقرة واحدة، طباعة وصل الدفع، وتعديل وحذف الاشتراكات
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 text-sm"
        >
          <span>💳</span> تسجيل دفعة جديدة
        </button>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-bold text-gray-400 block mb-1">مداخيل الاشتراكات المحسوبة</span>
          <div className="text-3xl font-black text-emerald-600">{totalRevenue} دج</div>
          <span className="text-xs text-gray-500 mt-2 block">سجل مالي محدث بدقة</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-bold text-gray-400 block mb-1">اشتراكات تنتهي قريباً</span>
          <div className="text-3xl font-black text-amber-500">
            {subscriptions.filter((s) => s.status === "pending").length} لاعبين
          </div>
          <span className="text-xs text-amber-600 font-semibold mt-2 block">يحتاجون تذكيرات تجديد</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-bold text-gray-400 block mb-1">اشتراكات منتهية</span>
          <div className="text-3xl font-black text-rose-600">
            {subscriptions.filter((s) => s.status === "expired").length} لاعبين
          </div>
          <span className="text-xs text-rose-500 font-semibold mt-2 block">جاهزة للتجديد الفوري</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === "all" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          جميع الاشتراكات ({subscriptions.length})
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
              <th className="p-4">من - إلى</th>
              <th className="p-4">حالة الدفع</th>
              <th className="p-4 text-center">إجراءات التحكم</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSubs.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="p-4 font-bold text-gray-900">{sub.athleteName}</td>
                <td className="p-4 text-gray-600">{sub.planName}</td>
                <td className="p-4 font-mono font-bold text-gray-900">{sub.amount} دج</td>
                <td className="p-4 text-gray-500 font-mono text-xs">
                  {sub.startDate} ➔ {sub.endDate}
                </td>
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
                <td className="p-4 flex items-center justify-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => handleRenew(sub)}
                    className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold text-xs transition-all border border-emerald-200"
                    title="تجديد الاشتراك شهر إضافي"
                  >
                    🔄 تجديد
                  </button>
                  <button
                    onClick={() => setReceiptSub(sub)}
                    className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold text-xs transition-all border border-blue-200"
                    title="طباعة وصل الدفع"
                  >
                    🧾 وصل
                  </button>
                  <button
                    onClick={() => handleEditClick(sub)}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-xs border"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(sub.id, sub.athleteName)}
                    className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-bold text-xs border border-rose-200"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Subscription Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-bold text-gray-900">تسجيل دفعة واشتراك جديد</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 font-bold text-xl">✕</button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">اسم اللاعب</label>
                <input
                  type="text"
                  required
                  placeholder="محمد أمين"
                  value={athleteName}
                  onChange={(e) => setAthleteName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-gray-50 font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">نوع الاشتراك</label>
                  <select
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-gray-50 font-bold"
                  >
                    <option>اشتراك شهري عادي</option>
                    <option>اشتراك 3 أشهر مكثف</option>
                    <option>اشتراك سنوي شامل</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">المبلغ (دج)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl bg-gray-50 font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">تاريخ البداية</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-gray-50 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">تاريخ النهاية</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-gray-50 font-mono"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600 font-semibold">إلغاء</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-lg">حفظ الدفعة وتوليد الوصل</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Subscription Modal */}
      {editingSub && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-bold text-gray-900">تعديل بيانات الاشتراك ({editingSub.id})</h2>
              <button onClick={() => setEditingSub(null)} className="text-gray-400 font-bold text-xl">✕</button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">اسم اللاعب</label>
                <input
                  type="text"
                  required
                  value={athleteName}
                  onChange={(e) => setAthleteName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-gray-50 font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">المبلغ (دج)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl bg-gray-50 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">حالة الدفع</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl bg-gray-50 font-bold"
                  >
                    <option value="paid">مسدد (Paid)</option>
                    <option value="pending">ينتهي قريباً (Pending)</option>
                    <option value="expired">منتهي (Expired)</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t">
                <button type="button" onClick={() => setEditingSub(null)} className="px-4 py-2 text-gray-600 font-semibold">إلغاء</button>
                <button type="submit" className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-lg">تحديث الاشتراك</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {receiptSub && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3 print:hidden">
              <h3 className="font-bold text-gray-900 text-lg">وصل تسديد الاشتراك الرسمي</h3>
              <button onClick={() => setReceiptSub(null)} className="text-gray-400 font-bold text-xl">✕</button>
            </div>

            <div className="border-2 border-dashed border-gray-300 p-5 rounded-2xl space-y-4 text-gray-900 bg-gray-50/50">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h4 className="font-black text-blue-900 text-base">نادي الأبطال للرياضات القتالية</h4>
                  <span className="text-xs text-gray-500 font-mono">رقم الوصل: {receiptSub.id}</span>
                </div>
                <span className="text-2xl">🥋</span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">اسم اللاعب:</span>
                  <span className="font-bold text-gray-900">{receiptSub.athleteName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">نوع الاشتراك:</span>
                  <span className="font-bold text-gray-900">{receiptSub.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">المبلغ المسدد:</span>
                  <span className="font-bold text-emerald-600 font-mono text-base">{receiptSub.amount} دج</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">فترة الصلاحية:</span>
                  <span className="font-mono text-gray-800">{receiptSub.startDate} ➔ {receiptSub.endDate}</span>
                </div>
              </div>

              <div className="pt-3 border-t text-[11px] text-gray-500 flex justify-between">
                <span>تخت وختم النادي الرسمي</span>
                <span>تاريخ الإصدار: {new Date().toLocaleDateString("ar-DZ")}</span>
              </div>
            </div>

            <div className="flex gap-3 print:hidden">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md"
              >
                🖨️ طباعة الوصل الآن
              </button>
              <button
                onClick={() => setReceiptSub(null)}
                className="px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
