import ProtectedRoute from '@/features/acuerdos-metropolitanos/auth/ProtectedRoute';
import AgreementDetail from '@/features/acuerdos-metropolitanos/detail/AgreementDetail';
import AgreementsShell from '@/features/acuerdos-metropolitanos/layout/AgreementsShell';

export default async function AgreementDetailPage({ params }) {
  const { id } = await params;

  return (
    <ProtectedRoute>
      <AgreementsShell>
        <AgreementDetail id={id} />
      </AgreementsShell>
    </ProtectedRoute>
  );
}
