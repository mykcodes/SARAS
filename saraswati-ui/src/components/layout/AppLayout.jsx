import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { AppProvider } from "../../context/AppContext";
import GlobalSearchModal from "../search/GlobalSearchModal";
import DocumentDetailsDrawer from "../documents/DocumentDetailsDrawer";
import ToastContainer from "../shared/ToastContainer";

function AppLayout() {
  return (
    <AppProvider>
      <div className="flex h-screen w-full overflow-hidden bg-bg text-ink">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Outlet />
        </div>
        <GlobalSearchModal />
        <DocumentDetailsDrawer />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}

export default AppLayout;