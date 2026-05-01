import type { MetadataRoute } from 'next';
import type { ArticleCard, Author, Category, Tag } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function fetchData<T>(path: string): Promise<T[]> {
  if (!API_URL) return [];

  const res = await fetch(`${API_URL}${path}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const payload = await res.json() as { data?: T[] };
  return payload.data || [];
}

async function fetchArticles() {
  return fetchData<ArticleCard>('/articles?perPage=100');
}

async function fetchCategories() {
  return fetchData<Category>('/categories');
}

async function fetchTags() {
  return fetchData<Tag>('/tags');
}

async function fetchAuthors() {
  return fetchData<Author>('/authors');
}

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, '');
}

function hasValidSlug(value: string | null | undefined): value is string {
  return Boolean(value && value.trim());
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, tags, authors] = await Promise.all([
    fetchArticles(),
    fetchCategories(),
    fetchTags(),
    fetchAuthors(),
  ]);

  const routes: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();
  const base = normalizeBaseUrl(SITE_URL);

  const pushRoute = (url: string, lastModified: Date) => {
    // Keep sitemap canonical and duplicate-free.
    if (seen.has(url)) return;
    seen.add(url);
    routes.push({ url, lastModified });
  };

  // home
  pushRoute(base, new Date());

  pushRoute(`${base}/about`, new Date());

  // articles
  articles.forEach((article) => {
    if (!hasValidSlug(article.slug)) return;
    pushRoute(
      `${base}/articles/${article.slug}`,
      article.published_at ? new Date(article.published_at) : new Date()
    );
  });

  // categories
  categories.forEach((cat) => {
    if (!hasValidSlug(cat.slug)) return;
    pushRoute(`${base}/categories/${cat.slug}`, new Date());
  });

  // tags
  tags.forEach((tag) => {
    if (!hasValidSlug(tag.slug)) return;
    pushRoute(`${base}/tags/${tag.slug}`, new Date());
  });

  // authors
  authors.forEach((author) => {
    if (!hasValidSlug(author.slug)) return;
    pushRoute(`${base}/authors/${author.slug}`, new Date());
  });

  return routes;
}