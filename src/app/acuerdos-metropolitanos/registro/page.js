import ProtectedRoute from '@/features/acuerdos-metropolitanos/auth/ProtectedRoute';
import { WRITE_ROLES } from '@/features/acuerdos-metropolitanos/constants/roles';
import AgreementForm from '@/features/acuerdos-metropolitanos/forms/AgreementForm';
import AgreementsShell from '@/features/acuerdos-metropolitanos/layout/AgreementsShell';

export default function RegistroPage() {
  return (
    <ProtectedRoute roles={WRITE_ROLES}>
      <AgreementsShell>
        <AgreementForm />
      </AgreementsShell>
    </ProtectedRoute>
  );
}
