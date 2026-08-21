import { AccessGuard } from '@/components/AccessGuard';
import { AccessGuard } from '@/components/AccessGuard';
import MainDashboard from '@/components/MainDashboard'; // or whatever your core UI component is named

export default function Home() {
  return (
    <AccessGuard>
      <main className="min-h-screen bg-slate-950">
        {/* Your existing app layout loads here once unlocked */}
        <MainDashboard />
      </main>
    </AccessGuard>
      </AccessGuard>
  );
}
