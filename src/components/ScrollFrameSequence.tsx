import { useEffect, useRef, useState } from 'react';

interface ScrollFrameSequenceProps {
  frameCount?: number;
  getFrameUrl?: (index: number) => string;
  className?: string;
}

const FADE_CUTOFF_PROG = 0.20 / 3.0; // 0.066667

// Continuous smooth cubic easing between keypoints
function getContinuousTargetX(progress: number): number {
  // Keyframe checkpoints:
  // p = 0.000 -> 0.0667: Halo fades out in place. Arm holds firmly at 0.65.
  // p = 0.0667 -> 0.3333: Arm slides from 0.65 -> 0.28 in 100% sync with text.
  // p = 0.3333 -> 0.6667: Arm slides from 0.28 -> 0.70 (Stage 2 Kinematics).
  // p = 0.6667 -> 1.0000: Arm slides from 0.70 -> 0.30 (Stage 3 Modular Socket).
  if (progress <= 0.333333) {
    if (progress <= FADE_CUTOFF_PROG) {
      return 0.65;
    }
    const t = (progress - FADE_CUTOFF_PROG) / (0.333333 - FADE_CUTOFF_PROG);
    const ease = t * t * (3 - 2 * t);
    return 0.65 + (0.28 - 0.65) * ease;
  } else if (progress <= 0.666667) {
    const t = (progress - 0.333333) / 0.333334;
    const ease = t * t * (3 - 2 * t);
    return 0.28 + (0.70 - 0.28) * ease;
  } else {
    const t = Math.min((progress - 0.666667) / 0.333333, 1);
    const ease = t * t * (3 - 2 * t);
    return 0.70 + (0.30 - 0.70) * ease;
  }
}

const defaultGetFrameUrl = (index: number) =>
  `${import.meta.env.BASE_URL}frames/frame_${String(index).padStart(4, '0')}.webp`;

export default function ScrollFrameSequence({
  frameCount = 120,
  getFrameUrl = defaultGetFrameUrl,
  className = 'fixed inset-0 pointer-events-none z-10',
}: ScrollFrameSequenceProps) {
  const haloCanvasRef = useRef<HTMLCanvasElement>(null);
  const armCanvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedFlagsRef = useRef<boolean[]>([]);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const getFrameUrlRef = useRef(getFrameUrl);
  getFrameUrlRef.current = getFrameUrl;

  // Progressive preloader: Phase 1 (Frame 1), Phase 2 (Keyframes across 0..119), Phase 3 (Remaining frames)
  useEffect(() => {
    let mounted = true;
    const images: HTMLImageElement[] = [];
    const loadedFlags: boolean[] = new Array(frameCount).fill(false);

    imagesRef.current = images;
    loadedFlagsRef.current = loadedFlags;

    const loadSingleFrame = (idxZero: number, priorityHigh = false): Promise<void> => {
      return new Promise((resolve) => {
        if (!mounted) {
          resolve();
          return;
        }

        const img = new Image();
        if (priorityHigh && 'fetchPriority' in img) {
          (img as unknown as { fetchPriority?: string }).fetchPriority = 'high';
        }

        const onFinish = () => {
          if (!mounted) return;
          loadedFlags[idxZero] = true;
          if (idxZero === 0 && !firstLoaded) {
            setFirstLoaded(true);
          }
          resolve();
        };

        img.onload = () => {
          if (typeof img.decode === 'function') {
            img.decode().then(onFinish).catch(onFinish);
          } else {
            onFinish();
          }
        };
        img.onerror = () => {
          resolve();
        };

        img.src = getFrameUrlRef.current(idxZero + 1);
        images[idxZero] = img;
      });
    };

    // Allocate all image slots
    for (let i = 0; i < frameCount; i++) {
      images[i] = new Image();
    }

    // Step 1: Load 1st frame immediately for instantaneous display
    loadSingleFrame(0, true).then(() => {
      if (!mounted) return;

      // Step 2: Load keyframe samples every 5 frames across the timeline for fast initial rotation responsiveness
      const keyframes: number[] = [];
      for (let i = 4; i < frameCount; i += 5) {
        keyframes.push(i);
      }
      if (keyframes[keyframes.length - 1] !== frameCount - 1) {
        keyframes.push(frameCount - 1);
      }

      Promise.all(keyframes.map((idx) => loadSingleFrame(idx, true))).then(() => {
        if (!mounted) return;

        // Step 3: Load all remaining frames in chunks
        const remaining: number[] = [];
        for (let i = 1; i < frameCount; i++) {
          if (!loadedFlags[i]) {
            remaining.push(i);
          }
        }

        const BATCH_SIZE = 8;
        let p = Promise.resolve();
        for (let i = 0; i < remaining.length; i += BATCH_SIZE) {
          const batch = remaining.slice(i, i + BATCH_SIZE);
          p = p.then(() => {
            if (!mounted) return;
            return Promise.all(batch.map((idx) => loadSingleFrame(idx, false))).then(() => {});
          });
        }
      });
    });

    return () => {
      mounted = false;
    };
  }, [frameCount]);

  useEffect(() => {
    const haloCanvas = haloCanvasRef.current;
    const armCanvas = armCanvasRef.current;
    if (!haloCanvas || !armCanvas) return;

    const haloCtx = haloCanvas.getContext('2d');
    const armCtx = armCanvas.getContext('2d', { alpha: true });
    if (!haloCtx || !armCtx) return;

    let rafId: number;
    let currentFraction = 0;
    let targetFraction = 0;
    let currentOpacity = 1;
    let targetOpacity = 1;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      haloCanvas.width = w * dpr;
      haloCanvas.height = h * dpr;
      haloCanvas.style.width = `${w}px`;
      haloCanvas.style.height = `${h}px`;
      haloCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      armCanvas.width = w * dpr;
      armCanvas.height = h * dpr;
      armCanvas.style.width = `${w}px`;
      armCanvas.style.height = `${h}px`;
      armCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      armCtx.imageSmoothingEnabled = true;
      armCtx.imageSmoothingQuality = 'high';
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const onScroll = () => {
      const showcaseEl = document.getElementById('bionic-showcase');
      if (!showcaseEl) {
        targetFraction = 0;
        targetOpacity = 1;
        return;
      }

      const rect = showcaseEl.getBoundingClientRect();
      const scrollY = window.scrollY;
      const showcaseTop = showcaseEl.offsetTop;
      const showcaseHeight = showcaseEl.offsetHeight - window.innerHeight;

      if (showcaseHeight <= 0) {
        targetFraction = 0;
        targetOpacity = 1;
        return;
      }

      // Smooth relative progression (0.0 to 1.0)
      const relativeScroll = scrollY - showcaseTop;
      const rawProgress = Math.max(0, Math.min(relativeScroll / showcaseHeight, 1));
      targetFraction = rawProgress;

      // Opacity handling
      if (rect.bottom <= 0) {
        targetOpacity = 0;
      } else if (rect.bottom < window.innerHeight * 0.75) {
        targetOpacity = Math.max(0, rect.bottom / (window.innerHeight * 0.75));
      } else {
        targetOpacity = 1;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Helper: Find closest fully loaded frame without jumping or stalling
    const getBestAvailableImage = (targetIndex: number): HTMLImageElement | null => {
      const images = imagesRef.current;
      const loadedFlags = loadedFlagsRef.current;
      if (!images || images.length === 0) return null;

      if (loadedFlags[targetIndex] && images[targetIndex]?.complete && images[targetIndex].naturalWidth > 0) {
        return images[targetIndex];
      }

      // Search outward for closest loaded neighbor
      for (let offset = 1; offset < frameCount; offset++) {
        const prev = targetIndex - offset;
        if (prev >= 0 && loadedFlags[prev] && images[prev]?.complete && images[prev].naturalWidth > 0) {
          return images[prev];
        }
        const next = targetIndex + offset;
        if (next < frameCount && loadedFlags[next] && images[next]?.complete && images[next].naturalWidth > 0) {
          return images[next];
        }
      }

      return images[0]?.complete && images[0].naturalWidth > 0 ? images[0] : null;
    };

    const render = () => {
      rafId = requestAnimationFrame(render);

      // Smooth continuous damping (synchronized with text transitions)
      currentFraction += (targetFraction - currentFraction) * 0.14;
      const currentXPercent = getContinuousTargetX(currentFraction);
      currentOpacity += (targetOpacity - currentOpacity) * 0.14;

      const w = window.innerWidth;
      const h = window.innerHeight;

      haloCtx.clearRect(0, 0, w, h);
      armCtx.clearRect(0, 0, w, h);

      if (currentOpacity < 0.01) return;

      const totalFrames = frameCount;
      let targetIndex = 0;
      if (currentFraction <= FADE_CUTOFF_PROG) {
        targetIndex = 0; // Arm holds locked at Frame 0 while Halo fades
      } else {
        const moveProg = (currentFraction - FADE_CUTOFF_PROG) / (1.0 - FADE_CUTOFF_PROG);
        targetIndex = Math.min(
          totalFrames - 1,
          Math.max(0, Math.round(moveProg * (totalFrames - 1)))
        );
      }

      const activeImg = getBestAvailableImage(targetIndex);

      if (activeImg && activeImg.naturalWidth > 0) {
        const imgWidth = activeImg.naturalWidth;
        const imgHeight = activeImg.naturalHeight;
        const imgAspect = imgWidth / imgHeight;
        const winAspect = w / h;

        let drawWidth: number;
        let drawHeight: number;

        const isMobile = w < 768;
        const isTablet = w >= 768 && w < 1024;

        if (isMobile) {
          // On mobile portrait: Frame aspect is 16:9. Scale up prominently by viewport height
          drawHeight = Math.round(Math.min(h * 0.46, 430));
          drawWidth = Math.round(drawHeight * imgAspect);
          if (drawHeight < 280 && h >= 480) {
            drawHeight = 280;
            drawWidth = Math.round(drawHeight * imgAspect);
          }
        } else {
          const scaleMultiplier = isTablet ? 0.75 : 0.88;
          if (winAspect > imgAspect) {
            drawHeight = Math.round(h * scaleMultiplier);
            drawWidth = Math.round(drawHeight * imgAspect);
          } else {
            drawWidth = Math.round(w * scaleMultiplier);
            drawHeight = Math.round(drawWidth / imgAspect);
          }
        }

        const activeXRatio = isMobile ? 0.5 : isTablet ? (currentXPercent > 0.5 ? 0.65 : 0.35) : currentXPercent;
        const drawX = Math.round(w * activeXRatio - drawWidth / 2);
        const drawY = isMobile
          ? Math.round(h * 0.13 + 12)
          : Math.round((h - drawHeight) / 2 + 20);

        // 1. Draw Halo Backdrop directly on haloCanvas (Hero stage)
        // Halo fades out completely from 0.0 -> FADE_CUTOFF_PROG while text & arm hold still
        const haloProgress = Math.min(Math.max(currentFraction / FADE_CUTOFF_PROG, 0), 1);
        const haloOpacity = Math.max(0, 1 - haloProgress) * currentOpacity;

        if (haloOpacity > 0.01) {
          const heroXRatio = isMobile ? 0.5 : isTablet ? 0.62 : 0.67;
          const haloCenterX = Math.round(w * heroXRatio);
          const haloCenterY = Math.round(drawY + drawHeight * 0.48);
          const haloRadius = Math.round(drawHeight * 0.4031);

          haloCtx.save();
          haloCtx.globalAlpha = haloOpacity;
          haloCtx.beginPath();
          haloCtx.arc(haloCenterX, haloCenterY, haloRadius, 0, Math.PI * 2);
          haloCtx.strokeStyle = '#cbd5e1';
          haloCtx.lineWidth = Math.max(14, Math.round(drawHeight * 0.03));
          haloCtx.stroke();
          haloCtx.restore();
        }

        // 2. Draw 3D Arm on armCanvas (solid single frame, 100% opaque, zero flickering)
        armCtx.save();
        armCtx.globalAlpha = Math.max(0, Math.min(currentOpacity, 1));
        armCtx.drawImage(activeImg, drawX, drawY, drawWidth, drawHeight);
        armCtx.restore();
      }
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [frameCount, firstLoaded]);

  return (
    <div className={className} aria-hidden="true">
      {/* Background layer for Halo ring */}
      <canvas
        ref={haloCanvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
      />
      {/* Foreground layer for 3D Arm with GPU multiply blend mode */}
      <canvas
        ref={armCanvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
        style={{ mixBlendMode: 'multiply' }}
      />
    </div>
  );
}
