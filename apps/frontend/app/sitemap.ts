import type { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function fetchArticles() {
  const res = await fetch(`${API_URL}/articles?perPage=100`, {
    next: { revalidate: 3600 },
  });

  const data = await res.json();
  return data.data || [];
}

async function fetchCategories() {
  const res = await fetch(`${API_URL}/categories`, {
    next: { revalidate: 3600 },
  });

  const data = await res.json();
  return data.data || [];
}

async function fetchTags() {
  const res = await fetch(`${API_URL}/tags`, {
    next: { revalidate: 3600 },
  });

  const data = await res.json();
  return data.data || [];
}

async function fetchAuthors() {
  const res = await fetch(`${API_URL}/authors`, {
    next: { revalidate: 3600 },
  });

  const data = await res.json();
  return data.data || [];
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
  articles.forEach((article: any) => {
    routes.push({
      url: `${SITE_URL}/articles/${article.slug}`,
      lastModified: article.published_at
        ? new Date(article.published_at)
        : new Date(),
    });
  });

  // categories
  categories.forEach((cat: any) => {
    routes.push({
      url: `${SITE_URL}/categories/${cat.slug}`,
      lastModified: new Date(),
    });
  });

  // tags
  tags.forEach((tag: any) => {
    routes.push({
      url: `${SITE_URL}/tags/${tag.slug}`,
      lastModified: new Date(),
    });
  });

  // authors
  authors.forEach((author: any) => {
    routes.push({
      url: `${SITE_URL}/authors/${author.slug}`,
      lastModified: new Date(),
    });
  });

  return routes;
}