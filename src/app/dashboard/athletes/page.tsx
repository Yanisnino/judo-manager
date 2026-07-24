"use client";

import { useState } from "react";
import Link from "next/link";

interface Athlete {
  id: string;
  name: string;
  code: string;
  belt: string;
  beltColor: string;
  group: string;
  age: number;
  phone: string;
  subStatus: "paid" | "pending" | "expired";
  status: "active" | "inactive";
}

const mockAthletes: Athlete[] = [
  {
    id: "ATH-001",
    name: "محمد أمين بن علي",
    code: "JUDO-2026-0001",
    belt: "حزام أصفر",
    beltColor: "bg-yellow-400 text-gray-900",
    group: "أشبال (10-12 سنة)",
    age: 11,
    phone: "0555123456",
    subStatus: "paid",
    status: "active",
  },
  {
    id: "ATH-002",
    name: "أحمد ياسين زروقي",
    code: "JUDO-2026-0002",
    belt: "حزام برتقالي",
    beltColor: "bg-orange-500 text-white",
    group: "أشبال (10-12 سنة)",
    age: 12,
    phone: "0661987654",
    subStatus: "pending",
    status: "active",
  },
  {
    id: "ATH-003",
    name: "يوسف بلقاسم",
    code: "JUDO-2026-0003",
    belt: "حزام أخضر",
    beltColor: "bg-emerald-600 text-white",
    group: "أواسط (13-16 سنة)",
    age: 15,
    phone: "0770112233",
    subStatus: "expired",
    status: "active",
  },
  {
    id: "ATH-004",
    name: "سارة حداد",
    code: "JUDO-2026-0004",
    belt: "حزام أبيض",
    beltColor: "bg-gray-100 text-gray-800 border border-gray-300",
    group: "براعم (6-9 سنوات)",
    age: 8,
    phone: "0550445566",
    subStatus: "paid",
    status: "active",
  },
  {
    id: "ATH-005",
    name: "عبد الرؤوف دراجي",
    code: "JUDO-2026-0005",
    belt: "حزام أزرق",
    beltColor: "bg-blue-600 text-white",
    group: "كبار (+17 سنة)",
    age: 20,
    phone: "0663778899",
    subStatus: "paid",
    status: "active",
  },
];

export default function AthletesPage() {
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredAthletes = mockAthletes.filter((a) => {
    const matchesSearch =
      a.name.includes(search) ||
      a.code.toLowerCase().includes(search.toLowerCase()) ||
      a.phone.includes(search);
    const matchesGroup = filterGroup === "all" || a.group.includes(filterGroup);
    const matchesStatus = filterStatus === "all" || a.subStatus === filterStatus;
    return matchesSearch && matchesGroup && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">إدارة اللاعبين</h1>
          <p className="text-gray-500 text-sm mt-1">
            قائمة جميع الرياضيين المسجلين بالنادي وحالة اشتراكاتهم وأحزمتهم
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
        >
          <span>➕</span> إضافة لاعب جديد
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <span className="absolute right-3 top-3 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="البحث باسم اللاعب، الكود، أو رقم الهاتف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <select
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.target.value)}
          className="py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="all">جميع المجموعات</option>
          <option value="براعم">براعم (6-9)</option>
          <option value="أشبال">أشبال (10-12)</option>
          <option value="أواسط">أواسط (13-16)</option>
          <option value="كبار">كبار (+17)</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="all">جميع حالات الاشتراك</option>
          <option value="paid">اشتراك نشط (ساري)</option>
          <option value="pending">معلق (قريب الانتهاء)</option>
          <option value="expired">منتهي الاشتراك</option>
        </select>
      </div>

      {/* Athletes Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAthletes.map((athlete) => (
          <div
            key={athlete.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-black text-lg flex items-center justify-center border-2 border-blue-200">
                    {athlete.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">
                      {athlete.name}
                    </h3>
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">
                      {athlete.code}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${athlete.beltColor}`}
                >
                  {athlete.belt}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">المجموعة:</span>
                  <span className="font-semibold text-gray-800">{athlete.group}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">العمر:</span>
                  <span className="font-semibold text-gray-800">{athlete.age} سنة</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">الهاتف:</span>
                  <span className="font-mono text-gray-800">{athlete.phone}</span>
                </div>
              </div>
            </div>

            {/* Footer Status & Actions */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                {athlete.subStatus === "paid" && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    اشتراك نشط
                  </span>
                )}
                {athlete.subStatus === "pending" && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    ينتهي قريباً
                  </span>
                )}
                {athlete.subStatus === "expired" && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    منتهي
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/qr/${athlete.code}`}
                  target="_blank"
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-all border border-gray-200 text-xs font-semibold flex items-center gap-1"
                  title="عرض بطاقة الـ QR"
                >
                  📱 QR
                </Link>
                <Link
                  href={`/dashboard/athletes/${athlete.id}`}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all"
                >
                  الملف الكامل
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Athlete Modal Mock */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-bold text-gray-900">تسجيل لاعب جديد</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>
            <form className="space-y-4 text-sm" onSubmit={(e) => { e.preventDefault(); setShowAddModal(false); }}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">الاسم الأول</label>
                  <input type="text" required placeholder="محمد" className="w-full p-2.5 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">اللقب</label>
                  <input type="text" required placeholder="أمين" className="w-full p-2.5 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">تاريخ الميلاد</label>
                  <input type="date" required className="w-full p-2.5 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">المجموعة التدريبية</label>
                  <select className="w-full p-2.5 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500">
                    <option>براعم (6-9)</option>
                    <option>أشبال (10-12)</option>
                    <option>أواسط (13-16)</option>
                    <option>كبار (+17)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">رقم هاتف ولي الأمر / اللاعب</label>
                <input type="tel" required placeholder="0550123456" className="w-full p-2.5 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20"
                >
                  حفظ البيانات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
