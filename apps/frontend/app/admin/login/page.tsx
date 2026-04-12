'use client';

import { FormEvent, useEffect, useState } from 'react';
import Container from '@/components/layout/container';
import { loginAdmin } from '@/lib/admin-api';
import { isAuthenticated, setToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin12345');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/admin/articles');
    }
  }, [router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginAdmin(email, password);
      setToken(res.data.token);
      router.push('/admin/articles');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="py-16">
      <Container className="max-w-md">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-3xl font-bold">Вхід в адмінку</h1>
          <p className="mb-6 text-sm text-gray-500">
            Увійди як адміністратор для керування статтями.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 w-full rounded-xl border px-4 outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-xl border px-4 outline-none focus:border-black"
                required
              />
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-xl bg-black text-white disabled:opacity-60"
            >
              {loading ? 'Вхід...' : 'Увійти'}
            </button>
          </form>
        </div>
      </Container>
    </main>
  );
}