'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { removeToken } from '@/lib/auth';

type Props = {
  children: React.ReactNode;
};

export default function AdminShell({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    removeToken();
    router.push('/admin/login');
  }

  const linkClass = (href: string) =>
    `rounded-xl px-4 py-2 text-sm ${
      pathname === href ? 'bg-black text-white' : 'bg-white border'
    }`;

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="rounded-3xl border bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Адмінка</h2>

        <nav className="flex flex-col gap-2">
          <Link href="/admin/articles" className={linkClass('/admin/articles')}>
            Статті
          </Link>
        </nav>

        <button
          onClick={logout}
          className="mt-6 w-full rounded-xl border px-4 py-2 text-sm"
        >
          Вийти
        </button>
      </aside>

      <section>{children}</section>
    </div>
  );
}