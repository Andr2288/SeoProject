import Link from 'next/link';

type Props = {
  category?: { name: string; slug: string } | null;
  articleTitle: string;
};

export default function ArticleBreadcrumbs({ category, articleTitle }: Props) {
  return (
    <nav aria-label="Хлібні крихти" className="mb-6 text-sm text-gray-600">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-gray-900 hover:underline">
            Головна
          </Link>
        </li>
        {category?.slug ? (
          <>
            <li className="text-gray-400" aria-hidden>
              →
            </li>
            <li>
              <Link
                href={`/categories/${category.slug}`}
                className="hover:text-gray-900 hover:underline"
              >
                {category.name}
              </Link>
            </li>
          </>
        ) : null}
        <li className="text-gray-400" aria-hidden>
          →
        </li>
        <li
          className="max-w-[min(100%,42rem)] truncate font-medium text-gray-900"
          title={articleTitle}
          aria-current="page"
        >
          {articleTitle}
        </li>
      </ol>
    </nav>
  );
}
