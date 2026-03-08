import StarField from '@/components/StarField';
import GuidesPage from '@/components/GuidesPage';

const GuidesPageWrapper = () => (
  <div className="min-h-screen relative">
    <StarField />
    <div className="relative z-10">
      <GuidesPage />
    </div>
  </div>
);

export default GuidesPageWrapper;
