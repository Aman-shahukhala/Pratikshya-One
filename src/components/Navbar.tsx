import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'BIONIC ARM', href: '#health' },
  { label: 'TECHNOLOGY', href: '#technology' },
  { label: 'IMPACT', href: '#impact' },
  { label: 'STUDIO', href: '#team' },
  { label: 'INVESTORS', href: '#investors' },
  { label: 'CONTACT', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;
    const updateProgress = () => {
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? Math.min(Math.max(scrollY / scrollHeight, 0), 1) : 0;

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }
      setScrolled(scrollY > 20);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMenuOpen(false);
      };
      window.addEventListener('keydown', onKey);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', onKey);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen
            ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="#hero"
              onClick={() => setMenuOpen(false)}
              className="text-xs font-mono tracking-[0.2em] font-semibold text-slate-900 hover:text-black uppercase py-2"
            >
              PRATIKSHYA HEALTH
            </a>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[11px] font-mono tracking-[0.15em] text-slate-600 hover:text-slate-900 transition-colors duration-200 py-1"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Start a Clinical Inquiry Pill Button */}
            <div className="hidden md:block">
              <a
                href="#contact"
                className="text-[11px] font-mono tracking-[0.15em] uppercase px-5 py-2 rounded-full border border-slate-300 text-slate-900 hover:bg-slate-900 hover:text-white active:scale-95 transition-all duration-200"
              >
                CLINICAL INQUIRY
              </a>
            </div>

            {/* Mobile Toggle with 44px min touch target */}
            <button
              className="md:hidden text-slate-900 w-11 h-11 flex items-center justify-center -mr-2 rounded-lg active:bg-slate-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Continuous GPU-accelerated scroll progress bar */}
        <div className="h-[2px] w-full bg-slate-200/40 overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full w-full bg-slate-900 origin-left will-change-transform"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </nav>

      {/* Mobile menu modal */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-white/98 backdrop-blur-2xl pt-24 pb-12 px-6 flex flex-col justify-between overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex flex-col items-center gap-6 pt-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-xl sm:text-2xl font-mono tracking-wider text-slate-800 hover:text-slate-900 transition-colors py-2 px-4 rounded-lg active:bg-slate-100"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="text-xs font-mono tracking-widest uppercase px-8 py-3.5 rounded-full border border-slate-900 bg-slate-900 text-white mt-4 shadow-sm active:scale-95 transition-transform"
            >
              CLINICAL INQUIRY
            </a>
          </div>

          <div className="text-center pt-8 border-t border-slate-100">
            <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
              Kathmandu · Global Bionics
            </p>
          </div>
        </div>
      )}
    </>
  );
}
