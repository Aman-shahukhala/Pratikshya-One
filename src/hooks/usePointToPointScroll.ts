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

    const smoothScrollTo = (targetY: number, duration = 550) => {
      const startY = window.scrollY;
      const diff = targetY - startY;
      if (Math.abs(diff) < 3) {
        isScrollingRef.current = false;
        return;
      }

      isScrollingRef.current = true;
      cancelAnimationFrame(rafIdRef.current);

      const startTime = performance.now();
      // Silky quartic ease-out
      const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutQuart(progress);

        window.scrollTo(0, Math.round(startY + diff * eased));

        if (progress < 1) {
          rafIdRef.current = requestAnimationFrame(animate);
        } else {
          window.scrollTo(0, targetY);
          isScrollingRef.current = false;
          // Short cooldown to absorb residual trackpad inertia ticks
          cooldownUntilRef.current = Date.now() + 180;
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

      // Handle tall content sections (e.g. Health, Technology, Investors)
      if (currentSection.isTall) {
        const isAtTop = scrollY <= currentSection.top - NAV_OFFSET + 20;
        const isAtBottom = viewportBottom >= currentSection.bottom - 20;

        if (e.deltaY > 0) {
          // Scrolling down: if not at the bottom of the section, allow native scroll
          if (!isAtBottom) {
            return;
          }
          // At bottom and scrolling down deliberately -> snap to next section
          if (Math.abs(e.deltaY) < 20) return;
          if (currentIdx < sections.length - 1) {
            e.preventDefault();
            scrollToSection(currentIdx + 1, 'top');
          }
        } else if (e.deltaY < 0) {
          // Scrolling up: if not at the top of the section, allow native scroll
          if (!isAtTop) {
            return;
          }
          // At top and scrolling up deliberately -> snap to previous section
          if (Math.abs(e.deltaY) < 20) return;
          if (currentIdx > 0) {
            e.preventDefault();
            const prevSection = sections[currentIdx - 1];
            scrollToSection(currentIdx - 1, prevSection.isTall ? 'bottom' : 'top');
          }
        }
        return;
      }

      // Handle slide-like showcase sections (~100vh)
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

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sectionIds, enabled]);
}
