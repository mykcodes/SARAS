import { Link } from "react-router-dom";

function Logo({ isCollapsed }) {
  return (
    <Link to="/" id="sidebar-logo-anchor" className={`flex items-center gap-2.5 outline-none ${isCollapsed ? 'justify-center px-0' : 'px-1'}`}>
      <img
        src="https://i.ibb.co/JRG1F1cm/Saras-Logo-removebg-preview.png"
        className="h-15 w-15 object-contain select-none"
        alt="SARASWATI Logo"
      />
      {!isCollapsed && (
        <div className="flex flex-col leading-tight">
          <span className="gold-gradient-text text-[20px] font-bold tracking-wide">
            SARASWATI
          </span>
          <span className="text-[10px] text-ink-faint tracking-wide font-semibold">
            Your Notes. Your Knowledge. Your AI.
          </span>
        </div>
      )}
    </Link>
  );
}

export default Logo;
