'use client';

import { useEffect, useState } from 'react';
import { getMe } from '@/lib/admin-api';
import { removeToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};

export default function AdminGuard({ children }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthorized'>('loading');

  useEffect(() => {
    async function checkAuth() {
      try {
        await getMe();
        setStatus('authorized');
      } catch {
        removeToken();
        setStatus('unauthorized');
        router.replace('/admin/login');
      }
    }

    checkAuth();
  }, [router]);

  if (status === 'loading') {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-gray-500">
        Перевірка доступу...
      </div>
    );
  }

  if (status === 'unauthorized') {
    return null;
  }

  return <>{children}</>;
}