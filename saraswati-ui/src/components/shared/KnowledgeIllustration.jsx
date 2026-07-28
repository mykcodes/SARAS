function KnowledgeIllustration() {
  return (
    <svg width="220" height="220" viewBox="0 0 220 220" fill="none" className="mx-auto">
      <defs>
        <radialGradient id="glow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#C9A24E" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#C9A24E" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ring-gradient" x1="0" y1="0" x2="220" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E8CD8A" />
          <stop offset="0.6" stopColor="#C9A24E" />
          <stop offset="1" stopColor="#8A6A2E" />
        </linearGradient>
        <linearGradient id="book-gradient" x1="30" y1="120" x2="190" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E8CD8A" />
          <stop offset="1" stopColor="#9C7B32" />
        </linearGradient>
      </defs>

      <circle cx="110" cy="105" r="100" fill="url(#glow)" />
      <circle cx="110" cy="105" r="78" stroke="url(#ring-gradient)" strokeWidth="0.8" opacity="0.55" />
      <circle cx="110" cy="105" r="60" stroke="url(#ring-gradient)" strokeWidth="0.6" opacity="0.4" />

      {[...Array(10)].map((_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        const r = 92;
        const x = 110 + r * Math.cos(angle);
        const y = 105 + r * Math.sin(angle);
        return (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.6 : 1} fill="#C9A24E" opacity="0.7" />
        );
      })}

      <path
        d="M60 128 C60 124 63 122 67 122 L104 122 L104 158 L67 158 C63 158 60 156 60 152 Z"
        fill="url(#book-gradient)"
        opacity="0.9"
      />
      <path
        d="M160 128 C160 124 157 122 153 122 L116 122 L116 158 L153 158 C157 158 160 156 160 152 Z"
        fill="url(#book-gradient)"
        opacity="0.9"
      />
      <line x1="110" y1="122" x2="110" y2="158" stroke="#8A6A2E" strokeWidth="1" />

      <g opacity="0.95">
        <path d="M110 74 L116 92 L134 92 L119 102 L125 120 L110 109 L95 120 L101 102 L86 92 L104 92 Z" fill="url(#ring-gradient)" />
      </g>

      <path
        d="M110 60 C122 68 128 82 122 94 C128 90 132 80 130 70 C138 78 138 92 130 100 C126 96 122 94 118 94"
        stroke="url(#ring-gradient)"
        strokeWidth="1.4"
        fill="none"
        opacity="0.75"
      />
    </svg>
  );
}

export default KnowledgeIllustration;
