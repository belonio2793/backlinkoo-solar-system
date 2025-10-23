import PremiumRankTracker from '@/components/PremiumRankTracker';
import { Footer } from '@/components/Footer';
import RankHeader from '@/components/RankHeader';

export default function RankTrackerPremium() {
  return (
    <div className="min-h-screen bg-background">
      <RankHeader />
      <main className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <PremiumRankTracker />
        </div>
      </main>
      <Footer />
    </div>
  );
}
