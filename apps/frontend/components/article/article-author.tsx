import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import type { Author } from '@/lib/types';

type Props = {
  author: Author;
  publishedAt?: string | null;
  updatedAt?: string | null;
};

export default function ArticleAuthor({
  author,
  publishedAt,
  updatedAt,
}: Props) {
  if (!author.slug) return null;

  return (
    <aside className="mt-8 rounded-2xl border border-gray-200 bg-gray-50/80 p-5 md:p-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Автор
      </p>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {author.avatar_url ? (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-white shadow-sm">
            <Image
              src={author.avatar_url}
              alt={author.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-dashed border-gray-300 bg-white text-lg font-semibold text-gray-500"
            aria-hidden
          >
            {author.name.slice(0, 1).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <Link
            href={`/authors/${author.slug}`}
            className="text-lg font-semibold text-gray-900 hover:text-blue-700"
          >
            {author.name}
          </Link>
          {author.bio ? (
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{author.bio}</p>
          ) : null}
          <dl className="mt-3 flex flex-col gap-1 text-sm text-gray-500 sm:flex-row sm:flex-wrap sm:gap-x-6">
            <div>
              <dt className="inline text-gray-400">Опубліковано: </dt>
              <dd className="inline">{formatDate(publishedAt)}</dd>
            </div>
            <div>
              <dt className="inline text-gray-400">Оновлено: </dt>
              <dd className="inline">{formatDate(updatedAt || publishedAt)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </aside>
  );
}
