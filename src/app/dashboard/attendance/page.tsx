"use client";

import { useState } from "react";

interface SessionAthlete {
  id: string;
  name: string;
  belt: string;
  beltColor: string;
  attendance: "present" | "absent" | "late" | "excused";
}

export default function AttendancePage() {
  const [selectedGroup, setSelectedGroup] = useState("أشبال (10-12 سنة)");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [athletes, setAthletes] = useState<SessionAthlete[]>([
    {
      id: "ATH-001",
      name: "محمد أمين بن علي",
      belt: "أصفر",
      beltColor: "bg-yellow-400 text-gray-900",
      attendance: "present",
    },
    {
      id: "ATH-002",
      name: "أحمد ياسين زروقي",
      belt: "برتقالي",
      beltColor: "bg-orange-500 text-white",
      attendance: "present",
    },
    {
      id: "ATH-003",
      name: "يوسف بلقاسم",
      belt: "أخضر",
      beltColor: "bg-emerald-600 text-white",
      attendance: "absent",
    },
    {
      id: "ATH-004",
      name: "سارة حداد",
      belt: "أبيض",
      beltColor: "bg-gray-100 text-gray-800 border border-gray-300",
      attendance: "late",
    },
  ]);

  const updateAttendance = (
    id: string,
    status: "present" | "absent" | "late" | "excused"
  ) => {
    setAthletes((prev) =>
      prev.map((a) => (a.id === id ? { ...a, attendance: status } : a))
    );
  };

  const markAllPresent = () => {
    setAthletes((prev) => prev.map((a) => ({ ...a, attendance: "present" })));
  };

  const presentCount = athletes.filter((a) => a.attendance === "present").length;
  const absentCount = athletes.filter((a) => a.attendance === "absent").length;
  const lateCount = athletes.filter((a) => a.attendance === "late").length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">تسجيل الحضور والغياب</h1>
          <p className="text-gray-500 text-sm mt-1">
            اختر الحصة التدريبية وسجل حضور اللاعبين بنقرة واحدة
          </p>
        </div>
        <button
          onClick={() => alert("تم حفظ بيانات الحضور بنجاح!")}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
        >
          <span>💾</span> حفظ قائمة الحضور
        </button>
      </div>

      {/* Control Bar: Group & Date Selector */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">المجموعة التدريبية</label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option>براعم (6-9 سنوات)</option>
            <option>أشبال (10-12 سنة)</option>
            <option>أواسط (13-16 سنة)</option>
            <option>كبار (+17 سنة)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">تاريخ الحصة</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end pt-5 md:pt-0">
          <button
            onClick={markAllPresent}
            className="w-full md:w-auto px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold text-sm transition-all border border-blue-200"
          >
            ✓ تحديد الكل كـ حاضر
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
          <span className="text-2xl font-black text-emerald-700">{presentCount}</span>
          <span className="block text-xs font-bold text-emerald-600 mt-1">حاضر</span>
        </div>
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl">
          <span className="text-2xl font-black text-rose-700">{absentCount}</span>
          <span className="block text-xs font-bold text-rose-600 mt-1">غائب</span>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl">
          <span className="text-2xl font-black text-amber-700">{lateCount}</span>
          <span className="block text-xs font-bold text-amber-600 mt-1">متأخر</span>
        </div>
      </div>

      {/* Athletes Attendance List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
        {athletes.map((athlete) => (
          <div
            key={athlete.id}
            className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-800 font-black text-base flex items-center justify-center">
                {athlete.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-gray-900 text-base">{athlete.name}</div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${athlete.beltColor}`}>
                  {athlete.belt}
                </span>
              </div>
            </div>

            {/* Attendance Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => updateAttendance(athlete.id, "present")}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  athlete.attendance === "present"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                ✓ حاضر
              </button>
              <button
                onClick={() => updateAttendance(athlete.id, "absent")}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  athlete.attendance === "absent"
                    ? "bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                ✕ غائب
              </button>
              <button
                onClick={() => updateAttendance(athlete.id, "late")}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  athlete.attendance === "late"
                    ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                ⏰ متأخر
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
