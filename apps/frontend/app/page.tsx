import Container from '@/components/layout/container';
import ArticleList from '@/components/article/article-list';
import { getArticles, getCategories } from '@/lib/api';
import Link from 'next/link';

type Props = {
  searchParams?: Promise<{ page?: string; category?: string }>;
};

export default async function HomePage({ searchParams }: Props) {
  const params = (await searchParams) || {};
  const page = Number(params.page || 1);
  const category = params.category || '';

  const [articlesResult, categoriesResult] = await Promise.allSettled([
    getArticles({ page, perPage: 9, category }),
    getCategories(),
  ]);

  const articles =
    articlesResult.status === 'fulfilled' ? articlesResult.value.data : [];

  const meta =
    articlesResult.status === 'fulfilled'
      ? articlesResult.value.meta
      : { page: 1, perPage: 9, total: 0, totalPages: 1 };

  const categories =
    categoriesResult.status === 'fulfilled' ? categoriesResult.value.data : [];

  const totalPages = Math.max(meta.totalPages, 1);
  const homeHref = (targetPage: number) => {
    const q = new URLSearchParams();
    if (category) q.set('category', category);
    if (targetPage > 1) q.set('page', String(targetPage));
    const s = q.toString();
    return s ? `/?${s}` : '/';
  };

  return (
    <Container>
      <h1>IT Blog MVP</h1>

      {categories.length > 0 && (
        <div>
          <Link href="/">Усі</Link>
          {categories.map((item) => (
            <Link key={item.id} href={`/?category=${item.slug}`}>
              {item.name}
            </Link>
          ))}
        </div>
      )}

      {articles.length > 0 ? (
        <ArticleList articles={articles} />
      ) : (
        <p>Контент тимчасово недоступний. Спробуй оновити сторінку пізніше.</p>
      )}

      <div>
        {page > 1 && (
          <Link href={homeHref(page - 1)}>
            Попередня сторінка списку ({page - 1} з {totalPages})
          </Link>
        )}
        <span>
          Сторінка {meta.page} з {totalPages}
        </span>
        {page < meta.totalPages && (
          <Link href={homeHref(page + 1)}>
            Наступна сторінка списку ({page + 1} з {totalPages})
          </Link>
        )}
      </div>
    </Container>
  );
}