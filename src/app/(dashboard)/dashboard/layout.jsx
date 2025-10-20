import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div><Sidebar /></div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col p-6">
        <Topbar />
        <main className="flex-1">{children}</main>
      </div>
      <Toaster/>
    </div>
  );
}
