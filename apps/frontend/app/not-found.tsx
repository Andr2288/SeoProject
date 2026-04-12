import Container from '@/components/layout/container';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="py-20">
      <Container className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-6 text-gray-600">Сторінку не знайдено.</p>
        <Link href="/" className="rounded-xl bg-black px-4 py-2 text-white">
          На головну
        </Link>
      </Container>
    </main>
  );
}