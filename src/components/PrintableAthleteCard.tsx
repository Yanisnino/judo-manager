"use client";

import { useState } from "react";

interface AthleteCardProps {
  athlete: {
    id: string;
    name: string;
    code: string;
    belt: string;
    beltColor: string;
    group: string;
    dob?: string;
    phone?: string;
  };
}

export default function PrintableAthleteCard({ athlete }: AthleteCardProps) {
  const [showModal, setShowModal] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 shadow-sm"
      >
        <span>🖨️</span> طباعة البطاقة والكودبار
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3 print:hidden">
              <h3 className="font-bold text-gray-900 text-lg">معاينة بطاقة الكودبار الجاهزة للطباعة</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            {/* Printable ID Badge Component */}
            <div id="printable-card" className="bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-950 text-white rounded-3xl p-6 border-2 border-blue-500 shadow-2xl relative overflow-hidden text-center space-y-4">
              {/* Top Watermark / Emblem */}
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-right">
                  <span className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-bold">🥋</span>
                  <div>
                    <div className="font-black text-xs text-white leading-none">نادي الأبطال للرياضات القتالية</div>
                    <div className="text-[10px] text-blue-300 font-mono mt-0.5">Champions Martial Arts Club</div>
                  </div>
                </div>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/30 font-mono">
                  OFFICIAL ID
                </span>
              </div>

              {/* Athlete Avatar & Name */}
              <div className="space-y-2">
                <div className="w-20 h-20 rounded-full bg-blue-600 text-white font-black text-3xl flex items-center justify-center mx-auto border-4 border-white/20 shadow-lg">
                  {athlete.name.charAt(0)}
                </div>
                <h2 className="text-xl font-black text-white">{athlete.name}</h2>
                <div className="flex items-center justify-center gap-2 text-xs">
                  <span className={`px-3 py-0.5 rounded-full font-bold ${athlete.beltColor}`}>
                    {athlete.belt}
                  </span>
                  <span className="text-gray-300 font-medium">{athlete.group}</span>
                </div>
              </div>

              {/* Generated Barcode Display */}
              <div className="bg-white p-3 rounded-2xl border border-gray-200 text-gray-900 space-y-1 shadow-inner">
                {/* SVG Barcode Representation */}
                <svg className="w-full h-12 mx-auto" viewBox="0 0 200 40">
                  <rect x="10" y="0" width="3" height="40" fill="#000"/>
                  <rect x="16" y="0" width="2" height="40" fill="#000"/>
                  <rect x="22" y="0" width="6" height="40" fill="#000"/>
                  <rect x="32" y="0" width="2" height="40" fill="#000"/>
                  <rect x="38" y="0" width="4" height="40" fill="#000"/>
                  <rect x="46" y="0" width="2" height="40" fill="#000"/>
                  <rect x="52" y="0" width="6" height="40" fill="#000"/>
                  <rect x="62" y="0" width="3" height="40" fill="#000"/>
                  <rect x="68" y="0" width="5" height="40" fill="#000"/>
                  <rect x="76" y="0" width="2" height="40" fill="#000"/>
                  <rect x="82" y="0" width="4" height="40" fill="#000"/>
                  <rect x="90" y="0" width="6" height="40" fill="#000"/>
                  <rect x="100" y="0" width="2" height="40" fill="#000"/>
                  <rect x="106" y="0" width="5" height="40" fill="#000"/>
                  <rect x="114" y="0" width="3" height="40" fill="#000"/>
                  <rect x="120" y="0" width="2" height="40" fill="#000"/>
                  <rect x="126" y="0" width="6" height="40" fill="#000"/>
                  <rect x="136" y="0" width="3" height="40" fill="#000"/>
                  <rect x="142" y="0" width="2" height="40" fill="#000"/>
                  <rect x="148" y="0" width="5" height="40" fill="#000"/>
                  <rect x="156" y="0" width="3" height="40" fill="#000"/>
                  <rect x="162" y="0" width="6" height="40" fill="#000"/>
                  <rect x="172" y="0" width="2" height="40" fill="#000"/>
                  <rect x="178" y="0" width="4" height="40" fill="#000"/>
                  <rect x="186" y="0" width="3" height="40" fill="#000"/>
                </svg>
                <div className="font-mono font-bold text-sm tracking-wider">{athlete.code}</div>
              </div>

              {/* Card Footer Info */}
              <div className="text-[10px] text-gray-400 border-t border-white/10 pt-2 flex justify-between">
                <span>مسجل بالنادي رسميًا</span>
                <span>JudoManager App</span>
              </div>
            </div>

            {/* Print Action Buttons */}
            <div className="flex gap-3 pt-2 print:hidden">
              <button
                onClick={handlePrint}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>🖨️</span> طباعة البطاقة الآن
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
