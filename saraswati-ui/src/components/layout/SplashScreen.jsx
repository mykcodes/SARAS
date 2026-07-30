import { useLayoutEffect, useEffect, useRef, useState } from "react";

const BIG_SCALE = 3.4;

const FADE_TIME_LOGO = 1000;
const SLIDE_TIME = 700;
const TAGLINE_TIME = 700;
const HOLD_TIME = 1800;
const SHRINK_TIME = 1000;
const FADE_TIME = 600;

function SplashScreen({ onFinish }) {
  const [geom, setGeom] = useState(null);

  // intro
  // rotate
  // reveal
  // tagline
  // hold
  // shrink
  // fade
  const [phase, setPhase] = useState("intro");

  const timers = useRef([]);

  useLayoutEffect(() => {
    const anchor = document.getElementById("sidebar-logo-anchor");

    if (!anchor) {
      onFinish?.();
      return;
    }

    const rect = anchor.getBoundingClientRect();

    const centerLeft =
      window.innerWidth / 2 -
      (rect.width * BIG_SCALE) / 2;

    const centerTop =
      window.innerHeight / 2 -
      (rect.height * BIG_SCALE) / 2;

    setGeom({
      startLeft: rect.left,
      startTop: rect.top,
      centerLeft,
      centerTop,
    });

    return () => timers.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!geom) return;

    const schedule = (fn, delay) =>
      timers.current.push(setTimeout(fn, delay));

  let t = 300;

// Lotus fades in first
schedule(() => setPhase("reveal"), t);

t += FADE_TIME_LOGO + SLIDE_TIME;

    t += SLIDE_TIME;

    schedule(() => setPhase("tagline"), t);

    t += TAGLINE_TIME;

    schedule(() => setPhase("hold"), t);

    t += HOLD_TIME;

    schedule(() => setPhase("shrink"), t);

    t += SHRINK_TIME;

    schedule(() => setPhase("fade"), t);

    t += FADE_TIME;

    schedule(() => onFinish?.(), t);

    return () => timers.current.forEach(clearTimeout);

  }, [geom, onFinish]);

  const shrinking =
    phase === "shrink" ||
    phase === "fade";

  const left = geom
    ? shrinking
      ? geom.startLeft
      : geom.centerLeft
    : 0;

  const top = geom
    ? shrinking
      ? geom.startTop
      : geom.centerTop
    : 0;

  const scale =
    shrinking ? 1 : BIG_SCALE;

  return (
    <div
      className={`splash-overlay ${
        phase === "fade"
          ? " splash-overlay-hide"
          : ""
      }`}
    >
      <div
        className="splash-logo"
        style={{
          left,
          top,
          transform: `scale(${scale})`,
          opacity: geom ? 1 : 0,
        }}
      >
        <div className="splash-container">

          {/* Lotus */}

          <div
            className={`lotus-wrapper ${
              phase === "reveal" ||
              phase === "tagline" ||
              phase === "hold"
                ? "lotus-left"
                : ""
            }`}
          >
           <img
  src="https://i.ibb.co/JRG1F1cm/Saras-Logo-removebg-preview.png"
  alt="SARASWATI"
  className="lotus-logo"
/>
          </div>

          {/* Text */}
<div
  className={`brand-wrapper ${
    phase === "reveal" ||
    phase === "tagline" ||
    phase === "hold"
      ? "brand-show"
      : ""
  }`}
>
  <h1 className="brand-title">
    SARASWATI
  </h1>

  <p
    className={`brand-tagline ${
      phase === "tagline" ||
      phase === "hold"
        ? "tagline-show"
        : ""
    }`}
  >
    Your Notes. Your Knowledge. Your AI.
  </p>
</div>
   

        </div>
      </div>
    </div>
  );
}

export default SplashScreen;