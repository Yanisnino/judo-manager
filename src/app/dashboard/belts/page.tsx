"use client";

import { useState, useEffect } from "react";

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

const LOCAL_STORAGE_EXAMS_KEY = "judo_belt_exams_v1";

export default function BeltsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [athleteBeltsCount, setAthleteBeltsCount] = useState<Record<string, number>>({});

  // Form states
  const [examTitle, setExamTitle] = useState("");
  const [examDate, setExamDate] = useState(new Date().toISOString().split("T")[0]);
  const [targetBelt, setTargetBelt] = useState("حزام أصفر");
  const [participantsCount, setParticipantsCount] = useState(1);

  // Load real athletes to calculate actual belt counts & load saved exams
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/athletes");
        if (res.ok) {
          const athletes = await res.json();
          const counts: Record<string, number> = {};
          athletes.forEach((a: any) => {
            const b = a.belt || "حزام أبيض";
            counts[b] = (counts[b] || 0) + 1;
          });
          setAthleteBeltsCount(counts);
        }
      } catch (e) {
        console.error(e);
      }

      // Load exams
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_EXAMS_KEY);
        if (stored) {
          setExams(JSON.parse(stored));
        } else {
          setExams([]);
        }
      } catch (e) {
        setExams([]);
      }
    }
    loadData();
  }, []);

  const saveExams = (newExams: Exam[]) => {
    setExams(newExams);
    try {
      localStorage.setItem(LOCAL_STORAGE_EXAMS_KEY, JSON.stringify(newExams));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim()) return;

    const newExam: Exam = {
      id: "EX-" + Date.now().toString().slice(-4),
      title: examTitle,
      date: examDate,
      targetBelt,
      participantsCount: Number(participantsCount),
      status: "scheduled",
    };

    saveExams([newExam, ...exams]);
    setShowAddModal(false);
    setExamTitle("");
    setParticipantsCount(1);
    alert(`تم إنشاء اختار الحزام "${examTitle}" بنجاح!`);
  };

  const toggleStatus = (id: string) => {
    const updated = exams.map((ex) =>
      ex.id === id
        ? { ...ex, status: (ex.status === "scheduled" ? "completed" : "scheduled") as const }
        : ex
    );
    saveExams(updated);
  };

  const belts: BeltRank[] = [
    { id: "b1", name: "حزام أبيض", color: "bg-gray-100 border border-gray-300 text-gray-800", count: athleteBeltsCount["حزام أبيض"] || 0 },
    { id: "b2", name: "حزام أصفر", color: "bg-yellow-400 text-gray-900 font-bold", count: athleteBeltsCount["حزام أصفر"] || 0 },
    { id: "b3", name: "حزام برتقالي", color: "bg-orange-500 text-white font-bold", count: athleteBeltsCount["حزام برتقالي"] || 0 },
    { id: "b4", name: "حزام أخضر", color: "bg-emerald-600 text-white font-bold", count: athleteBeltsCount["حزام أخضر"] || 0 },
    { id: "b5", name: "حزام أزرق", color: "bg-blue-600 text-white font-bold", count: athleteBeltsCount["حزام أزرق"] || 0 },
    { id: "b6", name: "حزام بني", color: "bg-amber-900 text-white font-bold", count: athleteBeltsCount["حزام بني"] || 0 },
    { id: "b7", name: "حزام أسود", color: "bg-gray-900 text-white font-bold border border-gray-700", count: athleteBeltsCount["حزام أسود"] || 0 },
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
          onClick={() => setShowAddModal(true)}
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">دورات الاختبارات المجدولة</h2>
        {exams.length === 0 ? (
          <div className="text-center py-10 space-y-3 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <span className="text-3xl block">🥋</span>
            <p className="text-sm font-bold text-gray-700">لا توجد دورات اختبارات مبرمجة حالياً.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs shadow-md"
            >
              ➕ إنشاء أول دورة اختبار
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {exams.map((exam) => (
              <div key={exam.id} className="p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50/50 transition-all">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-lg">{exam.title}</span>
                    {exam.status === "scheduled" ? (
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">مجدول</span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">مكتمل ✅</span>
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
                    onClick={() => toggleStatus(exam.id)}
                    className="w-full md:w-auto px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-bold text-xs transition-all border border-blue-200"
                  >
                    {exam.status === "scheduled" ? "تغيير الحالة إلى مكتمل ✓" : "إعادة للجدولة 🔄"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for creating exam */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in fade-in duration-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-bold text-gray-900">إنشاء دورة اختبار حزام جديدة</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 font-bold text-xl">✕</button>
            </div>
            <form onSubmit={handleCreateExam} className="space-y-4 text-sm">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">عنوان الدورة الاختبارية</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: اختبار دورة مارس للحزام الأصفر"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-gray-50 font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">تاريخ الاختبار</label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-gray-50 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">عدد المشاركين</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={participantsCount}
                    onChange={(e) => setParticipantsCount(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl bg-gray-50 font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">الحزام المستهدف</label>
                <select
                  value={targetBelt}
                  onChange={(e) => setTargetBelt(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-gray-50 font-bold"
                >
                  <option>حزام أصفر</option>
                  <option>حزام برتقالي</option>
                  <option>حزام أخضر</option>
                  <option>حزام أزرق</option>
                  <option>حزام بني</option>
                  <option>حزام أسود</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600 font-semibold">إلغاء</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-lg">إنشاء وحفظ الاختبار</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
