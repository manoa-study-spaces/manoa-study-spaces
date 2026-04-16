'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function GuestOnly({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return null;
  }

  if (status === 'authenticated') {
    router.replace('/listings-view');
    return null;
  }

  return children;
}
