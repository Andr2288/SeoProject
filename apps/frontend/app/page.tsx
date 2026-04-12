import Container from '@/components/layout/container';
import ArticleList from '@/components/article/article-list';
import { getArticles, getCategories } from '@/lib/api';
import Link from 'next/link';

type Props = {
  searchParams?: Promise<{
    page?: string;
    category?: string;
  }>;
};

export default async function HomePage({ searchParams }: Props) {
  const params = (await searchParams) || {};
  const page = Number(params.page || 1);
  const category = params.category || '';

  const [articlesRes, categoriesRes] = await Promise.all([
    getArticles({ page, perPage: 9, category }),
    getCategories(),
  ]);

  const articles = articlesRes.data;
  const meta = articlesRes.meta;
  const categories = categoriesRes.data;

  return (
    <main className="py-10">
      <Container>
        <section className="mb-8">
          <h1 className="mb-3 text-4xl font-bold">IT Blog MVP</h1>
          <p className="max-w-2xl text-gray-600">
            Навчальний блог на Next.js 14, Express та Supabase. Публічні статті,
            категорії, автори, теги та базове SEO.
          </p>
        </section>

        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className={`rounded-full px-4 py-2 text-sm ${
                !category ? 'bg-black text-white' : 'bg-white border'
              }`}
            >
              Усі
            </Link>

            {categories.map((item) => (
              <Link
                key={item.id}
                href={`/?category=${item.slug}`}
                className={`rounded-full border px-4 py-2 text-sm ${
                  category === item.slug ? 'bg-black text-white' : 'bg-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </section>

        <ArticleList articles={articles} />

        <section className="mt-10 flex items-center justify-center gap-3">
          {page > 1 && (
            <Link
              href={`/?page=${page - 1}${category ? `&category=${category}` : ''}`}
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
              href={`/?page=${page + 1}${category ? `&category=${category}` : ''}`}
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