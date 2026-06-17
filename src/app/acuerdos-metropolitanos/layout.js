import { SessionProvider } from '@/features/acuerdos-metropolitanos/auth/SessionProvider';

export default function AcuerdosMetropolitanosLayout({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
