import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  title: 'IT Blog MVP',
  description: 'Навчальний IT-блог на Next.js 14, Express і Supabase.',
  openGraph: {
    type: 'website',
    siteName: 'IT Blog MVP',
    title: 'IT Blog MVP',
    description: 'Навчальний IT-блог',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}