import Link from 'next/link';
import Container from './container';
import SiteNav from './site-nav';

export default function Header() {
  return (
    <header className="border-b bg-white">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="text-xl font-bold">
          IT Blog MVP
        </Link>

        <SiteNav />
      </Container>
    </header>
  );
}