import { useState, useEffect, useRef } from 'react';
import { Activity, Brain, Cpu, ShieldCheck, Battery, Sparkles } from 'lucide-react';

export default function BionicShowcase() {
  const [cursorVisible, setCursorVisible] = useState(true);
  const heroLayerRef = useRef<HTMLDivElement>(null);
  const neuralLayerRef = useRef<HTMLDivElement>(null);
  const artLayerRef = useRef<HTMLDivElement>(null);
  const socketLayerRef = useRef<HTMLDivElement>(null);

  // Blinking clinical typewriter cursor
  useEffect(() => {
    const timer = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(timer);
  }, []);

  // Coordinated sticky scrollytelling: 1:1 synchronization with 3D model
  useEffect(() => {
    let rafId = 0;
    let currentFraction = 0;
    let targetFraction = 0;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const winH = window.innerHeight || 1;
      // 400vh total height, 3 transitions across 3 * winH
      // fraction: 0.0 = Hero, 1.0 = Neural EMG, 2.0 = Kinematics, 3.0 = Socket/Haptics
      targetFraction = Math.max(0, Math.min(scrollY / winH, 3));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    currentFraction = targetFraction;

    const render = () => {
      rafId = requestAnimationFrame(render);

      // Smooth continuous damping matching the 3D model's 0.14 lerp factor
      currentFraction += (targetFraction - currentFraction) * 0.14;

      const winW = window.innerWidth;
      // On mobile screens, use smaller slide offsets so text doesn't shoot off-screen
      const slideDist = winW < 768 ? Math.min(winW * 0.15, 60) : Math.min(winW * 0.55, 520);

      // =========================================================================
      // STAGE 0 (HERO) -> STAGE 1 (NEURAL EMG)
      // Phase 1 (0.00 -> 0.20): Halo fades out in place. Hero text & 3D Arm hold still.
      // Phase 2 (0.20 -> 1.00): Hero text exits left, Neural text enters from right, 3D arm slides.
      // =========================================================================
      const FADE_CUTOFF = 0.20;

      let heroSlideX = 0;
      let heroOpacity = 0;
      let neuralSlideX = slideDist;
      let neuralOpacity = 0;

      if (currentFraction <= FADE_CUTOFF) {
        // Holding still while Halo fades out
        heroSlideX = 0;
        heroOpacity = 1;
        neuralSlideX = slideDist;
        neuralOpacity = 0;
      } else if (currentFraction <= 1.0) {
        // Synchronized movement phase
        const moveT = (currentFraction - FADE_CUTOFF) / (1.0 - FADE_CUTOFF);
        const ease = moveT * moveT * (3 - 2 * moveT);

        heroSlideX = ease * slideDist;
        heroOpacity = Math.max(0, 1 - ease * 1.35);

        neuralSlideX = (1 - ease) * slideDist;
        neuralOpacity = Math.min(1, ease * 1.35);
      } else if (currentFraction <= 2.0) {
        // Exiting as user scrolls to Stage 2
        heroSlideX = slideDist;
        heroOpacity = 0;
        const exitT = Math.min(Math.max(currentFraction - 1.0, 0), 1);
        const exitEase = exitT * exitT * (3 - 2 * exitT);
        neuralSlideX = exitEase * (slideDist * 0.5);
        neuralOpacity = Math.max(0, 1 - exitEase * 1.35);
      } else {
        heroSlideX = slideDist;
        heroOpacity = 0;
        neuralSlideX = slideDist * 0.5;
        neuralOpacity = 0;
      }

      if (heroLayerRef.current) {
        heroLayerRef.current.style.transform = `translate3d(-${heroSlideX.toFixed(1)}px, 0, 0)`;
        heroLayerRef.current.style.opacity = heroOpacity.toFixed(3);
        heroLayerRef.current.style.pointerEvents = heroOpacity > 0.1 ? 'auto' : 'none';
        heroLayerRef.current.style.visibility = heroOpacity > 0.01 ? 'visible' : 'hidden';
      }

      if (neuralLayerRef.current) {
        neuralLayerRef.current.style.transform = `translate3d(${neuralSlideX.toFixed(1)}px, 0, 0)`;
        neuralLayerRef.current.style.opacity = neuralOpacity.toFixed(3);
        neuralLayerRef.current.style.pointerEvents = neuralOpacity > 0.1 ? 'auto' : 'none';
        neuralLayerRef.current.style.visibility = neuralOpacity > 0.01 ? 'visible' : 'hidden';
      }

      // =========================================================================
      // SLIDE 2 (ACTUATION): Left side, enters from left (1.0 -> 2.0), exits to left (2.0 -> 3.0)
      // =========================================================================
      let artSlideX = 0;
      let artOpacity = 0;

      if (currentFraction <= 1.0) {
        artSlideX = -slideDist;
        artOpacity = 0;
      } else if (currentFraction <= 2.0) {
        const enterT = Math.min(Math.max(currentFraction - 1.0, 0), 1);
        const enterEase = enterT * enterT * (3 - 2 * enterT);
        artSlideX = -(1 - enterEase) * slideDist;
        artOpacity = Math.min(1, enterEase * 1.35);
      } else if (currentFraction <= 3.0) {
        const exitT = Math.min(Math.max(currentFraction - 2.0, 0), 1);
        const exitEase = exitT * exitT * (3 - 2 * exitT);
        artSlideX = -exitEase * (slideDist * 0.5);
        artOpacity = Math.max(0, 1 - exitEase * 1.35);
      } else {
        artSlideX = -(slideDist * 0.5);
        artOpacity = 0;
      }

      if (artLayerRef.current) {
        artLayerRef.current.style.transform = `translate3d(${artSlideX.toFixed(1)}px, 0, 0)`;
        artLayerRef.current.style.opacity = artOpacity.toFixed(3);
        artLayerRef.current.style.pointerEvents = artOpacity > 0.1 ? 'auto' : 'none';
        artLayerRef.current.style.visibility = artOpacity > 0.01 ? 'visible' : 'hidden';
      }

      // =========================================================================
      // SLIDE 3 (SOCKET & HAPTICS): Right side, enters from right (2.0 -> 3.0)
      // =========================================================================
      let socketSlideX = 0;
      let socketOpacity = 0;

      if (currentFraction <= 2.0) {
        socketSlideX = slideDist;
        socketOpacity = 0;
      } else if (currentFraction <= 3.0) {
        const enterT = Math.min(Math.max(currentFraction - 2.0, 0), 1);
        const enterEase = enterT * enterT * (3 - 2 * enterT);
        socketSlideX = (1 - enterEase) * slideDist;
        socketOpacity = Math.min(1, enterEase * 1.35);
      } else {
        socketSlideX = 0;
        socketOpacity = 1;
      }

      if (socketLayerRef.current) {
        socketLayerRef.current.style.transform = `translate3d(${socketSlideX.toFixed(1)}px, 0, 0)`;
        socketLayerRef.current.style.opacity = socketOpacity.toFixed(3);
        socketLayerRef.current.style.pointerEvents = socketOpacity > 0.1 ? 'auto' : 'none';
        socketLayerRef.current.style.visibility = socketOpacity > 0.01 ? 'visible' : 'hidden';
      }
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div id="bionic-showcase" className="relative h-[400vh] min-h-[400dvh]">
      {/* Absolute anchor checkpoints for usePointToPointScroll and anchor navigation */}
      <div id="hero" className="absolute top-0 h-screen min-h-[100dvh] w-full pointer-events-none" />
      <div id="neural-emg" className="absolute top-[100vh] h-screen min-h-[100dvh] w-full pointer-events-none" />
      <div id="articulation" className="absolute top-[200vh] h-screen min-h-[100dvh] w-full pointer-events-none" />
      <div id="socket-haptics" className="absolute top-[300vh] h-screen min-h-[100dvh] w-full pointer-events-none" />

      {/* =========================================================================
          STICKY PRESENTATION VIEWPORT: Locked to screen, 0px vertical movement
      ========================================================================= */}
      <div className="sticky top-0 h-screen min-h-[100dvh] w-full overflow-hidden">
        {/* =========================================================================
            STAGE 0: HERO OVERVIEW (Mobile: Arm top, Text bottom | Desktop: Arm right, Text left)
        ========================================================================= */}
        <div
          ref={heroLayerRef}
          className="absolute inset-0 z-30 flex items-end justify-center md:items-center md:justify-start pointer-events-auto will-change-transform pb-4 sm:pb-6 md:pb-0"
        >
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 w-full">
            <div className="max-w-xl text-center md:text-left mx-auto md:mx-0">
              {/* Index tag — JetBrains Mono */}
              <p className="text-[9px] sm:text-[10px] md:text-[11px] font-mono tracking-[0.25em] sm:tracking-[0.3em] uppercase text-slate-400 mb-1 sm:mb-2 md:mb-10">
                00 &mdash; Neuroprosthetics
              </p>

              {/* Display headline with mobile-friendly clamp */}
              <h1
                className="font-sans leading-[0.92] mb-1.5 sm:mb-3 md:mb-8 text-slate-900 text-3xl sm:text-5xl md:text-7xl lg:text-8xl tracking-tight"
              >
                <span className="font-light block">Restoring</span>
                <span className="font-bold block">Human</span>
                <span className="font-light block">Motion.</span>
              </h1>

              {/* Divider */}
              <div className="w-6 sm:w-8 h-[1px] bg-slate-200 mb-1.5 sm:mb-3 md:mb-8 mx-auto md:mx-0" />

              {/* Body */}
              <p className="text-[11px] sm:text-xs md:text-[15px] text-slate-600 md:text-slate-500 leading-snug sm:leading-relaxed md:leading-[1.75] max-w-xs mb-2 sm:mb-4 md:mb-10 font-normal mx-auto md:mx-0">
                Neural-linked bionic prosthetics.<br />
                Built in Kathmandu. Built for life.
              </p>

              {/* Scroll cue */}
              <a
                href="#neural-emg"
                className="inline-flex items-center justify-center md:justify-start gap-2 text-[9px] sm:text-[10px] font-mono tracking-[0.25em] uppercase text-slate-400 hover:text-slate-900 transition-colors duration-200 py-0.5"
              >
                <span className="w-4 h-[1px] bg-current" />
                Inspect anatomy
              </a>
            </div>
          </div>
        </div>

        {/* =========================================================================
            STAGE 1: NEURAL EMG INTERFACE (Mobile: Arm top, Card bottom | Desktop: Content Right)
        ========================================================================= */}
        <div
          ref={neuralLayerRef}
          className="absolute inset-0 z-30 flex items-end justify-center md:items-center md:justify-end pointer-events-auto will-change-transform pb-3 sm:pb-5 md:pb-0"
          style={{ opacity: 0, visibility: 'hidden' }}
        >
          <div className="relative z-20 max-w-7xl mx-auto px-3 sm:px-8 lg:px-16 w-full py-2 md:py-20 flex justify-center md:justify-end">
            <div className="w-full max-w-md md:max-w-none lg:w-[500px] xl:w-[540px] space-y-2 sm:space-y-3.5 md:space-y-6 bg-white/95 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none p-3.5 sm:p-5 md:p-0 rounded-2xl md:rounded-none border border-slate-200/90 md:border-none shadow-xl md:shadow-none mx-auto md:mx-0">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <p className="text-[9px] sm:text-[10px] md:text-[11px] font-mono tracking-[0.2em] uppercase text-emerald-600 font-semibold">
                  PART 01 · NEURAL CONTROL
                </p>
              </div>

              <h3 className="text-base sm:text-2xl md:text-4xl lg:text-5xl font-light text-slate-900 tracking-tight leading-tight">
                Multichannel <br className="hidden sm:inline" />
                <span className="font-sans font-normal">Surface EMG Matrix</span>
              </h3>

              <p className="text-[11px] sm:text-xs md:text-base text-slate-600 leading-snug md:leading-relaxed max-w-lg">
                Conformal dry-contact electrode arrays map subtle electrical impulses
                from residual forearm muscles. On-device neural AI decodes motion in &lt;50ms.
              </p>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-0.5 md:pt-2">
                <div className="bg-slate-50/90 border border-slate-200/80 rounded-lg md:rounded-xl p-2 sm:p-3 md:p-4 shadow-xs">
                  <div className="flex items-center gap-1 text-emerald-600 mb-0.5">
                    <Brain size={13} className="md:w-4 md:h-4" />
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-mono font-semibold">LATENCY</span>
                  </div>
                  <p className="text-sm sm:text-lg md:text-2xl font-sans font-semibold text-slate-900 leading-tight">&lt; 50 ms</p>
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 font-mono">Real-time inference</p>
                </div>

                <div className="bg-slate-50/90 border border-slate-200/80 rounded-lg md:rounded-xl p-2 sm:p-3 md:p-4 shadow-xs">
                  <div className="flex items-center gap-1 text-blue-600 mb-0.5">
                    <Activity size={13} className="md:w-4 md:h-4" />
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-mono font-semibold">CHANNELS</span>
                  </div>
                  <p className="text-sm sm:text-lg md:text-2xl font-sans font-semibold text-slate-900 leading-tight">16-Ch Matrix</p>
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 font-mono">High-density array</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 border-t border-slate-200/60 pt-2 md:pt-5">
                <Sparkles size={12} className="text-amber-500 shrink-0 md:w-3.5 md:h-3.5" />
                <span className="text-[9px] sm:text-[10px] md:text-xs leading-snug">Adaptive neural AI calibrates daily to muscle fatigue &amp; perspiration.</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            STAGE 2: 14-DoF MICRO-ACTUATORS (Mobile: Arm top, Card bottom | Desktop: Content Left)
        ========================================================================= */}
        <div
          ref={artLayerRef}
          className="absolute inset-0 z-30 flex items-end justify-center md:items-center md:justify-start pointer-events-auto will-change-transform pb-3 sm:pb-5 md:pb-0"
          style={{ opacity: 0, visibility: 'hidden' }}
        >
          <div className="relative z-20 max-w-7xl mx-auto px-3 sm:px-8 lg:px-16 w-full py-2 md:py-20 flex justify-center md:justify-start">
            <div className="w-full max-w-md md:max-w-none lg:w-[500px] xl:w-[540px] space-y-2 sm:space-y-3.5 md:space-y-6 bg-white/95 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none p-3.5 sm:p-5 md:p-0 rounded-2xl md:rounded-none border border-slate-200/90 md:border-none shadow-xl md:shadow-none mx-auto md:mx-0">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <p className="text-[9px] sm:text-[10px] md:text-[11px] font-mono tracking-[0.2em] uppercase text-blue-600 font-semibold">
                  PART 02 · KINEMATICS &amp; GRIP
                </p>
              </div>

              <h3 className="text-base sm:text-2xl md:text-4xl lg:text-5xl font-light text-slate-900 tracking-tight leading-tight">
                14 Degrees of Freedom <br className="hidden sm:inline" />
                <span className="font-sans font-normal">Micro-Actuators</span>
              </h3>

              <p className="text-[11px] sm:text-xs md:text-base text-slate-600 leading-snug md:leading-relaxed max-w-lg">
                Individually motorized brushless DC micromotors in every joint. Features compliant tendons that self-conform around organic shapes.
              </p>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-0.5 md:pt-2">
                <div className="bg-slate-50/90 border border-slate-200/80 rounded-lg md:rounded-xl p-2 sm:p-3 md:p-4 shadow-xs">
                  <div className="flex items-center gap-1 text-blue-600 mb-0.5">
                    <Cpu size={13} className="md:w-4 md:h-4" />
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-mono font-semibold">MOTORS</span>
                  </div>
                  <p className="text-sm sm:text-lg md:text-2xl font-sans font-semibold text-slate-900 leading-tight">14 Active DoF</p>
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 font-mono">Independent digits</p>
                </div>

                <div className="bg-slate-50/90 border border-slate-200/80 rounded-lg md:rounded-xl p-2 sm:p-3 md:p-4 shadow-xs">
                  <div className="flex items-center gap-1 text-emerald-600 mb-0.5">
                    <ShieldCheck size={13} className="md:w-4 md:h-4" />
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-mono font-semibold">WEIGHT</span>
                  </div>
                  <p className="text-sm sm:text-lg md:text-2xl font-sans font-semibold text-slate-900 leading-tight">480 grams</p>
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 font-mono">30% lighter than avg</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 border-t border-slate-200/60 pt-2 md:pt-5">
                <span className="font-mono text-blue-600 font-semibold text-[9px] sm:text-[10px] md:text-xs shrink-0">GRIP MODES:</span>
                <span className="text-[9px] sm:text-[10px] md:text-xs truncate">Tripod, Precision Pinch, Power Cylinder, Lateral Key.</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            STAGE 3: MODULAR SOCKET & HAPTICS (Mobile: Arm top, Card bottom | Desktop: Content Right)
        ========================================================================= */}
        <div
          ref={socketLayerRef}
          className="absolute inset-0 z-30 flex items-end justify-center md:items-center md:justify-end pointer-events-auto will-change-transform pb-3 sm:pb-5 md:pb-0"
          style={{ opacity: 0, visibility: 'hidden' }}
        >
          <div className="relative z-20 max-w-7xl mx-auto px-3 sm:px-8 lg:px-16 w-full py-2 md:py-20 flex justify-center md:justify-end">
            <div className="w-full max-w-md md:max-w-none lg:w-[500px] xl:w-[540px] space-y-2 sm:space-y-3.5 md:space-y-6 bg-white/95 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none p-3.5 sm:p-5 md:p-0 rounded-2xl md:rounded-none border border-slate-200/90 md:border-none shadow-xl md:shadow-none mx-auto md:mx-0">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <p className="text-[9px] sm:text-[10px] md:text-[11px] font-mono tracking-[0.2em] uppercase text-indigo-600 font-semibold">
                  PART 03 · WEARABILITY &amp; SENSORY
                </p>
              </div>

              <h3 className="text-base sm:text-2xl md:text-4xl lg:text-5xl font-light text-slate-900 tracking-tight leading-tight">
                Modular Socket &amp; <br className="hidden sm:inline" />
                <span className="font-sans font-normal">Haptic Slip Sensing</span>
              </h3>

              <p className="text-[11px] sm:text-xs md:text-base text-slate-600 leading-snug md:leading-relaxed max-w-lg">
                Breathable universal socket with micro-adjustment dials. Fingertip piezo sensors detect micro-slip in real-time.
              </p>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-0.5 md:pt-2">
                <div className="bg-slate-50/90 border border-slate-200/80 rounded-lg md:rounded-xl p-2 sm:p-3 md:p-4 shadow-xs">
                  <div className="flex items-center gap-1 text-indigo-600 mb-0.5">
                    <ShieldCheck size={13} className="md:w-4 md:h-4" />
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-mono font-semibold">SOCKET</span>
                  </div>
                  <p className="text-sm sm:text-lg md:text-2xl font-sans font-semibold text-slate-900 leading-tight">Universal</p>
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 font-mono">Micro-adjustable</p>
                </div>

                <div className="bg-slate-50/90 border border-slate-200/80 rounded-lg md:rounded-xl p-2 sm:p-3 md:p-4 shadow-xs">
                  <div className="flex items-center gap-1 text-emerald-600 mb-0.5">
                    <Battery size={13} className="md:w-4 md:h-4" />
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-mono font-semibold">BATTERY</span>
                  </div>
                  <p className="text-sm sm:text-lg md:text-2xl font-sans font-semibold text-slate-900 leading-tight">18+ Hours</p>
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 font-mono">Full-day clinical life</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 border-t border-slate-200/60 pt-2 md:pt-5">
                <span className="font-mono text-indigo-600 font-semibold text-[9px] sm:text-[10px] md:text-xs shrink-0">FEEDBACK:</span>
                <span className="text-[9px] sm:text-[10px] md:text-xs leading-snug">Tactile vibromotors relay touch pressure directly to residual limb.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

