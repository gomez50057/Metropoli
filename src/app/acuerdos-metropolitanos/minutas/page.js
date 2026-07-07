import ProtectedRoute from '@/features/acuerdos-metropolitanos/auth/ProtectedRoute';
import AgreementsShell from '@/features/acuerdos-metropolitanos/layout/AgreementsShell';
import MinutesByInstance from '@/features/acuerdos-metropolitanos/minutas/MinutesByInstance';

export default function MinutasPage() {
  return (
    <ProtectedRoute>
      <AgreementsShell>
        <MinutesByInstance />
      </AgreementsShell>
    </ProtectedRoute>
  );
}
