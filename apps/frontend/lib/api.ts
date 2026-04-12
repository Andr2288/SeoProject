import {
  Article,
  ArticleCard,
  Author,
  AuthorArticlesResponse,
  Category,
  CategoryArticlesResponse,
  PaginatedResponse,
  SingleResponse,
  Tag,
  TagArticlesResponse,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const isGet = !options?.method || options.method === 'GET';

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...(isGet ? { next: { revalidate: 60 } } : {}),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || 'Request failed');
  }

  return data as T;
}

export async function getArticles(params?: {
  page?: number;
  perPage?: number;
  category?: string;
}) {
  const search = new URLSearchParams();

  if (params?.page) search.set('page', String(params.page));
  if (params?.perPage) search.set('perPage', String(params.perPage));
  if (params?.category) search.set('category', params.category);

  const query = search.toString() ? `?${search.toString()}` : '';

  return fetchJson<PaginatedResponse<ArticleCard>>(`/articles${query}`);
}

export async function getArticleBySlug(slug: string) {
  return fetchJson<SingleResponse<Article>>(`/articles/${slug}`);
}

export async function getRelatedArticles(slug: string) {
  return fetchJson<SingleResponse<ArticleCard[]>>(`/articles/${slug}/related`);
}

export async function incrementArticleViews(id: number) {
  return fetchJson<SingleResponse<{ id: number; views: number }>>(
    `/articles/${id}/view`,
    {
      method: 'POST',
      cache: 'no-store',
    }
  );
}

export async function getCategories() {
  return fetchJson<SingleResponse<Category[]>>(`/categories`);
}

export async function getCategoryArticles(
  slug: string,
  params?: { page?: number; perPage?: number }
) {
  const search = new URLSearchParams();

  if (params?.page) search.set('page', String(params.page));
  if (params?.perPage) search.set('perPage', String(params.perPage));

  const query = search.toString() ? `?${search.toString()}` : '';

  return fetchJson<CategoryArticlesResponse>(`/categories/${slug}/articles${query}`);
}

export async function getAuthor(slug: string) {
  return fetchJson<SingleResponse<Author>>(`/authors/${slug}`);
}

export async function getAuthorArticles(
  slug: string,
  params?: { page?: number; perPage?: number }
) {
  const search = new URLSearchParams();

  if (params?.page) search.set('page', String(params.page));
  if (params?.perPage) search.set('perPage', String(params.perPage));

  const query = search.toString() ? `?${search.toString()}` : '';

  return fetchJson<AuthorArticlesResponse>(`/authors/${slug}/articles${query}`);
}

export async function getTags() {
  return fetchJson<SingleResponse<Tag[]>>(`/tags`);
}

export async function getTagArticles(
  slug: string,
  params?: { page?: number; perPage?: number }
) {
  const search = new URLSearchParams();

  if (params?.page) search.set('page', String(params.page));
  if (params?.perPage) search.set('perPage', String(params.perPage));

  const query = search.toString() ? `?${search.toString()}` : '';

  return fetchJson<TagArticlesResponse>(`/tags/${slug}/articles${query}`);
}

export async function searchArticles(
  q: string,
  params?: { page?: number; perPage?: number }
) {
  const search = new URLSearchParams();

  search.set('q', q);
  if (params?.page) search.set('page', String(params.page));
  if (params?.perPage) search.set('perPage', String(params.perPage));

  return fetchJson<PaginatedResponse<ArticleCard>>(`/search?${search.toString()}`);
}