import { Mail, MapPin, ArrowUp } from 'lucide-react';
import Reveal from './Reveal';

const footerLinks = [
  {
    title: 'Clinical Solutions',
    links: [
      { label: 'Pratikshya One (14 DoF)', href: '#health' },
      { label: 'Adaptive Neural AI Grip', href: '#health' },
      { label: 'Modular Socket Architecture', href: '#health' },
      { label: 'Clinical Companion App', href: '#health' },
    ],
  },
  {
    title: 'Technology',
    links: [
      { label: 'Multichannel EMG Matrix', href: '#technology' },
      { label: 'Tactile Haptic Feedback', href: '#technology' },
      { label: 'Edge AI Firmware', href: '#technology' },
      { label: 'ISO 13485 & DDA Trials', href: '#technology' },
    ],
  },
  {
    title: 'Organization',
    links: [
      { label: 'Mission & Vision', href: '#mission' },
      { label: 'Clinical Impact', href: '#impact' },
      { label: 'Leadership & Studio', href: '#team' },
      { label: 'Series A Investors', href: '#investors' },
    ],
  },
];

export default function Footer() {
  return (
    <footer id="contact" className="relative border-t border-slate-200 bg-white overflow-hidden text-slate-900 scroll-mt-20">
      <div className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-12 sm:py-16">
        {/* CTA (SCFO Project Inquiry Style) */}
        <Reveal>
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-slate-400 mb-3">
              07 &nbsp; CLINICAL INQUIRY &amp; CONTACT
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-slate-900 mb-4">
              Ready to <span className="font-sans font-normal">restore motion?</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto mb-8 leading-relaxed">
              Whether you're an investor, a rehabilitation clinic director, or an orthotics partner —
              connect with our clinical engineering team.
            </p>
            <a
              href="mailto:clinical@pratikshyahealth.com"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-slate-900 text-white text-xs font-mono tracking-widest uppercase hover:bg-black transition-all duration-200 hover:scale-105 shadow-md"
            >
              <Mail size={15} />
              START A CLINICAL INQUIRY
            </a>
          </div>
        </Reveal>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 border-t border-slate-100 pt-12">
          {/* Brand */}
          <div>
            <p className="text-xs font-mono tracking-[0.2em] font-semibold text-slate-900 uppercase mb-4">
              PRATIKSHYA HEALTH
            </p>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Restoring Motion. Redefining Human Potential through adaptive bionic neuroprosthetics.
            </p>
            <div className="flex items-start gap-2 text-xs text-slate-500 font-mono">
              <MapPin size={13} className="mt-0.5 shrink-0 text-slate-400" />
              <span>Kathmandu, Nepal · 27.7172° N</span>
            </div>
          </div>

          {footerLinks.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] font-mono font-semibold text-slate-900 uppercase tracking-widest mb-5">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs text-slate-500 hover:text-slate-900 transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200 text-[11px] font-mono text-slate-400">
          <p>
            &copy; 2026 PRATIKSHYA HEALTH PVT. LTD. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <p className="text-slate-400">
              KATHMANDU · GLOBAL EXPORTS
            </p>
            <a
              href="#hero"
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors"
            >
              BACK TO TOP
              <ArrowUp size={12} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
