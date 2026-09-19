import Reveal from './Reveal';
import { useParallax } from '@/hooks/useScrollReveal';

const TEAM_IMAGE =
  'https://images.pexels.com/photos/8439001/pexels-photo-8439001.jpeg?auto=compress&cs=tinysrgb&w=1920';

const team = [
  { name: 'Aman Shahukhala', role: 'Co-Founder & Team Lead', bg: 'CS Student & Project Lead; specializing in systems architecture, embedded computing & bionic product design.' },
  { name: 'Ashim Kandel', role: 'Lead Software & AI Systems', bg: 'CS Student; focusing on deep learning neural models, biosignal processing & machine learning pipelines.' },
  { name: 'Arjan Shrestha', role: 'Embedded Systems & Robotics', bg: 'CS Student; focusing on micro-controller firmware, motor kinematics & hardware-software interfacing.' },
  { name: 'Mandira Shrestha', role: 'Frontend & App Architecture', bg: 'CS Student; focusing on clinical dashboard applications, real-time telemetry UI & data visualization.' },
  { name: 'Saya Karki', role: 'Biosignal Processing & AI', bg: 'CS Student; focusing on surface EMG feature extraction, gesture classification & edge AI inference.' },
];

export default function TeamSection() {
  const imgRef = useParallax<HTMLImageElement>(0.12);

  return (
    <section id="team" className="relative py-12 lg:py-16 overflow-hidden bg-white border-t border-slate-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
        <Reveal>
          <div className="text-center mb-10">
            <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-slate-400 mb-3">
              05 &nbsp; STUDIO &amp; LEADERSHIP
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-slate-900">
              Built by Computer Science innovators, <br />
              <span className="font-sans font-normal">for human independence.</span>
            </h2>
          </div>
        </Reveal>

        {/* Team image */}
        <Reveal variant="scale">
          <div className="relative rounded-2xl overflow-hidden mb-10 border border-slate-200 shadow-md bg-slate-900">
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
                Computer Science students, AI developers, and robotics enthusiasts — innovating
                from Kathmandu, Nepal.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Team grid: 2 on top, 3 on bottom with equal sizing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 items-stretch">
          {team.map((member, i) => {
            const layoutClasses =
              i === 0
                ? 'lg:col-span-2 lg:col-start-2'
                : i === 1
                  ? 'lg:col-span-2'
                  : i === 2
                    ? 'lg:col-span-2 lg:col-start-1'
                    : i === 3
                      ? 'lg:col-span-2'
                      : 'lg:col-span-2 md:col-span-2 md:max-w-md md:mx-auto lg:max-w-none lg:mx-0';

            return (
              <Reveal key={member.name} delay={i * 100} className={`h-full w-full ${layoutClasses}`}>
                <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{member.name}</h3>
                    <p className="text-xs font-mono uppercase tracking-wider text-blue-600 font-semibold mb-3">{member.role}</p>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mt-2">{member.bg}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
