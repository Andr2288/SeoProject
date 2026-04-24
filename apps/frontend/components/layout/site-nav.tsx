'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV: { href: string; label: string; match: (pathname: string) => boolean }[] = [
  { href: '/', label: 'Головна', match: (p) => p === '/' },
  {
    href: '/about',
    label: 'Про нас',
    match: (p) => p === '/about' || p.startsWith('/about/'),
  },
  { href: '/search', label: 'Пошук', match: (p) => p === '/search' },
  {
    href: '/admin/login',
    label: 'Адмінка',
    match: (p) => p.startsWith('/admin'),
  },
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex items-center gap-4 text-sm text-gray-600"
      aria-label="Головна навігація"
    >
      {NAV.map(({ href, label, match }) => {
        const active = match(pathname);
        if (active) {
          return (
            <span key={href} className="font-medium text-gray-900" aria-current="page">
              {label}
            </span>
          );
        }
        return (
          <Link key={href} href={href} className="hover:text-gray-900">
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
