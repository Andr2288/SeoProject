import { getArticleBySlug, getRelatedArticles } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '@/components/layout/container';
import Image from 'next/image';
import Link from 'next/link';
import ArticleList from '@/components/article/article-list';
import ViewCounter from '@/components/article/view-counter';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await getArticleBySlug(slug);
    const article = res.data;

    return {
      title: article.meta_title || article.title,
      description: article.meta_description || article.excerpt || 'Стаття блогу',
      alternates: {
        canonical: `/articles/${article.slug}`,
      },
      openGraph: {
        title: article.meta_title || article.title,
        description: article.meta_description || article.excerpt || 'Стаття блогу',
        images: article.cover_url ? [article.cover_url] : [],
        type: 'article',
      },
    };
  } catch {
    return {
      title: 'Статтю не знайдено',
    };
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  let article;
  let related = [];

  try {
    const [articleRes, relatedRes] = await Promise.all([
      getArticleBySlug(slug),
      getRelatedArticles(slug),
    ]);

    article = articleRes.data;
    related = relatedRes.data;
  } catch {
    notFound();
  }

  return (
    <main className="py-10">
      <Container className="max-w-4xl">
        <ViewCounter articleId={article.id} />

        <article className="overflow-hidden rounded-3xl border bg-white shadow-sm">
          {article.cover_url && (
            <div className="relative h-[320px] w-full">
              <Image
                  src={article.cover_url}
                  alt={article.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-10">
            <div className="mb-4 flex flex-wrap gap-2 text-sm text-gray-500">
              {article.category?.slug && (
                <Link
                  href={`/categories/${article.category.slug}`}
                  className="rounded-full bg-gray-100 px-3 py-1 hover:bg-gray-200"
                >
                  {article.category.name}
                </Link>
              )}

              {article.author?.slug && (
                <Link
                  href={`/authors/${article.author.slug}`}
                  className="rounded-full bg-gray-100 px-3 py-1 hover:bg-gray-200"
                >
                  {article.author.name}
                </Link>
              )}

              <span>{formatDate(article.published_at)}</span>
              <span>{article.views || 0} переглядів</span>
            </div>

            <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="mb-6 text-lg leading-7 text-gray-600">{article.excerpt}</p>
            )}

            {article.tags?.length ? (
              <div className="mb-8 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tags/${tag.slug}`}
                    className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            ) : null}

            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </article>

        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-bold">Схожі статті</h2>
          <ArticleList articles={related} />
        </section>
      </Container>
    </main>
  );
}