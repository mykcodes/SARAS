import { useEffect, useState } from "react";
import Logo from "../sidebar/Logo";

function StartupLoader({ onComplete }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Check if we've already loaded in this session to prevent re-running
    if (sessionStorage.getItem("app_started")) {
      onComplete();
      return;
    }

    const timers = [
      setTimeout(() => setStage(1), 100),   // Stage 1: Fade in blur
      setTimeout(() => setStage(2), 500),   // Stage 2: Lotus scale in
      setTimeout(() => setStage(3), 1500),  // Stage 3 & 4: Text slide in & slogan
      setTimeout(() => setStage(4), 3000),  // Stage 5: Move to top-left
      setTimeout(() => {
        sessionStorage.setItem("app_started", "true");
        onComplete();
      }, 4000) // End after exactly 4 seconds
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // If already loaded, render nothing
  if (sessionStorage.getItem("app_started") && stage === 0) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md transition-opacity duration-1000 ${
        stage >= 4 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div 
        className="flex flex-col items-center justify-center transition-all duration-1000 ease-in-out"
        style={{
          // Move towards the top-left sidebar location
          transform: stage >= 4 ? 'translate(calc(-50vw + 90px), calc(-50vh + 45px)) scale(0.4)' : 'translate(0, 0) scale(1)'
        }}
      >
        <div className="flex items-center">
          {/* Stage 2: Lotus */}
          <div 
            className={`transition-all duration-1000 ease-out flex items-center justify-center h-70 w-70 shrink-0 rounded-xl bg-black text-[#121212] ${
              stage >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
          >
            <img src="https://i.ibb.co/bRWRKJLp/Saras-Logo-removebg-preview.png" alt="Saras Logo removebg preview" border="0"></img>
          </div>
          
          {/* Stage 3: Text */}
          
        </div>

        {/* Stage 4: Slogan */}
        
      </div>
    </div>
  );
} ;

export default StartupLoader;
