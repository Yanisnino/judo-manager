"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "الرئيسية", href: "/dashboard", icon: "📊" },
    { name: "اللاعبون", href: "/dashboard/athletes", icon: "🥋" },
    { name: "الحضور", href: "/dashboard/attendance", icon: "✅" },
    { name: "الاشتراكات", href: "/dashboard/subscriptions", icon: "💰" },
    { name: "الأحزمة", href: "/dashboard/belts", icon: "🟨" },
    { name: "الإشعارات للأولياء", href: "/dashboard/notifications", icon: "📩" },
    { name: "النسخ الاحتياطي", href: "/dashboard/backup", icon: "🔄" },
    { name: "الإعدادات", href: "/dashboard/settings", icon: "⚙️" },
  ];

  return (
    <aside className="w-64 bg-white shadow-xl hidden md:flex flex-col border-l border-gray-100">
      <div className="p-6 border-b border-gray-100 flex items-center justify-center">
        <h2 className="text-2xl font-black text-blue-900 flex items-center gap-2">
          <span>🥋</span> JudoManager
        </h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 font-semibold"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold text-xs"
        >
          <span>🚪</span>
          تسجيل الخروج
        </Link>
      </div>
    </aside>
  );
}
