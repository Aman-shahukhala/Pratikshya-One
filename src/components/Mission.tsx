import { Activity, Brain, ShieldCheck } from 'lucide-react';
import Reveal from './Reveal';

export default function Mission() {
  return (
    <section id="mission" className="relative py-12 lg:py-16 overflow-hidden bg-slate-50/80 backdrop-blur-sm border-t border-slate-200/80 scroll-mt-20">
      <div className="relative max-w-5xl mx-auto px-6 sm:px-12 text-center">
        <Reveal>
          <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-slate-400 mb-3 font-semibold">
            01 &nbsp; OUR MISSION
          </p>
        </Reveal>

        <Reveal delay={150}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-tight text-slate-900 mb-6">
            Make advanced, intuitive bionic neuroprosthetics{" "}
            <span className="font-sans font-normal text-slate-900">accessible and life-restoring.</span>
          </h2>
        </Reveal>

        <Reveal delay={300}>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            A world where the prohibitive cost and mechanical limitations of prosthetic limbs
            no longer stand in the way of amputees reclaiming their independence, dexterity, and natural motion.
          </p>
        </Reveal>

        <Reveal delay={450}>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Activity,
                title: 'Pratikshya One (14 DoF)',
                desc: 'Physiological bionic arm with 14 active degrees of freedom, individually motorized digits, and natural compliance.',
                bgClass: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
                textClass: 'text-emerald-600',
              },
              {
                icon: Brain,
                title: 'Adaptive Neural EMG',
                desc: 'Multichannel surface EMG sensor matrix powered by edge neural AI that learns the wearer\'s unique muscle intent.',
                bgClass: 'bg-blue-50 text-blue-600 border border-blue-200/60',
                textClass: 'text-blue-600',
              },
              {
                icon: ShieldCheck,
                title: 'Modular Socket System',
                desc: 'Universal breathable socket architecture with multi-point micro-adjustment for all-day clinical comfort and stability.',
                bgClass: 'bg-indigo-50 text-indigo-600 border border-indigo-200/60',
                textClass: 'text-indigo-600',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white border border-slate-200/80 rounded-2xl p-8 text-left shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${item.bgClass}`}
                >
                  <item.icon
                    size={20}
                    className={item.textClass}
                  />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
