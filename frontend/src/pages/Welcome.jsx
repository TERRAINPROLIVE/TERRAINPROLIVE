import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";

const GOLD = "#F5A623";
const GOLD_LIGHT = "#FFC95C";
const GOLD_DARK = "#C57F0E";

function SlideOne() {
  return (
    <svg viewBox="0 0 320 340" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="24" y="20" width="272" height="300" rx="20" fill="#1A1A1A" />
      <rect x="24" y="20" width="272" height="300" rx="20" stroke="#2C2C2C" strokeWidth="1" />
      <rect x="24" y="20" width="272" height="52" rx="20" fill="#222" />
      <rect x="24" y="52" width="272" height="20" fill="#222" />
      <circle cx="52" cy="46" r="12" fill={GOLD} opacity="0.18" />
      <circle cx="52" cy="46" r="6" fill={GOLD} />
      <rect x="72" y="40" width="80" height="8" rx="4" fill="#EFEFEF" />
      <rect x="72" y="52" width="50" height="6" rx="3" fill="#666" />
      <rect x="262" y="36" width="24" height="24" rx="8" fill="#2A2200" />
      <path d="M270 48 L274 44 L278 48" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M270 52 L274 48 L278 52" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
      <rect x="40" y="82" width="60" height="6" rx="3" fill="#555" />
      <rect x="220" y="80" width="60" height="10" rx="5" fill="#2A2200" />
      <rect x="232" y="82" width="36" height="6" rx="3" fill={GOLD} />
      <rect x="44" y="200" width="28" height="20" rx="6" fill={GOLD} />
      <rect x="44" y="160" width="28" height="40" rx="6" fill={GOLD} opacity="0.12" />
      <rect x="84" y="165" width="28" height="55" rx="6" fill={GOLD} />
      <rect x="84" y="140" width="28" height="25" rx="6" fill={GOLD} opacity="0.12" />
      <rect x="124" y="140" width="28" height="80" rx="6" fill={GOLD_LIGHT} />
      <rect x="124" y="120" width="28" height="20" rx="6" fill={GOLD_LIGHT} opacity="0.15" />
      <rect x="164" y="115" width="28" height="105" rx="6" fill={GOLD_LIGHT} />
      <rect x="164" y="100" width="28" height="15" rx="6" fill={GOLD_LIGHT} opacity="0.15" />
      <rect x="204" y="148" width="28" height="72" rx="6" fill={GOLD} />
      <rect x="244" y="122" width="28" height="98" rx="6" fill={GOLD} />
      <rect x="116" y="105" width="44" height="22" rx="11" fill={GOLD} />
      <rect x="120" y="112" width="36" height="8" rx="4" fill="#1A1A1A" />
      <rect x="40" y="248" width="72" height="48" rx="12" fill="#222" />
      <rect x="48" y="256" width="28" height="6" rx="3" fill="#555" />
      <rect x="48" y="268" width="50" height="10" rx="5" fill={GOLD} />
      <rect x="48" y="282" width="36" height="6" rx="3" fill="#888" />
      <rect x="124" y="248" width="72" height="48" rx="12" fill="#222" />
      <rect x="132" y="256" width="28" height="6" rx="3" fill="#555" />
      <rect x="132" y="268" width="50" height="10" rx="5" fill={GOLD_LIGHT} />
      <rect x="132" y="282" width="36" height="6" rx="3" fill="#888" />
      <rect x="208" y="248" width="72" height="48" rx="12" fill="#222" />
      <rect x="216" y="256" width="28" height="6" rx="3" fill="#555" />
      <rect x="216" y="268" width="50" height="10" rx="5" fill={GOLD} />
      <rect x="216" y="282" width="36" height="6" rx="3" fill="#555" />
    </svg>
  );
}

function SlideTwo() {
  return (
    <svg viewBox="0 0 320 340" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="24" y="20" width="272" height="300" rx="20" fill="#1A1A1A" />
      <rect x="24" y="20" width="272" height="300" rx="20" stroke="#2C2C2C" strokeWidth="1" />
      <rect x="40" y="36" width="80" height="10" rx="5" fill="#EFEFEF" />
      <rect x="40" y="52" width="120" height="7" rx="3.5" fill="#666" />
      <rect x="40" y="76" width="240" height="44" rx="12" fill="#222" />
      <rect x="52" y="90" width="100" height="8" rx="4" fill="#EFEFEF" />
      <rect x="52" y="102" width="70" height="6" rx="3" fill="#666" />
      <rect x="238" y="88" width="36" height="20" rx="10" fill={GOLD} />
      <circle cx="264" cy="98" r="8" fill="#1A1A1A" />
      <rect x="40" y="130" width="240" height="44" rx="12" fill="#222" />
      <rect x="52" y="144" width="90" height="8" rx="4" fill="#EFEFEF" />
      <rect x="52" y="156" width="110" height="6" rx="3" fill="#666" />
      <rect x="238" y="142" width="36" height="20" rx="10" fill="#333" />
      <circle cx="247" cy="152" r="8" fill="#555" />
      <rect x="40" y="184" width="240" height="44" rx="12" fill="#222" />
      <rect x="52" y="198" width="76" height="8" rx="4" fill="#EFEFEF" />
      <rect x="52" y="210" width="90" height="6" rx="3" fill="#666" />
      <rect x="238" y="196" width="36" height="20" rx="10" fill={GOLD_LIGHT} />
      <circle cx="264" cy="206" r="8" fill="#1A1A1A" />
      <rect x="40" y="246" width="60" height="8" rx="4" fill="#555" />
      <rect x="40" y="262" width="64" height="26" rx="13" fill="#2A2200" />
      <rect x="50" y="272" width="44" height="6" rx="3" fill={GOLD} />
      <rect x="112" y="262" width="72" height="26" rx="13" fill="#2A2200" />
      <rect x="122" y="272" width="52" height="6" rx="3" fill={GOLD_LIGHT} />
      <rect x="192" y="262" width="56" height="26" rx="13" fill="#252525" />
      <rect x="202" y="272" width="36" height="6" rx="3" fill="#888" />
    </svg>
  );
}

function SlideThree() {
  return (
    <svg viewBox="0 0 320 340" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="24" y="20" width="272" height="300" rx="20" fill="#1A1A1A" />
      <rect x="24" y="20" width="272" height="300" rx="20" stroke="#2C2C2C" strokeWidth="1" />
      <rect x="40" y="36" width="100" height="10" rx="5" fill="#EFEFEF" />
      <rect x="40" y="52" width="70" height="7" rx="3.5" fill="#666" />
      <rect x="260" y="32" width="28" height="28" rx="8" fill="#222" />
      <rect x="266" y="41" width="16" height="2" rx="1" fill="#888" />
      <rect x="269" y="46" width="10" height="2" rx="1" fill="#888" />
      <rect x="271" y="51" width="6" height="2" rx="1" fill="#888" />
      <rect x="40" y="76" width="240" height="64" rx="14" fill="#211A00" />
      <rect x="40" y="76" width="4" height="64" rx="2" fill={GOLD} />
      <rect x="52" y="88" width="110" height="9" rx="4.5" fill="#EFEFEF" />
      <rect x="52" y="103" width="70" height="6" rx="3" fill="#666" />
      <rect x="52" y="118" width="46" height="6" rx="3" fill="#555" />
      <rect x="212" y="88" width="52" height="20" rx="10" fill={GOLD} />
      <rect x="220" y="95" width="36" height="6" rx="3" fill="#1A1A1A" />
      <rect x="40" y="152" width="240" height="64" rx="14" fill="#1E1A00" />
      <rect x="40" y="152" width="4" height="64" rx="2" fill={GOLD_LIGHT} />
      <rect x="52" y="164" width="130" height="9" rx="4.5" fill="#EFEFEF" />
      <rect x="52" y="179" width="80" height="6" rx="3" fill="#666" />
      <rect x="52" y="194" width="56" height="6" rx="3" fill="#555" />
      <rect x="204" y="164" width="68" height="20" rx="10" fill={GOLD_LIGHT} />
      <rect x="212" y="171" width="52" height="6" rx="3" fill="#1A1A1A" />
      <rect x="40" y="228" width="240" height="64" rx="14" fill="#1E1A00" />
      <rect x="40" y="228" width="4" height="64" rx="2" fill="#888" />
      <rect x="52" y="240" width="95" height="9" rx="4.5" fill="#EFEFEF" />
      <rect x="52" y="255" width="60" height="6" rx="3" fill="#666" />
      <rect x="52" y="270" width="80" height="6" rx="3" fill="#555" />
      <rect x="192" y="240" width="80" height="20" rx="10" fill="#333" />
      <rect x="200" y="247" width="64" height="6" rx="3" fill="#AAA" />
      <circle cx="272" cy="308" r="16" fill={GOLD} />
      <line x1="272" y1="300" x2="272" y2="316" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <line x1="264" y1="308" x2="280" y2="308" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const SLIDES = [
  {
    id: 0,
    eyebrow: "Step 01 // The Engine",
    title: "Instant Quotes",
    description:
      "AI-powered estimates built for Aussie tradies. Pricing in under 10 minutes — straight from the cab.",
    illustration: <SlideOne />,
  },
  {
    id: 1,
    eyebrow: "Step 02 // The Inputs",
    title: "Smarter Inputs",
    description:
      "Toggle jobs, adjust scope. The engine handles rates, materials and margins. No spreadsheets.",
    illustration: <SlideTwo />,
  },
  {
    id: 2,
    eyebrow: "Step 03 // The Wins",
    title: "Win More Jobs",
    description:
      "Send line-itemed PDFs from site. Track what's Draft, Sent, Won or Lost — all in one place.",
    illustration: <SlideThree />,
  },
];

const DURATION = 4500;

export default function Welcome() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [slideKey, setSlideKey] = useState(0);
  const [slideDir, setSlideDir] = useState(1);
  const autoRef = useRef(null);
  const touchX = useRef(null);
  const busy = useRef(false);

  // Desktop fallback: skip carousel entirely
  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (isDesktop) navigate("/signup", { replace: true });
  }, [navigate]);

  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  const go = (idx, dir) => {
    if (busy.current || idx === current) return;
    busy.current = true;
    setSlideDir(dir);
    setSlideKey((k) => k + 1);
    setCurrent(idx);
    setTimeout(() => {
      busy.current = false;
    }, 520);
  };

  const next = () => {
    if (isLast) {
      navigate("/signup");
    } else {
      go((current + 1) % SLIDES.length, 1);
    }
  };
  const prev = () => go((current - 1 + SLIDES.length) % SLIDES.length, -1);

  useEffect(() => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      if (current < SLIDES.length - 1) {
        go((current + 1) % SLIDES.length, 1);
      }
    }, DURATION);
    return () => clearInterval(autoRef.current);
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const d = touchX.current - e.changedTouches[0].clientX;
    if (Math.abs(d) > 44) {
      if (d > 0) next();
      else prev();
    }
    touchX.current = null;
  };

  return (
    <div
      data-testid="welcome-page"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center px-6 pt-6 pb-8 overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 10%, rgba(245,166,35,0.06) 0%, #0a0a0a 55%, #060606 100%)",
      }}
    >
      <div className="w-full max-w-sm flex flex-col items-center flex-1">
        {/* Top bar: progress pills + skip */}
        <div className="w-full flex items-center justify-between mb-7">
          <div className="flex gap-1.5 items-center">
            {SLIDES.map((_, i) => (
              <div
                key={i}
                data-testid={`welcome-pill-${i}`}
                className="h-[3px] rounded-full transition-all duration-300"
                style={{
                  width: i === current ? "28px" : "6px",
                  background: i === current ? GOLD : "rgba(255,255,255,0.12)",
                }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            data-testid="welcome-skip"
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 hover:text-yellow-500 transition-colors p-1.5 inline-flex items-center gap-1.5"
          >
            Skip <X className="w-3 h-3" strokeWidth={2.4} />
          </button>
        </div>

        {/* Brand */}
        <div className="mb-5">
          <img
            src="/terrainpro-logo-full.png"
            alt="TerrainPRO"
            className="h-10 w-auto object-contain select-none"
            draggable={false}
          />
        </div>

        {/* Illustration circle */}
        <div
          className="relative rounded-full overflow-hidden bg-[#181818] flex items-center justify-center shrink-0 mb-6"
          style={{
            width: "min(56vw, 220px)",
            height: "min(56vw, 220px)",
            boxShadow: `0 0 0 1.5px rgba(245,166,35,0.12), 0 22px 64px rgba(0,0,0,0.85), 0 0 90px ${GOLD}1A`,
          }}
        >
          <div
            key={slideKey}
            className={`absolute inset-0 flex items-center justify-center p-3 z-10 ${
              slideDir > 0 ? "welcome-from-right" : "welcome-from-left"
            }`}
          >
            {slide.illustration}
          </div>
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background:
                "radial-gradient(circle at 26% 20%, rgba(255,255,255,0.06) 0%, transparent 55%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none z-30 rounded-full border-[1.5px]"
            style={{ borderColor: `${GOLD}28` }}
          />
        </div>

        {/* Auto-progress bar (CSS-driven, restarts with key) */}
        <div className="w-full h-[2px] rounded-full bg-white/[0.07] overflow-hidden mb-6">
          <div
            key={current}
            className="welcome-progress-fill h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${GOLD}, ${GOLD_DARK})`,
            }}
          />
        </div>

        {/* Copy */}
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow-500 mb-2">
          {slide.eyebrow}
        </div>
        <h1
          data-testid="welcome-title"
          className="font-display uppercase text-[28px] font-bold tracking-tight leading-[0.95] text-white text-center mb-3 min-h-[32px] flex items-center justify-center"
        >
          {slide.title}
        </h1>
        <p className="text-[13px] leading-[1.55] text-white/55 text-center max-w-[28ch] min-h-[60px]">
          {slide.description}
        </p>

        {/* Dots */}
        <div className="flex items-center gap-2 my-6">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i, i > current ? 1 : -1)}
              aria-label={`Slide ${i + 1}`}
              data-testid={`welcome-dot-${i}`}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === current ? "28px" : "8px",
                background: i === current ? GOLD : "rgba(255,255,255,0.18)",
                transform: i === current ? "none" : "scale(0.88)",
              }}
            />
          ))}
        </div>

        {/* Primary CTA — always Free Trial */}
        <button
          type="button"
          onClick={() => navigate("/signup")}
          data-testid="welcome-cta"
          className="w-full inline-flex items-center justify-center gap-2 py-4 px-8 rounded-lg bg-[#F5A623] text-zinc-900 font-black uppercase tracking-widest text-sm shadow-[0_10px_30px_-5px_rgba(245,166,35,0.5)] hover:bg-[#ffb733] hover:shadow-[0_14px_38px_-4px_rgba(245,166,35,0.65)] active:scale-[0.98] transition-all duration-200"
        >
          Free Trial
          <ArrowRight className="w-4 h-4" strokeWidth={2.6} />
        </button>

        <p
          data-testid="welcome-signin"
          className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/35"
        >
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-yellow-500 hover:text-yellow-400 transition-colors font-bold"
          >
            Sign In
          </button>
        </p>
      </div>

      <style>{`
        @keyframes welcomeFromR { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes welcomeFromL { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        .welcome-from-right { animation: welcomeFromR .46s cubic-bezier(.4,0,.2,1) forwards; }
        .welcome-from-left  { animation: welcomeFromL .46s cubic-bezier(.4,0,.2,1) forwards; }
        @keyframes welcomeProgressFill { from { width: 0%; } to { width: 100%; } }
        .welcome-progress-fill { animation: welcomeProgressFill 4500ms linear forwards; }
        @media (prefers-reduced-motion: reduce) {
          .welcome-from-right, .welcome-from-left, .welcome-progress-fill { animation: none; }
        }
      `}</style>
    </div>
  );
}
