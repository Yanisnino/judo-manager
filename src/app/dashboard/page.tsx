export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">نظرة عامة</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-sm transition-all">
            + إضافة لاعب
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 shadow-sm transition-all">
            تسجيل حضور
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="إجمالي اللاعبين" value="124" trend="+5 هذا الشهر" color="blue" />
        <StatCard title="حاضرون اليوم" value="45" trend="حصة الساعة 18:00" color="green" />
        <StatCard title="اشتراكات تنتهي قريباً" value="12" trend="خلال 7 أيام" color="orange" />
        <StatCard title="المدفوعات هذا الشهر" value="145,000 دج" trend="+12% عن الشهر الماضي" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">أحدث التسجيلات</h3>
          <div className="space-y-4">
            <AthleteRow name="محمد أمين" belt="أبيض" group="مبتدئين أطفال" />
            <AthleteRow name="يوسف علي" belt="أصفر" group="متوسطين" />
            <AthleteRow name="أحمد ياسين" belt="أخضر" group="متقدمين" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">تنبيهات هامة</h3>
          <div className="space-y-4">
            <AlertRow text="اشتراك 5 لاعبين ينتهي غداً" type="warning" />
            <AlertRow text="بطولة الولاية بعد 14 يوم" type="info" />
            <AlertRow text="يوجد 3 غيابات متكررة في مجموعة الأشبال" type="danger" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, color }: { title: string, value: string, trend: string, color: string }) {
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

function AthleteRow({ name, belt, group }: { name: string, belt: string, group: string }) {
  return (
    <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-all border border-transparent hover:border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-bold text-gray-800">{name}</div>
          <div className="text-sm text-gray-500">{group}</div>
        </div>
      </div>
      <div className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
        {belt}
      </div>
    </div>
  );
}

function AlertRow({ text, type }: { text: string, type: 'warning' | 'info' | 'danger' }) {
  const styles = {
    warning: "bg-orange-50 text-orange-800 border-orange-100",
    info: "bg-blue-50 text-blue-800 border-blue-100",
    danger: "bg-red-50 text-red-800 border-red-100",
  };
  
  return (
    <div className={`p-4 rounded-lg border ${styles[type]} flex items-center gap-3`}>
      <span className="text-xl">
        {type === 'warning' ? '⚠️' : type === 'danger' ? '🚨' : 'ℹ️'}
      </span>
      <span className="font-semibold">{text}</span>
    </div>
  );
}
