import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { AppProvider } from "../../context/AppContext";
import { AIProvider } from "../../context/AIContext";
import GlobalSearchModal from "../search/GlobalSearchModal";
import DocumentDetailsDrawer from "../documents/DocumentDetailsDrawer";
import ToastContainer from "../shared/ToastContainer";
import AISidePanel from "../ai/AISidePanel";
import SettingsModal from "../settings/SettingsModal";
import SplashScreen from "./SplashScreen";

function AppLayout() {
  const [booting, setBooting] = useState(true);

  return (
    <AppProvider>
      <AIProvider>
        <div className="flex h-screen w-full overflow-hidden bg-bg text-ink">
          {booting && <SplashScreen onFinish={() => setBooting(false)} />}

          <Sidebar />

          <div className="flex min-w-0 flex-1 flex-col">
            <Outlet />
          </div>

          <GlobalSearchModal />
          <DocumentDetailsDrawer />
          <SettingsModal />
          <ToastContainer />

          {/* Global "Ask SARASWATI" slide-over — available on every route */}
          <AISidePanel />
        </div>
      </AIProvider>
    </AppProvider>
  );
}

export default AppLayout;