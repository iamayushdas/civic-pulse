'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/brutal/AuthProvider';

export function AdminAccessGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const isAdmin = user?.role === 'OFFICER' || user?.role === 'SUPERADMIN';

    if (!user) {
      router.replace('/login');
      return;
    }

    if (!isAdmin) {
      router.replace('/');
    }
  }, [loading, router, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-civic-black text-civic-white flex items-center justify-center">
        <div className="text-xl font-bold">VERIFYING ACCESS...</div>
      </div>
    );
  }

  const isAdmin = user?.role === 'OFFICER' || user?.role === 'SUPERADMIN';

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
