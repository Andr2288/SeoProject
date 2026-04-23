import type { Metadata } from 'next';
import Container from '@/components/layout/container';
import Link from 'next/link';
import JsonLd from '@/components/seo/json-ld';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const FALLBACK_CONTACT_EMAIL = 'redaktsiya@itblog-mvp.demo';

const PROJECT_SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/it-blog-mvp/demo' },
  { label: 'Telegram', href: 'https://t.me/itblog_mvp_demo' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/showcase/it-blog-mvp-demo' },
  { label: 'X (Twitter)', href: 'https://x.com/itblog_mvp_demo' },
] as const;

export const metadata: Metadata = {
  title: 'IT блог українською — про IT Blog MVP та редакцію',
  description:
    'IT блог українською про технології: місія IT Blog MVP, тематика матеріалів і контакти редакції. Читайте головну та підписуйтесь на оновлення.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'IT блог українською — про IT Blog MVP та редакцію',
    description:
      'Хто ми, для кого пишемо, як будуємо довіру до матеріалів і як зв’язатися з редакцією.',
    url: `${siteUrl}/about`,
    type: 'website',
  },
};

function buildAboutJsonLd(base: string, contactEmail: string) {
  const origin = base.replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${origin}/#organization`,
        name: 'IT Blog MVP',
        url: `${origin}/`,
        description:
          'Навчальний новинний IT блог українською про JavaScript, backend, DevOps, штучний інтелект і кібербезпеку.',
        email: contactEmail,
        sameAs: PROJECT_SOCIALS.map((s) => s.href),
        logo: {
          '@type': 'ImageObject',
          url: `${origin}/window.svg`,
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: `${origin}/`,
        name: 'IT Blog MVP',
        inLanguage: 'uk-UA',
        publisher: { '@id': `${origin}/#organization` },
      },
      {
        '@type': 'WebPage',
        '@id': `${origin}/about#webpage`,
        url: `${origin}/about`,
        name: 'IT блог українською: хто стоїть за IT Blog MVP',
        description:
          'Сторінка про місію, редакційну політику та контакти навчального IT блогу українською.',
        isPartOf: { '@id': `${origin}/#website` },
        about: { '@id': `${origin}/#organization` },
        inLanguage: 'uk-UA',
      },
    ],
  };
}

export default function AboutPage() {
  const contactEmail =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || FALLBACK_CONTACT_EMAIL;

  const orgJsonLd = buildAboutJsonLd(siteUrl, contactEmail);

  return (
    <main className="py-10">
      <JsonLd data={orgJsonLd} />
      <Container className="max-w-3xl">
        <article className="rounded-3xl border bg-white p-6 shadow-sm md:p-10">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">
            IT блог українською: хто стоїть за IT Blog MVP
          </h1>
          <p className="mb-8 text-sm text-gray-500">
            Дата заснування проєкту:{' '}
            <time dateTime="2025-09-01">вересень 2025</time> (навчальний семестр)
          </p>

          <p className="mb-8 leading-relaxed text-gray-700">
            <strong>IT блог українською</strong> сьогодні потрібен не менше, ніж англомовні
            дайджести: читачі шукають короткі пояснення релізів, безпечні практики деплою та
            зрозумілі огляди інструментів без зайвого жаргону. IT Blog MVP — це саме такий{' '}
            <strong>новинний онлайн-ресурс про технології</strong>, який збирає матеріали для
            студентів, джуніор-розробників і фахівців, які хочуть швидко зорієнтуватися в змінах
            індустрії. Ми поєднуємо формат <strong>оглядів IT-інструментів</strong>, короткі новини
            та аналітичні нотатки, щоб кожна публікація мала зрозумілу структуру й практичний
            висновок.
          </p>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold">
              Що ви знайдете в цьому IT блозі українською
            </h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              У центрі уваги — <strong>сучасний веб-розробницький стек</strong>, серверні
              технології та культура постачання змін. Ми висвітлюємо теми <strong>фронтенду</strong>{' '}
              та <strong>бекенду</strong>, інфраструктуру (<strong>DevOps</strong>), а також
              напрями <strong>штучного інтелекту</strong> та <strong>кібербезпеки</strong>. Такий
              мікс відображає реальні запити аудиторії: від перших кроків у TypeScript до
              обговорення моделей машинного навчання в продакшені. Для нас важливо не
              «натиснути ключові слова», а дати читачеві <strong>змістовний дайджест IT-подій</strong>{' '}
              і посилання на перевірені підходи.
            </p>
            <p className="leading-relaxed text-gray-700">
              Окремо ми підтримуємо логіку курсу з SEO: зручні URL, коректні заголовки, карта
              сайту та стрічка RSS допомагають і людям, і пошуковим системам знаходити
              актуальні матеріали. Якщо вам ближче формат «читати у стрічці», зверніть увагу на
              соцмережі та GitHub — там ми публікуємо короткі анонси та посилання на повні тексти.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold">
              Як ми підсилюємо довіру до контенту (E-E-A-T)
            </h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              Ми дотримуємося правила: кожна стаття має іменованого автора з публічним профілем, а
              спірні твердження варто підкріплювати посиланням на документацію або первинне
              джерело. У межах навчального проєкту ми орієнтуємося на структуру курсу:{' '}
              <strong>
                на головній сторінці одночасно показується не менше десяти анонсів матеріалів
              </strong>
              , що дозволяє тримати стрічку живою й регулярно оновлюваною. Якщо знайдена
              фактична неточність, ми виправляємо текст і зберігаємо прозорість щодо дати
              останньої правки — це базова <strong>редакційна політика</strong>, яка наближає
              навчальний блог до стандартів реального медіа.
            </p>
            <p className="leading-relaxed text-gray-700">
              Адміністративна частина сайту не індексується пошуковими системами: це технічне
              рішення, яке відокремлює публічний контент від панелі редагування й зменшує ризик
              випадкового потрапляння службових сторінок у видачу. Публічні розділи — статті,
              автори, категорії, теги та пошук — залишаються відкритими для користувачів і
              краулерів за правилами <code>robots.txt</code> проєкту.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold">Контакти та спільнота</h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              Зв’язатися з редакцією можна електронною поштою; посилання на соцмережі зібрані
              нижче, щоб ви могли стежити за оновленнями у зручному каналі. Ми вітаємо зворотний
              зв’язок щодо якості перекладів термінів, зручності навігації та ідей для нових
              тем — це допомагає розвивати <strong>україномовні IT-матеріали</strong> без
              поверхневого «контенту заради SEO».
            </p>
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

          <section className="mb-8">
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

          <section className="mb-2 rounded-xl bg-gray-50 p-5 text-gray-700">
            <h2 className="mb-2 text-xl font-semibold">Висновок і заклик до дії</h2>
            <p className="leading-relaxed">
              Якщо вам відгукнувся формат <strong>інформаційного IT-порталу</strong> з акцентом на
              ясність і чесність щодо меж навчального проєкту — перегляньте головну сторінку,
              оберіть категорію й додайте сайт у закладки. Так ви швидше повернетеся до добірки
              текстів, коли готуватиметеся до занять або плануватимете оновлення стеку.
            </p>
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
