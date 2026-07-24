"use client";

import { useState } from "react";

interface BeltRank {
  id: string;
  name: string;
  color: string;
  count: number;
}

interface Exam {
  id: string;
  title: string;
  date: string;
  targetBelt: string;
  participantsCount: number;
  status: "scheduled" | "completed";
}

export default function BeltsPage() {
  const belts: BeltRank[] = [
    { id: "b1", name: "حزام أبيض", color: "bg-gray-100 border border-gray-300 text-gray-800", count: 32 },
    { id: "b2", name: "حزام أصفر", color: "bg-yellow-400 text-gray-900 font-bold", count: 24 },
    { id: "b3", name: "حزام برتقالي", color: "bg-orange-500 text-white font-bold", count: 18 },
    { id: "b4", name: "حزام أخضر", color: "bg-emerald-600 text-white font-bold", count: 14 },
    { id: "b5", name: "حزام أزرق", color: "bg-blue-600 text-white font-bold", count: 9 },
    { id: "b6", name: "حزام بني", color: "bg-amber-900 text-white font-bold", count: 5 },
    { id: "b7", name: "حزام أسود", color: "bg-gray-900 text-white font-bold border border-gray-700", count: 3 },
  ];

  const exams: Exam[] = [
    {
      id: "EX-01",
      title: "اختبار دورة جويلية للحزام الأصفر والبرتقالي",
      date: "2026-07-30",
      targetBelt: "حزام أصفر / برتقالي",
      participantsCount: 15,
      status: "scheduled",
    },
    {
      id: "EX-02",
      title: "اختبار المستوى المتقدم للحزام الأخضر والأزرق",
      date: "2026-06-15",
      targetBelt: "حزام أخضر / أزرق",
      participantsCount: 10,
      status: "completed",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">نظام الأحزمة والاختبارات</h1>
          <p className="text-gray-500 text-sm mt-1">
            متابعة مستويات الأحزمة وتحديد مواعيد الاختبارات وتسجيل الترقيات
          </p>
        </div>
        <button
          onClick={() => alert("إنشاء دورة اختبار جديدة")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
        >
          <span>🥋</span> إنشاء اختبار حزام جديد
        </button>
      </div>

      {/* Belt Hierarchy Grid */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">مستويات الأحزمة بالنادي</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {belts.map((b) => (
            <div key={b.id} className="p-4 rounded-xl text-center border border-gray-100 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
              <span className={`text-xs p-2 rounded-lg block mb-2 ${b.color}`}>
                {b.name}
              </span>
              <div>
                <span className="text-2xl font-black text-gray-900">{b.count}</span>
                <span className="block text-xs text-gray-400 mt-0.5">لاعب</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exam Sessions */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">دورات الاختبارات القادمة والسابقة</h2>
        <div className="space-y-4">
          {exams.map((exam) => (
            <div key={exam.id} className="p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50/50 transition-all">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-lg">{exam.title}</span>
                  {exam.status === "scheduled" ? (
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">مجدول</span>
                  ) : (
                    <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-0.5 rounded-full">مكتمل</span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1 space-x-3 space-x-reverse">
                  <span>📅 التاريخ: {exam.date}</span>
                  <span>🎯 المستهدف: {exam.targetBelt}</span>
                  <span>👥 المشاركون: {exam.participantsCount} لاعب</span>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={() => alert("عرض نتائج الاختبار وإرسال التهنئة للأولياء")}
                  className="w-full md:w-auto px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-bold text-xs transition-all border border-blue-200"
                >
                  تسجيل النتائج والترقيات
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
