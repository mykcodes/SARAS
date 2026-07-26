function Logo() {
  return (
    <div className="flex items-center gap-2.5 px-1">
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        className="shrink-0"
      >
        <circle cx="17" cy="17" r="16" stroke="url(#logo-ring)" strokeWidth="1.4" />
        <circle cx="17" cy="17" r="11" stroke="url(#logo-ring)" strokeWidth="0.8" opacity="0.5" />
        <path
          d="M17 9L18.4 15.6L25 17L18.4 18.4L17 25L15.6 18.4L9 17L15.6 15.6L17 9Z"
          fill="url(#logo-ring)"
        />
        <defs>
          <linearGradient id="logo-ring" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E8CD8A" />
            <stop offset="0.55" stopColor="#C9A24E" />
            <stop offset="1" stopColor="#8A6A2E" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex flex-col leading-tight">
        <span className="gold-gradient-text text-[15px] font-semibold tracking-wide">
          SARASWATI
        </span>
        <span className="text-[10px] text-ink-faint tracking-wide">
          Your Notes. Your Knowledge. Your AI.
        </span>
      </div>
    </div>
  );
}

export default Logo;
