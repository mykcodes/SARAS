import Sidebar from "../sidebar/Sidebar";

function AppLayout({ children, activeItem = "home" }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg text-ink">
      <Sidebar activeItem={activeItem} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

export default AppLayout;
