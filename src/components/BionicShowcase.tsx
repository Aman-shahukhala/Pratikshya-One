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
      const winH = window.innerHeight;
      // 400vh total height, 3 transitions across 3 * winH
      // fraction: 0.0 = Hero, 1.0 = Neural EMG, 2.0 = Kinematics, 3.0 = Socket/Haptics
      targetFraction = Math.max(0, Math.min(scrollY / winH, 3));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const render = () => {
      rafId = requestAnimationFrame(render);

      // Smooth continuous damping matching the 3D model's 0.14 lerp factor
      currentFraction += (targetFraction - currentFraction) * 0.14;

      const winW = window.innerWidth;
      const slideDist = Math.min(winW * 0.55, 520);

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
        const exitT = Math.min(Math.max(currentFraction - 1.0, 0), 1);
        const exitEase = exitT * exitT * (3 - 2 * exitT);
        neuralSlideX = exitEase * (slideDist * 0.5);
        neuralOpacity = Math.max(0, 1 - exitEase * 1.35);
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
      } else {
        const exitT = Math.min(Math.max(currentFraction - 2.0, 0), 1);
        const exitEase = exitT * exitT * (3 - 2 * exitT);
        artSlideX = -exitEase * (slideDist * 0.5);
        artOpacity = Math.max(0, 1 - exitEase * 1.35);
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
      } else {
        const enterT = Math.min(Math.max(currentFraction - 2.0, 0), 1);
        const enterEase = enterT * enterT * (3 - 2 * enterT);
        socketSlideX = (1 - enterEase) * slideDist;
        socketOpacity = Math.min(1, enterEase * 1.35);
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
    <div id="bionic-showcase" className="relative h-[400vh]">
      {/* Absolute anchor checkpoints for usePointToPointScroll and anchor navigation */}
      <div id="hero" className="absolute top-0 h-screen w-full pointer-events-none" />
      <div id="neural-emg" className="absolute top-[100vh] h-screen w-full pointer-events-none" />
      <div id="articulation" className="absolute top-[200vh] h-screen w-full pointer-events-none" />
      <div id="socket-haptics" className="absolute top-[300vh] h-screen w-full pointer-events-none" />

      {/* =========================================================================
          STICKY PRESENTATION VIEWPORT: Locked to screen, 0px vertical movement
      ========================================================================= */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* =========================================================================
            STAGE 0: HERO OVERVIEW (3D Arm: Right ~65%, Content on Left)
        ========================================================================= */}
        <div
          ref={heroLayerRef}
          className="absolute inset-0 flex items-center justify-start pointer-events-auto will-change-transform"
        >
          <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full pt-20 pb-12">
            <div className="max-w-xl">
              {/* Index tag — JetBrains Mono */}
              <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-slate-400 mb-10">
                00 &mdash; Neuroprosthetics
              </p>

              {/* Display headline */}
              <h1
                className="font-sans leading-[0.9] mb-8 text-slate-900"
                style={{ fontSize: 'clamp(3.5rem, 8.5vw, 8rem)' }}
              >
                <span className="font-light block">Restoring</span>
                <span className="font-bold block">Human</span>
                <span className="font-light block">Motion.</span>
              </h1>

              {/* Divider */}
              <div className="w-8 h-[1px] bg-slate-200 mb-8" />

              {/* Body */}
              <p className="text-[15px] text-slate-500 leading-[1.75] max-w-sm mb-10 font-normal">
                Neural-linked bionic prosthetics.<br />
                Built in Kathmandu. Built for life.
              </p>

              {/* Scroll cue */}
              <a
                href="#neural-emg"
                className="inline-flex items-center gap-3 text-[10px] font-mono tracking-[0.25em] uppercase text-slate-400 hover:text-slate-900 transition-colors duration-200"
              >
                <span className="w-5 h-[1px] bg-current" />
                Inspect anatomy
              </a>
            </div>
          </div>
        </div>

        {/* =========================================================================
            STAGE 1: NEURAL EMG INTERFACE (3D Arm: Left ~28%, Content on Right - UNBOXED)
        ========================================================================= */}
        <div
          ref={neuralLayerRef}
          className="absolute inset-0 flex items-center justify-end pointer-events-auto will-change-transform"
          style={{ opacity: 0, visibility: 'hidden' }}
        >
          <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full py-16 sm:py-20 flex justify-end">
            <div className="w-full lg:w-[500px] xl:w-[540px] space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-emerald-600 font-semibold">
                  PART 01 · NEURAL CONTROL
                </p>
              </div>

              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 tracking-tight leading-tight">
                Multichannel <br />
                <span className="font-sans font-normal">Surface EMG Matrix</span>
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                Conformal dry-contact electrode arrays map subtle electrical impulses
                from residual forearm muscles. An on-device edge neural processor decodes
                intended motion in under 50 milliseconds.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center gap-2 text-emerald-600 mb-1">
                    <Brain size={16} />
                    <span className="text-xs font-mono font-semibold">LATENCY</span>
                  </div>
                  <p className="text-2xl font-sans text-slate-900">&lt; 50 ms</p>
                  <p className="text-[10px] text-slate-500 font-mono">Real-time inference</p>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <Activity size={16} />
                    <span className="text-xs font-mono font-semibold">CHANNELS</span>
                  </div>
                  <p className="text-2xl font-sans text-slate-900">16-Ch Matrix</p>
                  <p className="text-[10px] text-slate-500 font-mono">High-density array</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 border-t border-slate-200/60 pt-5">
                <Sparkles size={14} className="text-amber-500 shrink-0" />
                <span>Adaptive neural AI calibrates daily to muscle fatigue &amp; perspiration.</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            STAGE 2: 14-DoF MICRO-ACTUATORS (3D Arm: Right ~70%, Content on Left - UNBOXED)
        ========================================================================= */}
        <div
          ref={artLayerRef}
          className="absolute inset-0 flex items-center justify-start pointer-events-auto will-change-transform"
          style={{ opacity: 0, visibility: 'hidden' }}
        >
          <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full py-16 sm:py-20 flex justify-start">
            <div className="w-full lg:w-[500px] xl:w-[540px] space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-blue-600 font-semibold">
                  PART 02 · KINEMATICS &amp; GRIP
                </p>
              </div>

              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 tracking-tight leading-tight">
                14 Degrees of Freedom <br />
                <span className="font-sans font-normal">Micro-Actuators</span>
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                Individually motorized brushless DC coreless micromotors in every digit joint.
                Features compliant tendons that dynamically self-conform around organic shapes
                such as eggs, tools, door handles, and keys.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <Cpu size={16} />
                    <span className="text-xs font-mono font-semibold">MOTORS</span>
                  </div>
                  <p className="text-2xl font-sans text-slate-900">14 Active DoF</p>
                  <p className="text-[10px] text-slate-500 font-mono">Independent digits</p>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center gap-2 text-emerald-600 mb-1">
                    <ShieldCheck size={16} />
                    <span className="text-xs font-mono font-semibold">WEIGHT</span>
                  </div>
                  <p className="text-2xl font-sans text-slate-900">480 grams</p>
                  <p className="text-[10px] text-slate-500 font-mono">30% lighter than avg</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 border-t border-slate-200/60 pt-5">
                <span className="font-mono text-blue-600 font-semibold">GRIP MODES:</span>
                <span>Tripod, Precision Pinch, Power Cylinder, Lateral Key, Open Palm.</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            STAGE 3: MODULAR SOCKET & HAPTICS (3D Arm: Left ~30%, Content on Right - UNBOXED)
        ========================================================================= */}
        <div
          ref={socketLayerRef}
          className="absolute inset-0 flex items-center justify-end pointer-events-auto will-change-transform"
          style={{ opacity: 0, visibility: 'hidden' }}
        >
          <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full py-16 sm:py-20 flex justify-end">
            <div className="w-full lg:w-[500px] xl:w-[540px] space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-indigo-600 font-semibold">
                  PART 03 · WEARABILITY &amp; SENSORY
                </p>
              </div>

              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 tracking-tight leading-tight">
                Modular Socket &amp; <br />
                <span className="font-sans font-normal">Haptic Slip Sensing</span>
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                Breathable universal socket with multi-point micro-adjustment dials that
                accommodates daily residual limb volume changes without discomfort.
                Fingertip piezo-resistive sensors detect micro-slip in real-time.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center gap-2 text-indigo-600 mb-1">
                    <ShieldCheck size={16} />
                    <span className="text-xs font-mono font-semibold">SOCKET</span>
                  </div>
                  <p className="text-2xl font-sans text-slate-900">Universal</p>
                  <p className="text-[10px] text-slate-500 font-mono">Micro-adjustable</p>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center gap-2 text-emerald-600 mb-1">
                    <Battery size={16} />
                    <span className="text-xs font-mono font-semibold">BATTERY</span>
                  </div>
                  <p className="text-2xl font-sans text-slate-900">18+ Hours</p>
                  <p className="text-[10px] text-slate-500 font-mono">Full-day clinical life</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 border-t border-slate-200/60 pt-5">
                <span className="font-mono text-indigo-600 font-semibold">FEEDBACK:</span>
                <span>Tactile vibromotors relay touch pressure directly to the residual limb.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

