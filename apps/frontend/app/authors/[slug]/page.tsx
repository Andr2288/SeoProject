import { getAuthorArticles } from '@/lib/api';
import Container from '@/components/layout/container';
import ArticleList from '@/components/article/article-list';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

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
    const res = await getAuthorArticles(slug, { page: 1, perPage: 9 });
    const author = res.data.author;

    return {
      title: `${author.name} | IT Blog MVP`,
      description: author.bio || `Статті автора ${author.name}`,
      alternates: {
        canonical: `/authors/${author.slug}`,
      },
    };
  } catch {
    return {
      title: 'Автора не знайдено',
    };
  }
}

export default async function AuthorPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = (await searchParams) || {};
  const page = Number(query.page || 1);

  let result;

  try {
    result = await getAuthorArticles(slug, { page, perPage: 9 });
  } catch {
    notFound();
  }

  const { author, articles } = result.data;
  const meta = result.meta;

  return (
    <main className="py-10">
      <Container>
        <section className="mb-8 rounded-3xl border bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            {author.avatar_url && (
              <div className="relative h-24 w-24 overflow-hidden rounded-full">
                <Image
                  src={author.avatar_url}
                  alt={author.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
            )}

            <div>
              <p className="mb-2 text-sm text-gray-500">Автор</p>
              <h1 className="mb-2 text-3xl font-bold">{author.name}</h1>
              {author.bio && (
                <p className="max-w-2xl text-gray-600">{author.bio}</p>
              )}
            </div>
          </div>
        </section>

        <ArticleList articles={articles} />

        <section className="mt-10 flex items-center justify-center gap-3">
          {page > 1 && (
            <Link
              href={`/authors/${slug}?page=${page - 1}`}
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
              href={`/authors/${slug}?page=${page + 1}`}
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