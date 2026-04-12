import Image from 'next/image';
import Link from 'next/link';
import { ArticleCard as ArticleCardType } from '@/lib/types';
import { formatDate } from '@/lib/utils';

type Props = {
  article: ArticleCardType;
};

export default function ArticleCard({ article }: Props) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="block overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <article>
        {article.cover_url && (
          <div className="relative h-56 w-full">
            <Image
              src={article.cover_url}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="p-5">
          <div className="mb-3 flex flex-wrap gap-2 text-xs text-gray-500">
            {article.category?.slug && (
              <span className="rounded-full bg-gray-100 px-2 py-1">
                {article.category.name}
              </span>
            )}

            {article.author?.slug && (
              <span className="rounded-full bg-gray-100 px-2 py-1">
                {article.author.name}
              </span>
            )}

            <span>{formatDate(article.published_at)}</span>
            <span>{article.views || 0} переглядів</span>
          </div>

          <h2 className="mb-3 text-xl font-semibold leading-tight">
            {article.title}
          </h2>

          {article.excerpt && (
            <p className="mb-4 text-sm leading-6 text-gray-600">
              {article.excerpt}
            </p>
          )}

          <span className="text-sm font-medium text-black underline-offset-4 hover:underline">
            Читати далі →
          </span>
        </div>
      </article>
    </Link>
  );
}