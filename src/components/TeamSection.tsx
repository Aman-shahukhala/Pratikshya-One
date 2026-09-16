import Reveal from './Reveal';
import { useParallax } from '@/hooks/useScrollReveal';

const TEAM_IMAGE =
  'https://images.pexels.com/photos/8439001/pexels-photo-8439001.jpeg?auto=compress&cs=tinysrgb&w=1920';

const team = [
  { name: 'Pratikshya Shrestha', role: 'CEO & Co-Founder', bg: 'Biomedical engineering; 10 yrs in prosthetics R&D' },
  { name: 'Bibek Adhikari', role: 'CTO & Co-Founder', bg: 'Neural engineering & bionic actuator design' },
  { name: 'Dr. Sangita Rai', role: 'VP Clinical Affairs', bg: 'Licensed prosthetist/orthotist; clinical trial design' },
  { name: 'Anup Gurung', role: 'VP Biomedical Operations', bg: 'ISO 13485 medical manufacturing & cleanroom ops' },
  { name: 'Kabita Maharjan', role: 'Lead Neural AI & Firmware', bg: 'EMG biosignal processing & edge neural inference' },
];

export default function TeamSection() {
  const imgRef = useParallax<HTMLImageElement>(0.12);

  return (
    <section id="team" className="relative py-20 lg:py-28 overflow-hidden bg-white border-t border-slate-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
        <Reveal>
          <div className="text-center mb-16">
            <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-slate-400 mb-4">
              06 &nbsp; STUDIO &amp; LEADERSHIP
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-slate-900">
              Built by engineers &amp; clinicians, <br />
              <span className="font-sans font-normal">for human independence.</span>
            </h2>
          </div>
        </Reveal>

        {/* Team image */}
        <Reveal variant="scale">
          <div className="relative rounded-2xl overflow-hidden mb-16 border border-slate-200 shadow-md bg-slate-900">
            <div className="overflow-hidden h-[350px] sm:h-[450px]">
              <img
                ref={imgRef}
                src={TEAM_IMAGE}
                alt="Engineering team at work"
                className="w-full h-full object-cover opacity-60 scale-110 will-change-transform"
              />
            </div>
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 text-center text-white">
              <p className="text-lg sm:text-xl font-light max-w-2xl mx-auto">
                Biomedical engineers, roboticists, and prosthetists — working
                from Kathmandu, Nepal.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Team grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <Reveal key={member.name} delay={i * 100}>
              <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-xs font-mono uppercase tracking-wider text-blue-600 font-semibold mb-3">{member.role}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{member.bg}</p>
              </div>
            </Reveal>
          ))}

          {/* Advisory board card */}
          <Reveal delay={500}>
            <div className="rounded-2xl p-8 bg-slate-50 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Advisory Board</h3>
              <p className="text-xs font-mono uppercase tracking-wider text-emerald-600 font-semibold mb-3">Clinical &amp; Regulatory</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Nepal DDA regulatory advisor, rehabilitation medicine specialist,
                licensed prosthetics director, and patient advocacy representatives.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
