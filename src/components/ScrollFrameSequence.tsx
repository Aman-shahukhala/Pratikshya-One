import { useEffect, useRef, useState } from 'react';

interface ScrollFrameSequenceProps {
  frameCount?: number;
  getFrameUrl?: (index: number) => string;
  className?: string;
}

// Continuous smooth cubic easing between keypoints
function getContinuousTargetX(progress: number): number {
  // Keyframe checkpoints:
  // p = 0.00 -> 0.65 (Hero - right)
  // p = 0.33 -> 0.28 (Stage 1 Neural EMG - left)
  // p = 0.66 -> 0.70 (Stage 2 14-DoF Actuation - right)
  // p = 1.00 -> 0.30 (Stage 3 Modular Socket - left)
  if (progress <= 0.333) {
    const t = progress / 0.333;
    const ease = t * t * (3 - 2 * t);
    return 0.65 + (0.28 - 0.65) * ease;
  } else if (progress <= 0.666) {
    const t = (progress - 0.333) / 0.333;
    const ease = t * t * (3 - 2 * t);
    return 0.28 + (0.70 - 0.28) * ease;
  } else {
    const t = Math.min((progress - 0.666) / 0.334, 1);
    const ease = t * t * (3 - 2 * t);
    return 0.70 + (0.30 - 0.70) * ease;
  }
}

export default function ScrollFrameSequence({
  frameCount = 120,
  getFrameUrl = (index) => `/frames/frame_${String(index).padStart(4, '0')}.jpg`,
  className = 'fixed inset-0 pointer-events-none z-10',
}: ScrollFrameSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastDrawnImgRef = useRef<HTMLImageElement | null>(null);
  const [firstLoaded, setFirstLoaded] = useState(false);

  // Pre-load and pre-decode all 120 frames into memory
  useEffect(() => {
    let mounted = true;
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);

      if (typeof img.decode === 'function') {
        img.decode()
          .then(() => {
            if (!mounted) return;
            loadedCount++;
            if (loadedCount >= 1 && !firstLoaded) setFirstLoaded(true);
          })
          .catch(() => {
            img.onload = () => {
              if (!mounted) return;
              loadedCount++;
              if (loadedCount >= 1 && !firstLoaded) setFirstLoaded(true);
            };
          });
      } else {
        (img as HTMLImageElement).onload = () => {
          if (!mounted) return;
          loadedCount++;
          if (loadedCount >= 1 && !firstLoaded) setFirstLoaded(true);
        };
      }

      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      mounted = false;
    };
  }, [frameCount, getFrameUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let rafId: number;
    let currentFraction = 0;
    let targetFraction = 0;
    let currentXPercent = 0.65;
    let currentOpacity = 1;
    let targetOpacity = 1;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
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

    const render = () => {
      rafId = requestAnimationFrame(render);

      // Smooth continuous damping
      currentFraction += (targetFraction - currentFraction) * 0.14;
      const targetXPercent = getContinuousTargetX(currentFraction);
      currentXPercent += (targetXPercent - currentXPercent) * 0.14;
      currentOpacity += (targetOpacity - currentOpacity) * 0.14;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (currentOpacity < 0.01) return;

      const images = imagesRef.current;
      if (images.length > 0) {
        const frameIndex = Math.min(
          images.length - 1,
          Math.max(0, Math.floor(currentFraction * (images.length - 1)))
        );

        let activeImg = images[frameIndex];
        if (!activeImg || !activeImg.complete || activeImg.naturalWidth === 0) {
          activeImg = lastDrawnImgRef.current || images[0];
        } else {
          lastDrawnImgRef.current = activeImg;
        }

        if (activeImg && activeImg.complete && activeImg.naturalWidth > 0) {
          const imgWidth = activeImg.naturalWidth;
          const imgHeight = activeImg.naturalHeight;
          const imgAspect = imgWidth / imgHeight;
          const winAspect = window.innerWidth / window.innerHeight;

          let drawWidth: number;
          let drawHeight: number;

          const isMobile = window.innerWidth < 768;
          const scaleMultiplier = isMobile ? 0.75 : 0.88;

          if (winAspect > imgAspect) {
            drawHeight = window.innerHeight * scaleMultiplier;
            drawWidth = drawHeight * imgAspect;
          } else {
            drawWidth = window.innerWidth * scaleMultiplier;
            drawHeight = drawWidth / imgAspect;
          }

          const activeXRatio = isMobile ? 0.5 : currentXPercent;
          const drawX = window.innerWidth * activeXRatio - drawWidth / 2;
          const drawY = (window.innerHeight - drawHeight) / 2 + (isMobile ? 0 : 20);

          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(currentOpacity, 1));
          ctx.drawImage(activeImg, drawX, drawY, drawWidth, drawHeight);
          ctx.restore();
        }
      }
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [firstLoaded]);

  return (
    <div className={className} aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ mixBlendMode: 'multiply' }}
      />
    </div>
  );
}
