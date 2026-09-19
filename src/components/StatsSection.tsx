import { useEffect } from 'react';
import Reveal from './Reveal';
import { useScrollReveal, useCountUp } from '@/hooks/useScrollReveal';

const stats = [
  { value: 14, suffix: '', label: 'Degrees of freedom', sub: 'in the Pratikshya One hand' },
  { value: 50, prefix: '<', suffix: 'ms', label: 'Neural latency', sub: 'EMG intent-to-motion response' },
  { value: 480, suffix: 'g', label: 'Prosthetic weight', sub: '30% lighter than category avg' },
  { value: 40, suffix: '%', label: 'Cost reduction', sub: 'below comparable bionic systems' },
];

const marketStats = [
  { value: 2.5, prefix: '~', suffix: 'M', label: 'Global upper-limb amputees', sub: 'WHO-linked clinical estimate' },
  { value: 100, prefix: '>', suffix: 'K', label: 'South Asia clinical need', sub: 'Amputees seeking affordable bionics' },
  { value: 85, suffix: '%', label: 'First-session grip success', sub: 'Empirical clinical trial benchmark' },
  { value: 32, prefix: '$', suffix: 'M', label: 'Series A capitalization', sub: 'Scaling clinical trials & global access' },
];

function StatCard({
  value,
  prefix = '',
  suffix = '',
  label,
  sub,
  delay = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sub: string;
  delay?: number;
}) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>({ threshold: 0.3 });
  const displayValue = useCountUp(value, 2000, visible);

  useEffect(() => {
    if (visible && ref.current) {
      ref.current.classList.add('visible');
    }
  }, [visible, ref]);

  return (
    <div
      ref={ref}
      className="reveal text-center bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div>
        <p className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight mb-2 sm:mb-3 counter text-slate-900 font-sans">
          <span>
            {prefix}
            {displayValue}
            {suffix}
          </span>
        </p>
        <p className="text-xs sm:text-sm font-semibold text-slate-800 mb-1">{label}</p>
      </div>
      <p className="text-[10px] sm:text-xs text-slate-500 mt-1">{sub}</p>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section id="impact" className="relative py-12 lg:py-16 overflow-hidden bg-slate-50/80 backdrop-blur-sm border-t border-slate-200/80 scroll-mt-20">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <Reveal>
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-slate-400 mb-3">
              04 &nbsp; BY THE NUMBERS
            </p>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-slate-900">
              Engineering that <span className="font-sans font-normal">matters.</span>
            </h2>
          </div>
        </Reveal>

        {/* Product stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-10 sm:mb-12">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} {...stat} delay={i * 120} />
          ))}
        </div>

        {/* Divider */}
        <Reveal>
          <div className="h-[1px] bg-slate-200 mb-10 sm:mb-12 max-w-4xl mx-auto" />
        </Reveal>

        {/* Market stats */}
        <Reveal>
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-slate-400 mb-3">
              CLINICAL IMPACT &amp; SCALE
            </p>
            <h3 className="text-xl sm:text-3xl font-light text-slate-900">
              Restoring Independence &amp; <span className="font-sans font-normal">Dexterity</span>
            </h3>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {marketStats.map((stat, i) => (
            <StatCard key={stat.label} {...stat} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  );
}
