import ScrollFrameSequence from '@/components/ScrollFrameSequence';
import ScfoLayoutOverlay from '@/components/ScfoLayoutOverlay';
import Navbar from '@/components/Navbar';
import BionicShowcase from '@/components/BionicShowcase';
import Mission from '@/components/Mission';
import HealthSection from '@/components/HealthSection';
import TechnologySection from '@/components/TechnologySection';
import StatsSection from '@/components/StatsSection';
import TeamSection from '@/components/TeamSection';
import InvestorSection from '@/components/InvestorSection';
import Footer from '@/components/Footer';
import { usePointToPointScroll } from '@/hooks/usePointToPointScroll';

const SECTION_IDS = [
  'hero',
  'neural-emg',
  'articulation',
  'socket-haptics',
  'mission',
  'health',
  'technology',
  'impact',
  'team',
  'investors',
  'contact',
];

export default function App() {
  usePointToPointScroll(SECTION_IDS, true);

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-slate-900 selection:text-white relative">
      <ScfoLayoutOverlay />
      
      {/* 3D Frame Sequence Scrubber (Layer z-[10]) - Dynamic left/right positioning */}
      <ScrollFrameSequence frameCount={120} />

      <Navbar />
      <main className="relative z-20">
        <BionicShowcase />
        <Mission />
        <HealthSection />
        <TechnologySection />
        <StatsSection />
        <TeamSection />
        <InvestorSection />
        <Footer />
      </main>
    </div>
  );
}
