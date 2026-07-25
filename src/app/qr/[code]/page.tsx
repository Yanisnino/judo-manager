import Link from "next/link";

interface QrPageProps {
  params: Promise<{
    code: string;
  }>;
}

export default async function PublicAthleteQrPage({ params }: QrPageProps) {
  const resolvedParams = await params;
  const code = resolvedParams?.code || "JUDO-2026-0001";

  // Mock public safe athlete data
  const athlete = {
    name: "محمد أمين ب.",
    code: code,
    clubName: "نادي الأبطال للجودو والفنون القتالية",
    sport: "الجودو (Judo)",
    belt: "حزام أصفر",
    beltColor: "bg-yellow-400 text-gray-900",
    group: "أشبال (10-12 سنة)",
    status: "لاعب نشط مـعتمد",
    clubPhone: "+213 550 12 34 56",
    emergencyPhone: "+213 661 98 76 54",
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center relative">
          <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <span className="text-3xl font-black text-white">🥋</span>
          </div>
          <h1 className="text-2xl font-black text-white">{athlete.name}</h1>
          <p className="text-blue-100 text-sm font-medium mt-0.5">{athlete.clubName}</p>
          <div className="mt-3 inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-mono font-bold px-3 py-1 rounded-full border border-white/30">
            {athlete.code}
          </div>
        </div>

        {/* Badge Info */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-slate-700/50 p-3 rounded-2xl border border-slate-600/50">
              <span className="text-xs text-slate-400 block mb-1">الرياضة</span>
              <span className="font-bold text-white text-sm">{athlete.sport}</span>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-2xl border border-slate-600/50">
              <span className="text-xs text-slate-400 block mb-1">الحزام الحالي</span>
              <span className={`font-bold text-xs px-2.5 py-1 rounded-full inline-block mt-0.5 ${athlete.beltColor}`}>
                {athlete.belt}
              </span>
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
              ✓
            </div>
            <div>
              <div className="text-emerald-400 font-bold text-sm">{athlete.status}</div>
              <div className="text-slate-400 text-xs mt-0.5">بطاقة رقمية موثقة ورسمية</div>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs text-amber-200/80 leading-relaxed">
            🔒 <strong className="text-amber-200">خصوصية وأمان البيانات:</strong> يتم عرض المعلومات الأساسية فقط لحماية الطفل. في حال العثور على البطاقة، يرجى التواصل فوراً عبر أزرار الطوارئ بالأسفل.
          </div>

          {/* Emergency Call Buttons */}
          <div className="space-y-3 pt-2">
            <a
              href={`tel:${athlete.emergencyPhone}`}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 transition-all text-sm"
            >
              📞 الاتصال بولي الأمر (طوارئ)
            </a>
            <a
              href={`tel:${athlete.clubPhone}`}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-600 transition-all text-sm"
            >
              🏢 الاتصال بمدير النادي
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-900 p-4 text-center border-t border-slate-700/50">
          <Link href="/" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">
            منصة إدارة أندية الجودو © JudoManager SaaS
          </Link>
        </div>
      </div>
    </div>
  );
}
