"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredLicense } from "@/lib/licenseSystem";

export default function DashboardOverview() {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  const [formName, setFormName] = useState("");
  const [formGroup, setFormGroup] = useState("براعم (6-9 سنوات)");

  // Dynamic state for club data
  const [athletesList, setAthletesList] = useState<any[]>([]);
  const [subscriptionsList, setSubscriptionsList] = useState<any[]>([]);
  const [licenseInfo, setLicenseInfo] = useState<any>(null);

  const loadAllData = async () => {
    try {
      const res = await fetch("/api/athletes");
      if (res.ok) {
        const data = await res.json();
        setAthletesList(data);
      }
    } catch (e) {
      console.error(e);
    }

    try {
      const storedSubs = localStorage.getItem("judo_subscriptions_v1");
      if (storedSubs) {
        setSubscriptionsList(JSON.parse(storedSubs));
      } else {
        setSubscriptionsList([]);
      }
    } catch (e) {
      setSubscriptionsList([]);
    }
  };

  useEffect(() => {
    const lic = getStoredLicense();
    setLicenseInfo(lic);
    if (!lic.isActivated) {
      router.push("/activate");
    }

    loadAllData();
  }, [router]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newAth = {
      id: "ATH-" + Date.now(),
      name: formName,
      code: `JUDO-2026-${(athletesList.length + 1).toString().padStart(4, "0")}`,
      belt: "حزام أبيض",
      beltColor: "bg-gray-100 text-gray-800 border border-gray-300 font-bold",
      group: formGroup,
      age: 10,
      phone: "",
      subStatus: "paid",
      status: "active",
    };

    try {
      const res = await fetch("/api/athletes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAth),
      });

      if (res.ok) {
        alert(`تمت إضافة اللاعب "${formName}" بنجاح إلى ${formGroup}!`);
        setShowAddModal(false);
        setFormName("");
        loadAllData();
      }
    } catch (e) {
      alert("حدث خطأ أثناء حفظ اللاعب!");
    }
  };

  // Calculate live stats
  const totalAthletes = athletesList.length;
  const activeSubs = subscriptionsList.filter((s) => s.status === "paid").length;
  const expiredSubs = subscriptionsList.filter((s) => s.status === "expired" || s.status === "pending").length;
  const totalRevenue = subscriptionsList
    .filter((s) => s.status === "paid")
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* License Trial Notification Banner */}
      {licenseInfo?.type === "TRIAL_14_DAYS" && (
        <div className="bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">⏱️</span>
            <span className="font-bold">
              نسخة تجريبية نشطة - متبقي {licenseInfo.daysRemaining} يوماً على انتهاء الصلاحية التجريبية
            </span>
          </div>
          <Link
            href="/activate"
            className="px-3.5 py-1.5 bg-white text-indigo-900 font-black rounded-xl hover:bg-indigo-50 transition-all text-xs"
          >
            التفعيل الشامل مدى الحياة 💳
          </Link>
        </div>
      )}

      {/* Top Header & Working Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">نظرة عامة على النادي</h1>
          <p className="text-gray-500 text-sm mt-1">متابعة إحصائيات الحضور والمالية وتجديد الاشتراكات</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all text-sm flex items-center gap-2"
          >
            <span>➕</span> إضافة لاعب جديد
          </button>
          <button
            onClick={() => setShowAttendanceModal(true)}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all text-sm flex items-center gap-2"
          >
            <span>✅</span> تسجيل حضور الحصة
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي اللاعبين"
          value={totalAthletes.toString()}
          trend={totalAthletes === 0 ? "لا يوجد لاعبون مسجلون بعد" : `${totalAthletes} لاعب مسجل`}
          color="blue"
        />
        <StatCard
          title="الاشتراكات النشطة"
          value={activeSubs.toString()}
          trend={`${activeSubs} اشتراك مفعّل`}
          color="green"
        />
        <StatCard
          title="اشتراكات معلقة/منتهية"
          value={expiredSubs.toString()}
          trend={`${expiredSubs} يحتاج تجديد`}
          color="orange"
        />
        <StatCard
          title="مداخيل الاشتراكات"
          value={`${totalRevenue.toLocaleString()} دج`}
          trend="إجمالي المداخيل"
          color="purple"
        />
      </div>

      {/* Recent Athletes Table */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">أحدث التسجيلات بالنادي</h3>
          <Link href="/dashboard/athletes" className="text-blue-600 hover:underline text-xs font-bold">عرض الكل ➔</Link>
        </div>
        {athletesList.length === 0 ? (
          <div className="text-center py-10 space-y-3 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <span className="text-3xl block">🥋</span>
            <p className="text-xs font-bold text-gray-500">لا يوجد لاعبون مسجلون في النادي بعد.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs shadow-md"
            >
              ➕ إضافة أول لاعب للنادي
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {athletesList.slice(0, 5).map((ath) => (
              <AthleteRow key={ath.id} name={ath.name} belt={ath.belt || "حزام أبيض"} group={ath.group} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Add Athlete Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in fade-in duration-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-bold text-gray-900">إضافة لاعب جديد للنادي</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 font-bold text-xl">✕</button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">الاسم واللقب *</label>
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
              <div className="pt-4 flex justify-end gap-3 border-t">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600 font-semibold">إلغاء</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-lg">حفظ وتوليد الكودبار</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Attendance Launcher Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 font-black text-2xl flex items-center justify-center mx-auto">
              ✅
            </div>
            <h3 className="text-xl font-bold text-gray-900">الانتقال لتسجيل حضور حصة اليوم</h3>
            <p className="text-xs text-gray-500">اختر المجموعة وسجل حضور اللاعبين بنقرة واحدة</p>
            <div className="flex gap-3 pt-2">
              <Link
                href="/dashboard/attendance"
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md block"
              >
                افتح جدول الحضور الآن ➔
              </Link>
              <button
                onClick={() => setShowAttendanceModal(false)}
                className="px-4 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, trend, color }: { title: string; value: string; trend: string; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-all">
      <h3 className="text-gray-500 font-semibold mb-2">{title}</h3>
      <div className="text-3xl font-black text-gray-800 mb-2">{value}</div>
      <div className={`text-sm font-medium p-2 rounded-lg ${colors[color]}`}>{trend}</div>
    </div>
  );
}

function AthleteRow({ name, belt, group }: { name: string; belt: string; group: string }) {
  return (
    <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-all border border-transparent hover:border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 text-blue-800 font-bold rounded-full flex items-center justify-center">
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-bold text-gray-800">{name}</div>
          <div className="text-sm text-gray-500">{group}</div>
        </div>
      </div>
      <div className="text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">{belt}</div>
    </div>
  );
}
