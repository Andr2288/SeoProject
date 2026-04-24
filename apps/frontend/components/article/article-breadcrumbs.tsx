import Link from 'next/link';

type CategoryRef = { name: string; slug: string } | null | undefined;

type Props = {
  category?: CategoryRef | CategoryRef[] | null;
  articleTitle: string;
};

function pickCategory(cat: Props['category']): { name: string; slug: string } | null {
  if (!cat) return null;
  if (Array.isArray(cat)) {
    const first = cat[0];
    return first?.slug ? first : null;
  }
  return cat.slug ? cat : null;
}

/**
 * Видимі хлібні крихти для сторінки статті.
 * Розмітка без вкладеного flex+truncate всередині overflow-hidden — щоб рядок завжди був читабельний.
 */
export default function ArticleBreadcrumbs({ category, articleTitle }: Props) {
  const c = pickCategory(category);

  return (
    <nav
      aria-label="Хлібні крихти"
      className="text-sm leading-relaxed text-gray-700 dark:text-gray-200"
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <Link
          href="/"
          className="shrink-0 font-medium text-gray-800 underline-offset-2 hover:underline dark:text-gray-100"
        >
          Головна
        </Link>

        {c ? (
          <>
            <span className="shrink-0 text-gray-400 dark:text-gray-500" aria-hidden>
              /
            </span>
            <Link
              href={`/categories/${c.slug}`}
              className="shrink-0 font-medium text-gray-800 underline-offset-2 hover:underline dark:text-gray-100"
            >
              {c.name}
            </Link>
          </>
        ) : null}

        <span className="shrink-0 text-gray-400 dark:text-gray-500" aria-hidden>
          /
        </span>
        <span
          className="min-w-0 break-words font-semibold text-gray-950 dark:text-gray-50"
          aria-current="page"
        >
          {articleTitle}
        </span>
      </div>
    </nav>
  );
}
