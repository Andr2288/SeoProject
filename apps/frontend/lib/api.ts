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

function getApiBase(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }

  return apiUrl.replace(/\/$/, '');
}

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const isGet = !options?.method || options.method === 'GET';
  const base = getApiBase();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${base}/api${normalizedPath}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options?.headers || {}),
    },
    ...(isGet ? { next: { revalidate: 60 } } : {}),
  });

  const contentType = res.headers.get('content-type') || '';
  const raw = await res.text();

  if (!res.ok) {
    throw new Error(
      `Request failed: ${res.status} ${res.statusText}; url=${url}; content-type=${contentType}; body=${raw.slice(0, 300)}`
    );
  }

  if (!contentType.includes('application/json')) {
    throw new Error(
      `Expected JSON from ${url}, got ${contentType}; body=${raw.slice(0, 300)}`
    );
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(
      `Invalid JSON from ${url}; content-type=${contentType}; body=${raw.slice(0, 300)}`
    );
  }
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