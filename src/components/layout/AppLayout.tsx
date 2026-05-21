import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { InstallQueueBar } from "@/components/layout/InstallQueueBar";

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-hidden p-6">
          <Outlet />
        </main>
        <InstallQueueBar />
      </div>
    </div>
  );
}
