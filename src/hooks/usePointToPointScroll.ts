import { useEffect, useRef } from 'react';

interface SectionInfo {
  id: string;
  top: number;
  bottom: number;
  height: number;
  isTall: boolean;
  el: HTMLElement;
}

const NAV_OFFSET = 64; // Height of fixed navbar
const SHOWCASE_IDS = new Set(['hero', 'neural-emg', 'articulation', 'socket-haptics']);

export function usePointToPointScroll(sectionIds: string[], enabled = true) {
  const isScrollingRef = useRef(false);
  const cooldownUntilRef = useRef(0);
  const rafIdRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    // On touch / mobile devices, preserve 100% native momentum scrolling
    const isTouchDevice =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);

    if (isTouchDevice) {
      return;
    }

    const getSectionInfos = (): SectionInfo[] => {
      const scrollY = window.scrollY;
      return sectionIds
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          const top = Math.round(rect.top + scrollY);
          const height = el.offsetHeight;
          const bottom = top + height;
          // Sections taller than viewport + margin are considered tall content sections
          const isTall = height > window.innerHeight + 60;
          return { id, top, bottom, height, isTall, el };
        })
        .filter(Boolean) as SectionInfo[];
    };

    const getCurrentSectionIndex = (sections: SectionInfo[]): number => {
      const scrollY = window.scrollY;

      // In the showcase region (0 to 3.2 * window.innerHeight), index cleanly aligns with viewport multiples
      if (scrollY <= window.innerHeight * 3.2) {
        return Math.max(0, Math.min(Math.round(scrollY / window.innerHeight), 3));
      }

      const viewportCenter = scrollY + window.innerHeight / 2;

      for (let i = 0; i < sections.length; i++) {
        const s = sections[i];
        if (viewportCenter >= s.top && viewportCenter <= s.bottom) {
          return i;
        }
      }

      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollY >= sections[i].top - 100) {
          return i;
        }
      }
      return 0;
    };

    const smoothScrollTo = (targetY: number, duration = 850) => {
      const startY = window.scrollY;
      const diff = targetY - startY;
      if (Math.abs(diff) < 3) {
        isScrollingRef.current = false;
        return;
      }

      isScrollingRef.current = true;
      cancelAnimationFrame(rafIdRef.current);

      const startTime = performance.now();
      // Smooth Apple-style ease-in-out cubic
      const easeInOutCubic = (x: number): number =>
        x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);

        window.scrollTo(0, Math.round(startY + diff * eased));

        if (progress < 1) {
          rafIdRef.current = requestAnimationFrame(animate);
        } else {
          window.scrollTo(0, targetY);
          isScrollingRef.current = false;
          // Cooldown to absorb residual trackpad inertia ticks
          cooldownUntilRef.current = Date.now() + 240;
        }
      };

      rafIdRef.current = requestAnimationFrame(animate);
    };

    const scrollToSection = (index: number, position: 'top' | 'bottom' = 'top') => {
      const sections = getSectionInfos();
      if (index < 0 || index >= sections.length) return;

      const target = sections[index];
      if (!target) return;

      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

      let targetY: number;
      if (position === 'bottom') {
        targetY = target.bottom - window.innerHeight;
      } else if (SHOWCASE_IDS.has(target.id)) {
        // Showcase slides (hero, neural-emg, articulation, socket-haptics) lock at exact full viewport multiples (0px offset)
        targetY = target.top;
      } else {
        targetY = index === 0 ? 0 : target.top - NAV_OFFSET;
      }

      targetY = Math.max(0, Math.min(targetY, maxScroll));
      smoothScrollTo(targetY);
    };

    const handleWheel = (e: WheelEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      // While programmatic animation is running, prevent conflicting wheel events
      if (isScrollingRef.current) {
        e.preventDefault();
        return;
      }

      // Ignore low-velocity residual events during landing cooldown
      if (Date.now() < cooldownUntilRef.current) {
        if (Math.abs(e.deltaY) < 40) {
          e.preventDefault();
          return;
        }
      }

      const sections = getSectionInfos();
      if (sections.length === 0) return;

      const currentIdx = getCurrentSectionIndex(sections);
      const currentSection = sections[currentIdx];
      const scrollY = window.scrollY;
      const viewportBottom = scrollY + window.innerHeight;

      // 1. Hard-lock snapping for Showcase sections (0: Hero, 1: Part 01, 2: Part 02, 3: Part 03) and transition to Mission (4)
      if (currentIdx <= 3) {
        if (Math.abs(e.deltaY) < 14) return;
        e.preventDefault();
        if (e.deltaY > 0) {
          // Hard lock to next checkpoint (0->1, 1->2, 2->3, 3->4 Mission)
          scrollToSection(currentIdx + 1, 'top');
        } else if (currentIdx > 0) {
          // Hard lock to previous checkpoint (3->2, 2->1, 1->0 Hero)
          scrollToSection(currentIdx - 1, 'top');
        }
        return;
      }

      // 2. Hard-lock transition from Mission (4) back up into Part 03 (3)
      if (currentIdx === 4 && e.deltaY < -14 && scrollY <= currentSection.top - NAV_OFFSET + 30) {
        e.preventDefault();
        scrollToSection(3, 'top');
        return;
      }

      // 3. Handle downstream tall content sections (e.g. Health, Technology, Investors)
      if (currentSection.isTall) {
        const isAtTop = scrollY <= currentSection.top - NAV_OFFSET + 20;
        const isAtBottom = viewportBottom >= currentSection.bottom - 20;

        if (e.deltaY > 0) {
          if (!isAtBottom) return;
          if (Math.abs(e.deltaY) < 20) return;
          if (currentIdx < sections.length - 1) {
            e.preventDefault();
            scrollToSection(currentIdx + 1, 'top');
          }
        } else if (e.deltaY < 0) {
          if (!isAtTop) return;
          if (Math.abs(e.deltaY) < 20) return;
          if (currentIdx > 0) {
            e.preventDefault();
            const prevSection = sections[currentIdx - 1];
            scrollToSection(currentIdx - 1, prevSection.isTall ? 'bottom' : 'top');
          }
        }
        return;
      }

      // 4. Handle other downstream slide sections
      if (Math.abs(e.deltaY) < 18) return;

      if (e.deltaY > 0) {
        if (currentIdx < sections.length - 1) {
          e.preventDefault();
          scrollToSection(currentIdx + 1, 'top');
        }
      } else if (e.deltaY < 0) {
        if (currentIdx > 0) {
          e.preventDefault();
          const prevSection = sections[currentIdx - 1];
          scrollToSection(currentIdx - 1, prevSection.isTall ? 'bottom' : 'top');
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      const sections = getSectionInfos();
      if (sections.length === 0) return;
      const currentIdx = getCurrentSectionIndex(sections);

      if (['PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        scrollToSection(currentIdx + 1, 'top');
      } else if (['PageUp'].includes(e.key)) {
        e.preventDefault();
        scrollToSection(currentIdx - 1, 'top');
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToSection(0, 'top');
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollToSection(sections.length - 1, 'top');
      }
    };

    // Auto-settle timer on scroll stop to guarantee no in-between states
    let settleTimer: number;
    const handleScrollSettle = () => {
      clearTimeout(settleTimer);
      if (isScrollingRef.current) return;
      settleTimer = window.setTimeout(() => {
        const scrollY = window.scrollY;
        if (scrollY <= window.innerHeight * 3.2 && !isScrollingRef.current) {
          const nearestSlide = Math.max(0, Math.min(Math.round(scrollY / window.innerHeight), 3));
          const targetY = nearestSlide * window.innerHeight;
          if (Math.abs(scrollY - targetY) > 8 && Math.abs(scrollY - targetY) < window.innerHeight * 0.48) {
            smoothScrollTo(targetY, 380);
          }
        }
      }, 140);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScrollSettle, { passive: true });

    return () => {
      clearTimeout(settleTimer);
      cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScrollSettle);
    };
  }, [sectionIds, enabled]);
}
