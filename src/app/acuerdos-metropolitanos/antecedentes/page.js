import ProtectedRoute from '@/features/acuerdos-metropolitanos/auth/ProtectedRoute';
import BackgroundLinks from '@/features/acuerdos-metropolitanos/antecedentes/BackgroundLinks';
import AgreementsShell from '@/features/acuerdos-metropolitanos/layout/AgreementsShell';

export default function AntecedentesPage() {
  return (
    <ProtectedRoute>
      <AgreementsShell>
        <BackgroundLinks />
      </AgreementsShell>
    </ProtectedRoute>
  );
}
