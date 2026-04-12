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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, tags, authors] = await Promise.all([
    fetchArticles(),
    fetchCategories(),
    fetchTags(),
    fetchAuthors(),
  ]);

  const routes: MetadataRoute.Sitemap = [];

  // home
  routes.push({
    url: SITE_URL,
    lastModified: new Date(),
  });

  // articles
  articles.forEach((article) => {
    routes.push({
      url: `${SITE_URL}/articles/${article.slug}`,
      lastModified: article.published_at
        ? new Date(article.published_at)
        : new Date(),
    });
  });

  // categories
  categories.forEach((cat) => {
    routes.push({
      url: `${SITE_URL}/categories/${cat.slug}`,
      lastModified: new Date(),
    });
  });

  // tags
  tags.forEach((tag) => {
    routes.push({
      url: `${SITE_URL}/tags/${tag.slug}`,
      lastModified: new Date(),
    });
  });

  // authors
  authors.forEach((author) => {
    routes.push({
      url: `${SITE_URL}/authors/${author.slug}`,
      lastModified: new Date(),
    });
  });

  return routes;
}