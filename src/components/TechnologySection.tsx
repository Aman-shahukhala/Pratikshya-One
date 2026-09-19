import { Cpu, Brain, Eye, Battery, ShieldCheck } from 'lucide-react';
import Reveal from './Reveal';

const TECH_IMAGE =
  'https://images.pexels.com/photos/3520697/pexels-photo-3520697.jpeg?auto=compress&cs=tinysrgb&w=1920';

const platform = [
  { icon: Cpu, title: 'Micro-Actuator Matrix', desc: 'Lightweight brushless DC motors integrated directly into each finger joint for individual articulation and natural compliance.', shared: 'Bionic Kinematics' },
  { icon: Brain, title: 'Neural EMG Pattern Recognition', desc: 'On-device edge AI decodes multichannel surface electromyography signals into intended grip gestures in under 50 milliseconds.', shared: 'Edge Neural AI' },
  { icon: Eye, title: 'Active Sensory & Slip Detection', desc: 'Fingertip piezo-resistive sensor matrix detects micro-vibrations and dynamically adjusts grip pressure before objects slip.', shared: 'Haptic Sensing' },
  { icon: Battery, title: 'All-Day Wearable Power System', desc: 'High energy-density lithium cell architecture optimized for low-weight clinical comfort and 18+ hours of continuous daily use.', shared: 'Power Architecture' },
  { icon: ShieldCheck, title: 'Medical Regulatory Pathway', desc: 'Engineered in strict compliance with ISO 13485 medical device quality management, Nepal DDA, and FDA 510(k) export pathway.', shared: 'ISO 13485 / DDA' },
];

export default function TechnologySection() {
  return (
    <section id="technology" className="relative py-12 lg:py-16 overflow-hidden bg-white border-t border-slate-200/80 scroll-mt-20">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <Reveal>
          <div className="text-center mb-10">
            <p className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-blue-600 mb-3 font-semibold">
              03 &nbsp; TECHNOLOGY PLATFORM
            </p>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-slate-900">
              Engineered for the human body. <span className="font-sans font-normal">Neural precision.</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Our proprietary hardware and software stack translates subtle muscular
              biosignals into fluid, multi-articulating bionic motion with sub-50ms latency.
            </p>
          </div>
        </Reveal>

        {/* Cinematic circuit image */}
        <Reveal variant="scale">
          <div className="relative rounded-2xl overflow-hidden mb-10 border border-slate-200 shadow-md bg-slate-900">
            <img
              src={TECH_IMAGE}
              alt="Technology platform circuit board"
              className="w-full h-[220px] sm:h-[320px] lg:h-[400px] object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4 sm:px-6 text-white">
                <p className="text-lg sm:text-2xl font-light mb-1 sm:mb-2">
                  Sub-50ms neuromuscular decoding latency · 14 active DoF
                </p>
                <p className="text-xs sm:text-sm text-slate-300">
                  Clinical-grade surface EMG processing at just 480g total assembly weight
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Platform components */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {platform.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 h-full shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center shrink-0">
                    <item.icon size={20} className="text-blue-600" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full font-semibold bg-blue-50 text-blue-700">
                    {item.shared}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{item.desc}</p>
              </div>
            </Reveal>
          ))}

          {/* Synergy callout card */}
          <Reveal delay={500}>
            <div className="rounded-2xl p-6 sm:p-8 h-full bg-slate-50 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-base font-semibold text-slate-900 mb-2 sm:mb-3">Adaptive Calibration</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                As the wearer uses Pratikshya One, our edge neural networks continuously
                learn and adapt to muscle fatigue, perspiration changes, and residual limb
                signals for consistent, all-day dexterity.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
