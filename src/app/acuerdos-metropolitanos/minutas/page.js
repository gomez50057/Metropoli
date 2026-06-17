import ProtectedRoute from '@/features/acuerdos-metropolitanos/auth/ProtectedRoute';
import { WRITE_ROLES } from '@/features/acuerdos-metropolitanos/constants/roles';
import AgreementsShell from '@/features/acuerdos-metropolitanos/layout/AgreementsShell';
import MinutesByInstance from '@/features/acuerdos-metropolitanos/minutas/MinutesByInstance';

export default function MinutasPage() {
  return (
    <ProtectedRoute roles={WRITE_ROLES}>
      <AgreementsShell>
        <MinutesByInstance />
      </AgreementsShell>
    </ProtectedRoute>
  );
}
