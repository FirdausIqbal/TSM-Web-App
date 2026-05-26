import DashboardSidebar from "@/ui/dashboard/SidebarDashboard";
import type { ReactNode } from "react";

export default function DashboardLayout({children}: Readonly<{children: ReactNode}>) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
        <DashboardSidebar />
        <main className="p-4 md:p-8 flex-1 overflow-y-auto">
            {children}
        </main>
    </div>
  )
}
