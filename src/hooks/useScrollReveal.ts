import { useEffect, useRef, useState } from 'react';

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: { threshold?: number; rootMargin?: string }
) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check immediately on mount if element is already within viewport
    const checkVisibility = () => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight + 100 && rect.bottom > -100;
      if (inView) {
        setVisible(true);
        return true;
      }
      return false;
    };

    if (checkVisibility()) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: options?.threshold ?? 0.01,
        rootMargin: options?.rootMargin ?? '50px 0px 50px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.threshold, options?.rootMargin]);

  return { ref, visible };
}

export function useParallax<T extends HTMLElement = HTMLElement>(speed = 0.2) {
  const ref = useRef<T>(null);
  const offset = useRef(0);

  useEffect(() => {
    let rafId = 0;

    const handleScroll = () => {
      const el = ref.current;
      if (!el) return;

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        // Check if element is anywhere near viewport
        if (rect.top < windowHeight + 100 && rect.bottom > -100) {
          // Subtract current offset to measure untransformed layout position
          const untransformedTop = rect.top - offset.current;
          const center = untransformedTop + rect.height / 2;
          const distance = center - windowHeight / 2;
          const targetOffset = Math.round(distance * speed * -1 * 10) / 10;
          offset.current = targetOffset;
          el.style.transform = `translate3d(0, ${targetOffset}px, 0)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [speed]);

  return ref;
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId = 0;

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(scrollHeight > 0 ? window.scrollY / scrollHeight : 0);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return progress;
}

export function useCountUp(target: number, duration = 2000, start = false) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;

    let rafId = 0;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setValue(target);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, start]);

  return value;
}
