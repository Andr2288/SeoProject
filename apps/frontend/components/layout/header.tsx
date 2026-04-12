import Link from 'next/link';
import Container from './container';

export default function Header() {
  return (
    <header className="border-b bg-white">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="text-xl font-bold">
          IT Blog MVP
        </Link>

        <nav className="flex items-center gap-4 text-sm text-gray-600">
          <Link href="/">Головна</Link>
          <Link href="/search">Пошук</Link>
          <Link href="/admin/login">Адмінка</Link>
        </nav>
      </Container>
    </header>
  );
}