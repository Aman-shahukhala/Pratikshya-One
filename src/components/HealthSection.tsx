import { Hand, Brain, Battery, Feather, Smartphone, Activity } from 'lucide-react';
import Reveal from './Reveal';
import { useParallax } from '@/hooks/useScrollReveal';

const HEALTH_IMAGE =
  'https://images.pexels.com/photos/6153078/pexels-photo-6153078.jpeg?auto=compress&cs=tinysrgb&w=1920';

const HEALTH_IMAGE_2 =
  'https://images.pexels.com/photos/6153351/pexels-photo-6153351.jpeg?auto=compress&cs=tinysrgb&w=1920';

const specs = [
  { icon: Hand, label: 'Degrees of Freedom', value: '14', sub: 'Industry avg: 6–8 DoF' },
  { icon: Feather, label: 'Ultralight Weight', value: '480g', sub: '30% lighter than category avg' },
  { icon: Battery, label: 'Continuous Operation', value: '48h', sub: 'Extended clinical duty cycle' },
  { icon: Brain, label: 'Adaptive EMG Learning', value: '30 days', sub: 'Personalized neural calibration' },
];

const techStack = [
  { icon: Activity, text: 'High-density non-invasive surface EMG sensor matrix' },
  { icon: Brain, text: 'On-device sub-millisecond edge neural inference unit' },
  { icon: Smartphone, text: 'Clinical clinician portal & patient calibration app' },
  { icon: Activity, text: 'Continuous adaptive grip learning & telemetry' },
];

export default function HealthSection() {
  const imgRef = useParallax<HTMLImageElement>(0.12);

  return (
    <section id="health" className="relative py-20 lg:py-28 overflow-hidden bg-white border-t border-slate-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
        {/* Section header */}
        <Reveal>
          <div className="text-center mb-20">
            <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-emerald-600 mb-4 font-semibold">
              02 &nbsp; BIONIC HEALTHCARE DIVISION
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-slate-900">
              The <span className="font-sans font-normal">Pratikshya One</span>
            </h2>
            <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Near-natural physiological dexterity at a fraction of the cost. A neuro-adaptive
              bionic prosthetic arm engineered to restore independence.
            </p>
          </div>
        </Reveal>

        {/* Cinematic image showcase */}
        <Reveal variant="scale">
          <div className="relative rounded-2xl overflow-hidden mb-20 border border-slate-200 shadow-md bg-white">
            <div className="overflow-hidden h-[420px] sm:h-[500px]">
              <img
                ref={imgRef}
                src={HEALTH_IMAGE}
                alt="Pratikshya One prosthetic arm"
                className="w-full h-full object-cover scale-110 will-change-transform"
              />
            </div>
            <div className="p-8 sm:p-10 bg-white border-t border-slate-200">
              <p className="text-2xl sm:text-3xl font-light mb-2 max-w-2xl text-slate-900">
                14 degrees of freedom. <span className="font-sans">Adaptive neural grip AI.</span> 480 grams.
              </p>
              <p className="text-sm text-slate-600 max-w-xl">
                The most physiologically capable bionic hand engineered — at less than half
                the cost of legacy neuroprosthetic systems.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Spec cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {specs.map((spec, i) => (
            <Reveal key={spec.label} delay={i * 100}>
              <div className="bg-white border border-slate-200/80 rounded-xl p-6 text-center shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 hover:-translate-y-1">
                <spec.icon size={22} className="mx-auto mb-4 text-emerald-600" />
                <p className="text-3xl font-bold mb-1 counter text-slate-900 tracking-tight">{spec.value}</p>
                <p className="text-xs font-semibold text-slate-700 mb-1">{spec.label}</p>
                <p className="text-[11px] text-slate-500 font-normal">{spec.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Two-column: modular socket + tech stack with solid card wrap for 3D clearance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-20">
          <Reveal variant="left">
            <div className="relative rounded-xl overflow-hidden h-[400px] border border-slate-200 shadow-sm">
              <img
                src={HEALTH_IMAGE_2}
                alt="Prosthetic arm detail"
                className="w-full h-full object-cover"
              />
            </div>
          </Reveal>

          <Reveal variant="right" delay={150}>
            <div className="bg-white/95 border border-slate-200/80 rounded-2xl p-8 sm:p-10 shadow-sm backdrop-blur-md">
              <h3 className="text-2xl font-light mb-4 text-slate-900">
                Modular <span className="font-sans font-normal">socket architecture</span>
              </h3>
              <p className="text-slate-600 leading-relaxed mb-8 text-sm sm:text-base">
                Accommodates varying residual limb anatomies without recurring custom
                remolding. Certified prosthetists conduct clinic fitting, while the intelligent
                companion platform manages daily micro-calibration and ongoing EMG refinement remotely.
              </p>
              <div className="space-y-4">
                {techStack.map((tech) => (
                  <div key={tech.text} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center shrink-0">
                      <tech.icon size={15} className="text-emerald-600" />
                    </div>
                    <p className="text-sm text-slate-700 pt-1 font-medium">{tech.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Clinical Roadmap */}
        <Reveal>
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-8 sm:p-12 shadow-xs">
            <h3 className="text-xl font-light mb-8 text-center text-slate-900">
              Clinical &amp; Commercial <span className="font-sans">Roadmap</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { time: 'Now – 6 mo', milestone: 'Design for ISO 13485 manufacturing; usability clinical trials' },
                { time: '6–12 mo', milestone: 'DDA registration; multicenter pilot with 3 national rehab hospitals' },
                { time: '12–18 mo', milestone: 'Limited clinical release; CE Mark & FDA 510(k) preparation' },
                { time: '18–24 mo', milestone: 'Full nationwide deployment; first export distribution' },
                { time: 'Year 3', milestone: 'Pediatric prosthetic variant; expanded global health partnerships' },
              ].map((phase, i) => (
                <div key={phase.time} className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </div>
                    {i < 4 && <div className="h-[1px] flex-1 bg-slate-200" />}
                  </div>
                  <p className="text-[11px] text-emerald-600 font-mono font-semibold mb-1">{phase.time}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{phase.milestone}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
