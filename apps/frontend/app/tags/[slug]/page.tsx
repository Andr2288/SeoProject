import { getTagArticles } from '@/lib/api';
import Container from '@/components/layout/container';
import ArticleList from '@/components/article/article-list';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    page?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await getTagArticles(slug, { page: 1, perPage: 9 });
    const tag = res.data.tag;

    return {
      title: `#${tag.name} | IT Blog MVP`,
      description: `Статті за тегом ${tag.name}`,
      alternates: {
        canonical: `/tags/${tag.slug}`,
      },
    };
  } catch {
    return {
      title: 'Тег не знайдено',
    };
  }
}

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = (await searchParams) || {};
  const page = Number(query.page || 1);

  let result;

  try {
    result = await getTagArticles(slug, { page, perPage: 9 });
  } catch {
    notFound();
  }

  const { tag, articles } = result.data;
  const meta = result.meta;

  return (
    <main className="py-10">
      <Container>
        <section className="mb-8">
          <p className="mb-2 text-sm text-gray-500">Тег</p>
          <h1 className="mb-3 text-4xl font-bold">#{tag.name}</h1>
          <p className="text-gray-600">Усі статті, пов’язані з цим тегом.</p>
        </section>

        <ArticleList articles={articles} />

        <section className="mt-10 flex items-center justify-center gap-3">
          {page > 1 && (
            <Link
              href={`/tags/${slug}?page=${page - 1}`}
              className="rounded-xl border bg-white px-4 py-2 text-sm"
            >
              ← Назад
            </Link>
          )}

          <span className="text-sm text-gray-500">
            Сторінка {meta.page} з {Math.max(meta.totalPages, 1)}
          </span>

          {page < meta.totalPages && (
            <Link
              href={`/tags/${slug}?page=${page + 1}`}
              className="rounded-xl border bg-white px-4 py-2 text-sm"
            >
              Далі →
            </Link>
          )}
        </section>
      </Container>
    </main>
  );
}