function Logo({ isCollapsed }) {
  return (
    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5 px-1'}`}>
      <img
        src="https://i.ibb.co/JRG1F1cm/Saras-Logo-removebg-preview.png"
        className="h-15 w-15 object-contain select-none shrink-0"
        alt="SARASWATI Logo"
      />
      {!isCollapsed && (
        <div className="flex flex-col leading-tight overflow-hidden">
          <span className="gold-gradient-text text-[20px] font-bold tracking-wide">
            SARASWATI
          </span>
          <span className="text-[10px] text-ink-faint tracking-wide font-semibold whitespace-nowrap">
            Your Notes. Your Knowledge. Your AI.
          </span>
        </div>
      )}
    </div>
  );
}

export default Logo;
