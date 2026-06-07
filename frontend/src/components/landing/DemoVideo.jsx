import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";

export default function DemoVideo() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section
      id="demo-video"
      data-testid="demo-video-section"
      className="relative py-24 sm:py-32 border-t border-neutral-900 overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        <div className="mb-10 sm:mb-12">
          <span className="font-display uppercase text-4xl sm:text-5xl tracking-tight text-yellow-500">
            <span className="opacity-50">[</span> See It In Action <span className="opacity-50">]</span>
          </span>
          <p className="mt-4 text-neutral-400 leading-relaxed max-w-xl">
            Watch TerrainPRO build a fully line-itemed AUD quote in under 10 minutes —
            from job brief to branded PDF, straight from the cab.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-3xl rounded-lg overflow-hidden border border-zinc-800 border-l-2 border-t-2 border-l-yellow-500 border-t-yellow-500 bg-zinc-900/40 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7)]"
        >
          <div className="relative aspect-[4/3] bg-black">
            <video
              ref={videoRef}
              src="/demo-quote.mp4"
              data-testid="demo-video-player"
              className="absolute inset-0 w-full h-full object-contain bg-black"
              playsInline
              preload="metadata"
              controls={playing}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
            />

            {!playing && (
              <button
                type="button"
                onClick={togglePlay}
                data-testid="demo-video-play"
                aria-label="Play demo video"
                className="group absolute inset-0 grid place-items-center bg-black/40 hover:bg-black/30 transition-colors"
              >
                <span className="grid place-items-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F5A623] text-black shadow-[0_10px_40px_-5px_rgba(245,166,35,0.65)] group-hover:scale-105 group-active:scale-95 transition-transform duration-200">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1" strokeWidth={2.6} fill="currentColor" />
                </span>
              </button>
            )}

            {playing && (
              <button
                type="button"
                onClick={togglePlay}
                data-testid="demo-video-pause"
                aria-label="Pause demo video"
                className="absolute top-4 right-4 grid place-items-center w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
              >
                <Pause className="w-4 h-4" strokeWidth={2.6} />
              </button>
            )}
          </div>

          {/* Caption strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-zinc-800 px-5 py-4 bg-black/60">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-yellow-500 rotate-45" aria-hidden />
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-yellow-500">
                Real customer job // Retaining wall + slab + driveway
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
              Sound recommended · 🔊
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
