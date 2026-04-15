import type { Metadata } from 'next';
import Container from '@/components/layout/container';
import Link from 'next/link';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const FALLBACK_CONTACT_EMAIL = 'redaktsiya@itblog-mvp.demo';

const PROJECT_SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/it-blog-mvp/demo' },
  { label: 'Telegram', href: 'https://t.me/itblog_mvp_demo' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/showcase/it-blog-mvp-demo' },
  { label: 'X (Twitter)', href: 'https://x.com/itblog_mvp_demo' },
] as const;

export const metadata: Metadata = {
  title: 'Про нас',
  description:
    'IT Blog MVP — навчальний новинний блог про JavaScript, backend, DevOps, AI та кібербезпеку. Місія та редакційна політика.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'Про нас | IT Blog MVP',
    description:
      'Хто ми, для кого пишемо та як будуємо редакційну якість матеріалів.',
    url: `${siteUrl}/about`,
    type: 'website',
  },
};

export default function AboutPage() {
  const contactEmail =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || FALLBACK_CONTACT_EMAIL;

  return (
    <main className="py-10">
      <Container className="max-w-3xl">
        <article className="rounded-3xl border bg-white p-6 shadow-sm md:p-10">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">Про IT Blog MVP</h1>
          <p className="mb-8 text-sm text-gray-500">
            Дата заснування проєкту:{' '}
            <time dateTime="2025-09-01">вересень 2025</time> (навчальний семестр)
          </p>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold">Хто ми і для кого</h2>
            <p className="leading-relaxed text-gray-700">
              IT Blog MVP — це командний навчальний блог про інформаційні технології. Ми
              публікуємо новини та аналітичні матеріали для студентів, початківців у IT та
              практиків, які стежать за трендами у сферах frontend, backend, DevOps,
              штучного інтелекту, машинного навчання та кібербезпеки.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold">Місія та редакційна політика</h2>
            <p className="mb-3 leading-relaxed text-gray-700">
              <strong>Місія:</strong> зібрати зрозумілі, технічно коректні тексти українською
              мовою, які допомагають читачеві орієнтуватися в стрімких змінах індустрії.
            </p>
            <p className="leading-relaxed text-gray-700">
              <strong>Редакційна політика:</strong> кожна стаття має зазначеного автора з
              публічним профілем; ми уникаємо клікбейту без змісту; при помилках оновлюємо
              матеріал і зберігаємо прозорість щодо дати останньої правки. Адміністративна
              частина сайту не індексується пошуковими системами.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold">Контакти</h2>
            <p className="leading-relaxed text-gray-700">
              Редакція:{' '}
              <a
                href={`mailto:${contactEmail}`}
                className="font-medium text-blue-700 underline-offset-2 hover:underline"
              >
                {contactEmail}
              </a>
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">Соцмережі проєкту</h2>
            <ul className="space-y-2 text-gray-700">
              {PROJECT_SOCIALS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="font-medium text-blue-700 underline-offset-2 hover:underline"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <p className="mt-10 text-center text-sm text-gray-500">
            <Link href="/" className="text-blue-700 hover:underline">
              На головну
            </Link>
          </p>
        </article>
      </Container>
    </main>
  );
}
