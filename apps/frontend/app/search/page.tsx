import type { Metadata } from 'next';
import { Suspense } from 'react';
import Container from '@/components/layout/container';
import SearchPageClient from './search-page-client';

export const metadata: Metadata = {
  alternates: {
    canonical: '/search',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="py-10">
          <Container>
            <div className="rounded-2xl border bg-white p-8 text-center text-gray-500">
              Завантаження...
            </div>
          </Container>
        </main>
      }
    >
      <SearchPageClient />
    </Suspense>
  );
}
