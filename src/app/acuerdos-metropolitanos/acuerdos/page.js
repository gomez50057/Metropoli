import ProtectedRoute from '@/features/acuerdos-metropolitanos/auth/ProtectedRoute';
import AgreementsList from '@/features/acuerdos-metropolitanos/list/AgreementsList';
import AgreementsShell from '@/features/acuerdos-metropolitanos/layout/AgreementsShell';

export default function AgreementsPage() {
  return (
    <ProtectedRoute>
      <AgreementsShell>
        <AgreementsList />
      </AgreementsShell>
    </ProtectedRoute>
  );
}
