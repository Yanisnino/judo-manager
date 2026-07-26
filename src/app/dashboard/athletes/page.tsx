"use client";

import { useState } from "react";
import Link from "next/link";
import PrintableAthleteCard from "@/components/PrintableAthleteCard";

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

const initialAthletes: Athlete[] = [];

export default function AthletesPage() {
  const [athletes, setAthletes] = useState<Athlete[]>(initialAthletes);
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);

  // Form states for Add / Edit
  const [formName, setFormName] = useState("");
  const [formAge, setFormAge] = useState(10);
  const [formPhone, setFormPhone] = useState("");
  const [formGroup, setFormGroup] = useState("أشبال (10-12 سنة)");
  const [formBelt, setFormBelt] = useState("حزام أبيض");
  const [formSubStatus, setFormSubStatus] = useState<"paid" | "pending" | "expired">("paid");

  const filteredAthletes = athletes.filter((a) => {
    const matchesSearch =
      a.name.includes(search) ||
      a.code.toLowerCase().includes(search.toLowerCase()) ||
      a.phone.includes(search);
    const matchesGroup = filterGroup === "all" || a.group.includes(filterGroup);
    const matchesStatus = filterStatus === "all" || a.subStatus === filterStatus;
    return matchesSearch && matchesGroup && matchesStatus;
  });

  const getBeltColor = (beltName: string) => {
    if (beltName.includes("أصفر")) return "bg-yellow-400 text-gray-900 font-bold";
    if (beltName.includes("برتقالي")) return "bg-orange-500 text-white font-bold";
    if (beltName.includes("أخضر")) return "bg-emerald-600 text-white font-bold";
    if (beltName.includes("أزرق")) return "bg-blue-600 text-white font-bold";
    if (beltName.includes("أسود")) return "bg-gray-900 text-white font-bold";
    return "bg-gray-100 text-gray-800 border border-gray-300 font-bold";
  };

  const handleAddAthlete = (e: React.FormEvent) => {
    e.preventDefault();
    const newAthlete: Athlete = {
      id: "ATH-" + (athletes.length + 1).toString().padStart(3, "0"),
      name: formName,
      code: `JUDO-2026-${(athletes.length + 1).toString().padStart(4, "0")}`,
      belt: formBelt,
      beltColor: getBeltColor(formBelt),
      group: formGroup,
      age: Number(formAge),
      phone: formPhone,
      subStatus: formSubStatus,
      status: "active",
    };

    setAthletes([newAthlete, ...athletes]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditClick = (athlete: Athlete) => {
    setEditingAthlete(athlete);
    setFormName(athlete.name);
    setFormAge(athlete.age);
    setFormPhone(athlete.phone);
    setFormGroup(athlete.group);
    setFormBelt(athlete.belt);
    setFormSubStatus(athlete.subStatus);
  };

  const handleUpdateAthlete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAthlete) return;

    setAthletes((prev) =>
      prev.map((a) =>
        a.id === editingAthlete.id
          ? {
              ...a,
              name: formName,
              age: Number(formAge),
              phone: formPhone,
              group: formGroup,
              belt: formBelt,
              beltColor: getBeltColor(formBelt),
              subStatus: formSubStatus,
            }
          : a
      )
    );

    setEditingAthlete(null);
    resetForm();
  };

  const handleDeleteAthlete = (id: string, name: string) => {
    if (window.confirm(`هل أنت تأكد من رغبتك في حذف اللاعب "${name}" نهائياً من النادي؟`)) {
      setAthletes((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const resetForm = () => {
    setFormName("");
    setFormAge(10);
    setFormPhone("");
    setFormGroup("أشبال (10-12 سنة)");
    setFormBelt("حزام أبيض");
    setFormSubStatus("paid");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">إدارة اللاعبين، التعديل والحذف</h1>
          <p className="text-gray-500 text-sm mt-1">
            إضافة لاعبي النادي، تعديل البيانات، طباعة بطاقات الكودبار وحذف الحسابات
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all"
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
            placeholder="البحث باسم اللاعب، الكودبار، أو رقم الهاتف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
          />
        </div>

        <select
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.target.value)}
          className="py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
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
          className="py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
        >
          <option value="all">جميع حالات الاشتراك</option>
          <option value="paid">اشتراك نشط (ساري)</option>
          <option value="pending">ينتهي قريباً</option>
          <option value="expired">منتهي الاشتراك</option>
        </select>
      </div>

      {/* Athletes Cards Grid */}
      {filteredAthletes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300 space-y-4 my-6">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-4xl mx-auto font-black shadow-inner">
            🥋
          </div>
          <h3 className="text-2xl font-black text-gray-900">نظام النادي جديد وفارغ تماماً</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            المنصة جاهزة 100% لبدء العمل بها بدقة. قم بإضافة أسرار وتسجيلات لاعبي ناديك بالضغط على الزر أدناه لتوليد الكودبار الخاص بكل رياضي.
          </p>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-sm shadow-lg shadow-blue-600/20 transition-all inline-flex items-center gap-2"
          >
            <span>➕</span> إضافة أول لاعب في النادي الان
          </button>
        </div>
      ) : (
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
                <span className={`text-xs px-2.5 py-1 rounded-full ${athlete.beltColor}`}>
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

            {/* Actions & Buttons Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  {athlete.subStatus === "paid" && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                      اشتراك نشط
                    </span>
                  )}
                  {athlete.subStatus === "pending" && (
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                      ينتهي قريباً
                    </span>
                  )}
                  {athlete.subStatus === "expired" && (
                    <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
                      منتهي
                    </span>
                  )}
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleEditClick(athlete)}
                    className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-all border border-blue-200"
                    title="تعديل بيانات اللاعب"
                  >
                    ✏️ تعديل
                  </button>
                  <button
                    onClick={() => handleDeleteAthlete(athlete.id, athlete.name)}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-all border border-rose-200"
                    title="حذف اللاعب"
                  >
                    🗑️ حذف
                  </button>
                  <Link
                    href={`/dashboard/athletes/${athlete.id}`}
                    className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    الملف
                  </Link>
                </div>
              </div>

              {/* Printable Barcode Button */}
              <div className="pt-2 border-t border-gray-200/60 flex justify-end">
                <PrintableAthleteCard athlete={athlete} />
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Add Athlete Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-bold text-gray-900">تسجيل لاعب جديد وترقيم الكودبار</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 font-bold text-xl">✕</button>
            </div>
            <form className="space-y-4 text-sm" onSubmit={handleAddAthlete}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">الاسم واللقب</label>
                  <input
                    type="text"
                    required
                    placeholder="محمد بن علي"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-gray-50 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">العمر (سنوات)</label>
                  <input
                    type="number"
                    required
                    value={formAge}
                    onChange={(e) => setFormAge(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl bg-gray-50 font-semibold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">المجموعة التدريبية</label>
                  <select
                    value={formGroup}
                    onChange={(e) => setFormGroup(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-gray-50 font-bold"
                  >
                    <option>براعم (6-9 سنوات)</option>
                    <option>أشبال (10-12 سنة)</option>
                    <option>أواسط (13-16 سنة)</option>
                    <option>كبار (+17 سنة)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">الحزام الحالي</label>
                  <select
                    value={formBelt}
                    onChange={(e) => setFormBelt(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-gray-50 font-bold"
                  >
                    <option>حزام أبيض</option>
                    <option>حزام أصفر</option>
                    <option>حزام برتقالي</option>
                    <option>حزام أخضر</option>
                    <option>حزام أزرق</option>
                    <option>حزام بني</option>
                    <option>حزام أسود</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">رقم هاتف ولي الأمر / اللاعب</label>
                <input
                  type="tel"
                  required
                  placeholder="0550123456"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-gray-50 font-mono"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600 font-semibold">إلغاء</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-lg">حفظ وتوليد الكودبار</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Athlete Modal */}
      {editingAthlete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-bold text-gray-900">تعديل بيانات اللاعب ({editingAthlete.code})</h2>
              <button onClick={() => setEditingAthlete(null)} className="text-gray-400 font-bold text-xl">✕</button>
            </div>
            <form className="space-y-4 text-sm" onSubmit={handleUpdateAthlete}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">الاسم واللقب</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-gray-50 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">العمر</label>
                  <input
                    type="number"
                    required
                    value={formAge}
                    onChange={(e) => setFormAge(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl bg-gray-50 font-semibold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">المجموعة التدريبية</label>
                  <select
                    value={formGroup}
                    onChange={(e) => setFormGroup(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-gray-50 font-bold"
                  >
                    <option>براعم (6-9 سنوات)</option>
                    <option>أشبال (10-12 سنة)</option>
                    <option>أواسط (13-16 سنة)</option>
                    <option>كبار (+17 سنة)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">الحزام الحالي</label>
                  <select
                    value={formBelt}
                    onChange={(e) => setFormBelt(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-gray-50 font-bold"
                  >
                    <option>حزام أبيض</option>
                    <option>حزام أصفر</option>
                    <option>حزام برتقالي</option>
                    <option>حزام أخضر</option>
                    <option>حزام أزرق</option>
                    <option>حزام بني</option>
                    <option>حزام أسود</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-gray-50 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">حالة الاشتراك</label>
                  <select
                    value={formSubStatus}
                    onChange={(e) => setFormSubStatus(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl bg-gray-50 font-bold"
                  >
                    <option value="paid">اشتراك نشط (Paid)</option>
                    <option value="pending">ينتهي قريباً (Pending)</option>
                    <option value="expired">منتهي الاشتراك (Expired)</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t">
                <button type="button" onClick={() => setEditingAthlete(null)} className="px-4 py-2 text-gray-600 font-semibold">إلغاء</button>
                <button type="submit" className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-lg">تحديث البيانات</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
