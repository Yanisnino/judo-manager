import Sidebar from "@/components/Sidebar";
import InstallPwaBanner from "@/components/InstallPwaBanner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        {children}
        <InstallPwaBanner />
      </main>
    </div>
  );
}
