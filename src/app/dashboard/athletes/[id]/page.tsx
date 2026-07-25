"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AthleteProfilePage() {
  const routeParams = useParams();
  const id = typeof routeParams?.id === "string" ? routeParams.id : "ATH-001";

  const [activeTab, setActiveTab] = useState<"overview" | "attendance" | "subscriptions" | "belts" | "competitions" | "notes">("overview");

  const athlete = {
    id: id,
    name: "محمد أمين بن علي",
    code: "JUDO-2026-0001",
    dob: "2015-04-12",
    age: 11,
    gender: "ذكر",
    weight: "34 كغ",
    phone: "0555123456",
    parentName: "عبد القادر بن علي (الأب)",
    parentPhone: "0661122334",
    emergencyPhone: "0770998877",
    group: "أشبال (10-12 سنة)",
    coach: "المدرب أحمد بن سالم",
    currentBelt: "حزام أصفر",
    beltColor: "bg-yellow-400 text-gray-900",
    attendanceRate: 92,
    subStatus: "paid",
    subEndDate: "2026-08-01",
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Back Button */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/athletes"
          className="text-gray-600 hover:text-blue-600 font-bold text-sm flex items-center gap-2"
        >
          <span>➔</span> العودة لقائمة اللاعبين
        </Link>
        <Link
          href={`/qr/${athlete.code}`}
          target="_blank"
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-md hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          📱 عرض البطاقة الرقمية (QR)
        </Link>
      </div>

      {/* Top Banner Profile Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-blue-600 text-white font-black text-4xl flex items-center justify-center border-4 border-blue-100 shadow-lg">
          {athlete.name.charAt(0)}
        </div>
        <div className="flex-1 text-center md:text-right space-y-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h1 className="text-3xl font-black text-gray-900">{athlete.name}</h1>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${athlete.beltColor}`}>
              {athlete.currentBelt}
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            كود المعرف: <span className="font-mono font-bold text-gray-800">{athlete.code}</span> | المجموعة: <span className="font-bold text-gray-800">{athlete.group}</span>
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2 text-xs">
            <span className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-xl border border-emerald-100">
              نسبة الحضور: {athlete.attendanceRate}%
            </span>
            <span className="bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-xl border border-blue-100">
              الاشتراك: نشط لغاية {athlete.subEndDate}
            </span>
            <span className="bg-purple-50 text-purple-700 font-bold px-3 py-1.5 rounded-xl border border-purple-100">
              الوزن: {athlete.weight}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex overflow-x-auto gap-2 border-b border-gray-200 pb-2">
        <TabButton label="نظرة عامة" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
        <TabButton label="سجل الحضور" active={activeTab === "attendance"} onClick={() => setActiveTab("attendance")} />
        <TabButton label="الاشتراكات والمدفوعات" active={activeTab === "subscriptions"} onClick={() => setActiveTab("subscriptions")} />
        <TabButton label="تطور الأحزمة" active={activeTab === "belts"} onClick={() => setActiveTab("belts")} />
        <TabButton label="البطولات والنتائج" active={activeTab === "competitions"} onClick={() => setActiveTab("competitions")} />
        <TabButton label="ملاحظات المدرب" active={activeTab === "notes"} onClick={() => setActiveTab("notes")} />
      </div>

      {/* Tab Content Area */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-900 border-b pb-2">المعلومات الشخصية والرياضية</h3>
              <InfoRow label="الاسم واللقب" value={athlete.name} />
              <InfoRow label="تاريخ الميلاد" value={`${athlete.dob} (${athlete.age} سنة)`} />
              <InfoRow label="الجنس" value={athlete.gender} />
              <InfoRow label="الوزن الحالي" value={athlete.weight} />
              <InfoRow label="المدرب المسؤول" value={athlete.coach} />
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-900 border-b pb-2">معلومات التواصل والطوارئ</h3>
              <InfoRow label="اسم ولي الأمر" value={athlete.parentName} />
              <InfoRow label="هاتف ولي الأمر" value={athlete.parentPhone} />
              <InfoRow label="رقم هاتف الطوارئ" value={athlete.emergencyPhone} />
              <InfoRow label="رقم اللاعب" value={athlete.phone} />
            </div>
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900">سجل حضور اللاعب (آخر الحصص)</h3>
            <div className="space-y-2">
              <AttendanceHistoryRow date="2026-07-20" session="حصة الإثنين 18:00" status="حاضر" />
              <AttendanceHistoryRow date="2026-07-18" session="حصة السبت 17:00" status="حاضر" />
              <AttendanceHistoryRow date="2026-07-15" session="حصة الأربعاء 18:00" status="غائب" />
              <AttendanceHistoryRow date="2026-07-13" session="حصة الإثنين 18:00" status="حاضر" />
            </div>
          </div>
        )}

        {activeTab === "subscriptions" && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900">سجل مدفوعات وااشتراكات اللاعب</h3>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center">
              <div>
                <div className="font-bold text-gray-900">اشتراك شهري عادي</div>
                <div className="text-xs text-gray-500">من 01/07/2026 إلى 01/08/2026</div>
              </div>
              <span className="font-mono font-bold text-emerald-600">2,500 دج (مدفوع)</span>
            </div>
          </div>
        )}

        {activeTab === "belts" && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900">مسار ترقيات الأحزمة</h3>
            <div className="border-r-2 border-blue-600 pr-4 space-y-6">
              <div>
                <span className="text-xs text-gray-400 block font-mono">2026-05-10</span>
                <span className="font-bold text-gray-900">ترقية إلى الحزام الأصفر</span>
                <p className="text-xs text-gray-500">النتيجة: ممتاز - مدرب الفئة: أحمد بن سالم</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-mono">2025-10-15</span>
                <span className="font-bold text-gray-900">الحزام الأبيض (التسجيل الأول)</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "competitions" && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900">مشاركات ونتائج البطولات</h3>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex justify-between items-center">
              <div>
                <div className="font-bold text-gray-900">بطولة الولاية للجودو (أشبال)</div>
                <div className="text-xs text-gray-500">وزن أقل من 34 كغ - التاريخ: 2026-03-20</div>
              </div>
              <span className="bg-amber-400 text-gray-900 font-bold px-3 py-1 rounded-full text-xs">
                🥇 الميدالية الذهبية (المركز الأول)
              </span>
            </div>
          </div>
        )}

        {activeTab === "notes" && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900">ملاحظات المدرب حول انضباط وتطور اللاعب</h3>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm text-gray-700 leading-relaxed">
              "لاعب منضبط ومواظب على التدريبات. يظهر تركيزاً عالياً في تقنيات الرمي (Nage-waza) والقتال الأرضي. ينصح بالتركيز أكثر على اللياقة البدنية والسرعة."
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
        active
          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
          : "bg-white text-gray-600 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center border-b border-gray-50 pb-2 text-sm">
      <span className="text-gray-500">{label}:</span>
      <span className="font-bold text-gray-900">{value}</span>
    </div>
  );
}

function AttendanceHistoryRow({ date, session, status }: { date: string; session: string; status: string }) {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl text-sm">
      <div>
        <span className="font-bold text-gray-800">{session}</span>
        <span className="block text-xs font-mono text-gray-400">{date}</span>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${status === "حاضر" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
        {status}
      </span>
    </div>
  );
}
