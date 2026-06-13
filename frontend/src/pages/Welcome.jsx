import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";

const GOLD = "#F5A623";
const GOLD_LIGHT = "#FFC95C";
const GOLD_DARK = "#C57F0E";

function SlideOne() {
  return (
    <svg viewBox="0 0 320 340" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="24" y="20" width="272" height="300" rx="20" fill="#141414" />
      <rect x="24" y="20" width="272" height="300" rx="20" stroke="#2A2200" strokeWidth="1" />

      {/* Title */}
      <text x="160" y="62" fill="#FFFFFF" fontSize="13" fontWeight="800" fontFamily="Inter, sans-serif" textAnchor="middle" letterSpacing="0.4">WHY TRADIES CHOOSE</text>
      <text x="160" y="84" fontSize="18" fontWeight="900" fontFamily="Inter, sans-serif" textAnchor="middle" letterSpacing="0.8">
        <tspan fill="#FFFFFF">TERRAIN</tspan>
        <tspan fill={GOLD}>PRO</tspan>
      </text>

      {/* Feature row 1: AI-POWERED QUOTES */}
      <rect x="44" y="110" width="232" height="48" rx="12" fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="0.8" />
      <circle cx="68" cy="134" r="11" fill="#2A2200" />
      <path d="M62 134 L68 128 L74 134 M68 128 L68 140" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <text x="90" y="130" fill="#FFFFFF" fontSize="9" fontWeight="900" fontFamily="Inter, sans-serif" letterSpacing="0.3">AI-POWERED QUOTES</text>
      <text x="90" y="144" fill="#888" fontSize="8" fontWeight="500" fontFamily="Inter, sans-serif">Accurate estimates under 10 minutes.</text>

      {/* Feature row 2: BUILT FOR TRADIES */}
      <rect x="44" y="166" width="232" height="48" rx="12" fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="0.8" />
      <circle cx="68" cy="190" r="11" fill="#2A2200" />
      <path d="M64 192 L68 188 L72 192 M68 184 L68 196" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="68" cy="186" r="2" fill={GOLD} />
      <text x="90" y="186" fill="#FFFFFF" fontSize="9" fontWeight="900" fontFamily="Inter, sans-serif" letterSpacing="0.3">BUILT FOR TRADIES</text>
      <text x="90" y="200" fill="#888" fontSize="8" fontWeight="500" fontFamily="Inter, sans-serif">Simple, fast and hassle-free.</text>

      {/* Feature row 3: LOCAL & RELIABLE */}
      <rect x="44" y="222" width="232" height="48" rx="12" fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="0.8" />
      <circle cx="68" cy="246" r="11" fill="#2A2200" />
      <path d="M68 240 L64 242 L64 248 L68 252 L72 248 L72 242 Z" stroke={GOLD} strokeWidth="1.4" strokeLinejoin="round" fill="none" />
      <text x="90" y="242" fill="#FFFFFF" fontSize="9" fontWeight="900" fontFamily="Inter, sans-serif" letterSpacing="0.3">LOCAL & RELIABLE</text>
      <text x="90" y="256" fill="#888" fontSize="8" fontWeight="500" fontFamily="Inter, sans-serif">Aussie support when you need it.</text>

      {/* Gold accent line */}
      <rect x="120" y="288" width="80" height="2" rx="1" fill={GOLD} opacity="0.5" />
    </svg>
  );
}

function SlideTwo() {
  return (
    <svg viewBox="0 0 320 340" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="24" y="20" width="272" height="300" rx="20" fill="#141414" />
      <rect x="24" y="20" width="272" height="300" rx="20" stroke="#2A2200" strokeWidth="1" />

      {/* Quote header */}
      <text x="48" y="58" fill="#FFFFFF" fontSize="16" fontWeight="900" fontFamily="Inter, sans-serif" letterSpacing="0.8">YOUR QUOTE</text>

      {/* Line items */}
      <text x="48" y="98" fill="#DDD" fontSize="11" fontWeight="500" fontFamily="Inter, sans-serif">Landscaping</text>
      <text x="272" y="98" fill="#FFF" fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif" textAnchor="end">$1,450</text>
      <line x1="48" y1="108" x2="272" y2="108" stroke="#2A2A2A" strokeWidth="0.7" />

      <text x="48" y="128" fill="#DDD" fontSize="11" fontWeight="500" fontFamily="Inter, sans-serif">Earthmoving</text>
      <text x="272" y="128" fill="#FFF" fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif" textAnchor="end">$2,350</text>
      <line x1="48" y1="138" x2="272" y2="138" stroke="#2A2A2A" strokeWidth="0.7" />

      <text x="48" y="158" fill="#DDD" fontSize="11" fontWeight="500" fontFamily="Inter, sans-serif">Concreting</text>
      <text x="272" y="158" fill="#FFF" fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif" textAnchor="end">$1,200</text>
      <line x1="48" y1="170" x2="272" y2="170" stroke="#2A2A2A" strokeWidth="0.7" />

      {/* Total */}
      <text x="48" y="200" fill={GOLD} fontSize="11" fontWeight="900" fontFamily="Inter, sans-serif" letterSpacing="0.4">TOTAL</text>
      <text x="100" y="200" fill="#888" fontSize="9" fontWeight="500" fontFamily="Inter, sans-serif">(Incl. GST)</text>
      <text x="272" y="202" fill={GOLD} fontSize="22" fontWeight="900" fontFamily="Inter, sans-serif" textAnchor="end" letterSpacing="0.5">$5,000</text>

      {/* Badges */}
      <circle cx="60" cy="232" r="6" fill="none" stroke={GOLD} strokeWidth="1.4" />
      <path d="M57 232 L60 235 L63 230" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="72" y="235" fill="#DDD" fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">Fixed Price</text>
      <circle cx="158" cy="232" r="6" fill="none" stroke={GOLD} strokeWidth="1.4" />
      <path d="M155 232 L158 235 L161 230" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="170" y="235" fill="#DDD" fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">No Hidden Fees</text>

      {/* CTA button */}
      <rect x="48" y="258" width="224" height="38" rx="10" fill={GOLD} />
      <text x="160" y="282" fill="#1A1A1A" fontSize="13" fontWeight="900" fontFamily="Inter, sans-serif" textAnchor="middle" letterSpacing="0.6">NEXT STEP →</text>
    </svg>
  );
}

function SlideThree() {
  return (
    <svg viewBox="0 0 320 340" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="24" y="20" width="272" height="300" rx="20" fill="#141414" />
      <rect x="24" y="20" width="272" height="300" rx="20" stroke="#2A2200" strokeWidth="1" />

      {/* Checkmark circle */}
      <circle cx="160" cy="76" r="22" fill="none" stroke={GOLD} strokeWidth="2" />
      <path d="M150 76 L158 84 L172 70" stroke={GOLD} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Title */}
      <text x="160" y="130" fill="#FFFFFF" fontSize="20" fontWeight="900" fontFamily="Inter, sans-serif" textAnchor="middle" letterSpacing="0.8">JOB CONFIRMED!</text>

      {/* Description */}
      <text x="160" y="160" fill="#999" fontSize="10" fontWeight="500" fontFamily="Inter, sans-serif" textAnchor="middle">We&apos;ve received your request</text>
      <text x="160" y="174" fill="#999" fontSize="10" fontWeight="500" fontFamily="Inter, sans-serif" textAnchor="middle">and will be in touch soon.</text>

      {/* Info card */}
      <rect x="56" y="196" width="208" height="92" rx="10" fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="0.8" />

      <text x="74" y="222" fill="#888" fontSize="10" fontWeight="500" fontFamily="Inter, sans-serif">Job ID</text>
      <text x="170" y="222" fill="#FFF" fontSize="11" fontWeight="800" fontFamily="Inter, sans-serif">TP-76845</text>

      <text x="74" y="246" fill="#888" fontSize="10" fontWeight="500" fontFamily="Inter, sans-serif">Date</text>
      <text x="170" y="246" fill="#FFF" fontSize="11" fontWeight="800" fontFamily="Inter, sans-serif">15 May 2024</text>

      <text x="74" y="270" fill="#888" fontSize="10" fontWeight="500" fontFamily="Inter, sans-serif">Time</text>
      <text x="170" y="270" fill="#FFF" fontSize="11" fontWeight="800" fontFamily="Inter, sans-serif">8:00 AM</text>
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
        <div className="w-full flex items-center justify-between mb-6">
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
        <div className="mb-5 flex justify-center w-full">
          <img
            src="/terrainpro-logo-full.png"
            alt="TerrainPRO"
            className="h-16 w-auto object-contain select-none"
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
