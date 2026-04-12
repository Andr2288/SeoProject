import { getCategoryArticles } from '@/lib/api';
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
    const res = await getCategoryArticles(slug, { page: 1, perPage: 9 });
    const category = res.data.category;

    return {
      title: `${category.name} | IT Blog MVP`,
      description:
        category.description || `Статті категорії ${category.name}`,
      alternates: {
        canonical: `/categories/${category.slug}`,
      },
    };
  } catch {
    return {
      title: 'Категорію не знайдено',
    };
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = (await searchParams) || {};
  const page = Number(query.page || 1);

  let result;

  try {
    result = await getCategoryArticles(slug, { page, perPage: 9 });
  } catch {
    notFound();
  }

  const { category, articles } = result.data;
  const meta = result.meta;

  return (
    <main className="py-10">
      <Container>
        <section className="mb-8">
          <p className="mb-2 text-sm text-gray-500">Категорія</p>
          <h1 className="mb-3 text-4xl font-bold">{category.name}</h1>
          {category.description && (
            <p className="max-w-2xl text-gray-600">{category.description}</p>
          )}
        </section>

        <ArticleList articles={articles} />

        <section className="mt-10 flex items-center justify-center gap-3">
          {page > 1 && (
            <Link
              href={`/categories/${slug}?page=${page - 1}`}
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
              href={`/categories/${slug}?page=${page + 1}`}
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