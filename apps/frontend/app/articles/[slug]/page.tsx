import { getArticleBySlug, getRelatedArticles } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '@/components/layout/container';
import Image from 'next/image';
import Link from 'next/link';
import ArticleList from '@/components/article/article-list';
import ArticleBreadcrumbs from '@/components/article/article-breadcrumbs';
import ArticleAuthor from '@/components/article/article-author';
import ViewCounter from '@/components/article/view-counter';
import JsonLd from '@/components/seo/json-ld';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

function absoluteAssetUrl(url: string | null | undefined, origin: string): string | undefined {
  if (!url?.trim()) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  const base = origin.replace(/\/$/, '');
  return `${base}/${url.replace(/^\//, '')}`;
}

function isoOrUndefined(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

function buildArticleJsonLd(article: {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  meta_description?: string | null;
  cover_url?: string | null;
  published_at?: string | null;
  updated_at?: string | null;
  category?: { name: string; slug: string } | null;
  author?: { name: string; slug: string } | null;
}) {
  const origin = siteUrl.replace(/\/$/, '');
  const pageUrl = `${origin}/articles/${article.slug}`;
  const description =
    article.meta_description?.trim() ||
    article.excerpt?.trim() ||
    'Стаття блогу IT Blog MVP українською.';

  const imageUrl = absoluteAssetUrl(article.cover_url, origin);
  const datePublished = isoOrUndefined(article.published_at);
  const dateModified = isoOrUndefined(article.updated_at) || datePublished;

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Organization',
      '@id': `${origin}/#organization`,
      name: 'IT Blog MVP',
      url: `${origin}/`,
      logo: {
        '@type': 'ImageObject',
        url: `${origin}/window.svg`,
      },
    },
    {
      '@type': 'Article',
      '@id': `${pageUrl}#article`,
      headline: article.title,
      description,
      url: pageUrl,
      inLanguage: 'uk-UA',
      isPartOf: { '@id': `${origin}/#website` },
      author: article.author
        ? {
            '@type': 'Person',
            name: article.author.name,
            url: `${origin}/authors/${article.author.slug}`,
          }
        : { '@type': 'Organization', name: 'IT Blog MVP' },
      publisher: { '@id': `${origin}/#organization` },
      ...(datePublished ? { datePublished } : {}),
      ...(dateModified ? { dateModified } : {}),
      ...(imageUrl
        ? {
            image: {
              '@type': 'ImageObject',
              url: imageUrl,
            },
          }
        : {}),
    },
    {
      '@type': 'WebSite',
      '@id': `${origin}/#website`,
      url: `${origin}/`,
      name: 'IT Blog MVP',
      publisher: { '@id': `${origin}/#organization` },
    },
  ];

  const crumbs: { name: string; item: string }[] = [
    { name: 'Головна', item: `${origin}/` },
  ];
  if (article.category?.slug) {
    crumbs.push({
      name: article.category.name,
      item: `${origin}/categories/${article.category.slug}`,
    });
  }
  crumbs.push({ name: article.title, item: pageUrl });

  graph.push({
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.item,
    })),
  });

  return { '@context': 'https://schema.org', '@graph': graph };
}

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

  const articleJsonLd = buildArticleJsonLd(article);

  return (
    <main className="py-10">
      <JsonLd data={articleJsonLd} />
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
            <ArticleBreadcrumbs
              category={article.category}
              articleTitle={article.title}
            />

            <div className="mb-4 flex flex-wrap gap-2 text-sm text-gray-500">
              {article.category?.slug && (
                <Link
                  href={`/categories/${article.category.slug}`}
                  className="rounded-full bg-gray-100 px-3 py-1 hover:bg-gray-200"
                >
                  {article.category.name}
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

            {article.author?.slug ? (
              <ArticleAuthor
                author={article.author}
                publishedAt={article.published_at}
                updatedAt={article.updated_at}
              />
            ) : null}
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