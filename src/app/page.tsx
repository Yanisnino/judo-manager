"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LicenseGuard from "@/components/LicenseGuard";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if license is active
    const saved = localStorage.getItem("judo_manager_active_license");
    if (saved) {
      router.push("/dashboard");
    } else {
      router.push("/activate");
    }
  }, [router]);

  return (
    <LicenseGuard>
      <div className="h-screen bg-slate-950 flex items-center justify-center text-white font-bold text-sm">
        جاري تحميل نظام JudoManager Pro والتحقق من التفعيل...
      </div>
    </LicenseGuard>
  );
}
