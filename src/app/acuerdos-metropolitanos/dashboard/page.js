import ProtectedRoute from '@/features/acuerdos-metropolitanos/auth/ProtectedRoute';
import AgreementsDashboard from '@/features/acuerdos-metropolitanos/dashboard/AgreementsDashboard';
import AgreementsShell from '@/features/acuerdos-metropolitanos/layout/AgreementsShell';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AgreementsShell>
        <AgreementsDashboard />
      </AgreementsShell>
    </ProtectedRoute>
  );
}
