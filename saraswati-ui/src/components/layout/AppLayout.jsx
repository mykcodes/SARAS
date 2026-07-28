import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";

function AppLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg text-ink">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;