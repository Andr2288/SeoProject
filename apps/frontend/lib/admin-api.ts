const API_URL = process.env.NEXT_PUBLIC_API_URL?.trim();

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

function getAdminApiBase() {
  return API_URL.replace(/\/$/, '');
}

async function adminFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const base = getAdminApiBase();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${base}/api${normalizedPath}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      'x-admin-request': '1',
      ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options?.headers || {}),
    },
    cache: 'no-store',
    credentials: 'include',
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

export type LoginResponse = {
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      isAdmin: boolean;
    };
  };
};

export type MeResponse = {
  data: {
    user: {
      id: number;
      email: string;
      isAdmin: boolean;
    };
  };
};

export type AdminMetaResponse = {
  data: {
    authors: Array<{ id: number; name: string; slug: string }>;
    categories: Array<{ id: number; name: string; slug: string }>;
    tags: Array<{ id: number; name: string; slug: string }>;
  };
};

export type AdminArticleResponse = {
  data: {
    id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    cover_url?: string | null;
    author_id?: number | null;
    category_id?: number | null;
    status: 'draft' | 'published';
    views?: number;
    meta_title?: string | null;
    meta_description?: string | null;
    published_at?: string | null;
    tag_ids: number[];
  };
};

export type AdminArticlePayload = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  cover_url?: string | null;
  author_id?: number | null;
  category_id?: number | null;
  status: 'draft' | 'published';
  meta_title?: string | null;
  meta_description?: string | null;
  published_at?: string | null;
  tag_ids: number[];
};

export async function loginAdmin(email: string, password: string) {
  return adminFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function logoutAdmin() {
  return adminFetch<{ data: { message: string } }>('/auth/logout', {
    method: 'POST',
  });
}

export async function getMe() {
  return adminFetch<MeResponse>('/auth/me');
}

export async function getAdminArticles(params?: {
  page?: number;
  perPage?: number;
}) {
  const search = new URLSearchParams();

  if (params?.page) search.set('page', String(params.page));
  if (params?.perPage) search.set('perPage', String(params.perPage));

  const query = search.toString() ? `?${search.toString()}` : '';

  return adminFetch<{
    data: Array<{
      id: number;
      title: string;
      slug: string;
      status: string;
      views: number;
      published_at?: string | null;
      created_at?: string | null;
      category?: { id: number; name: string; slug: string } | null;
      author?: { id: number; name: string; slug: string } | null;
    }>;
    meta: {
      total: number;
      page: number;
      perPage: number;
      totalPages: number;
    };
  }>(`/admin/articles${query}`);
}

export async function getAdminMeta() {
  return adminFetch<AdminMetaResponse>('/admin/meta');
}

export async function getAdminArticleById(id: number) {
  return adminFetch<AdminArticleResponse>(`/admin/articles/${id}`);
}

export async function createAdminArticle(payload: AdminArticlePayload) {
  return adminFetch<{ data: { id: number; message: string } }>('/admin/articles', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateAdminArticle(id: number, payload: AdminArticlePayload) {
  return adminFetch<{ data: { id: number; message: string } }>(
    `/admin/articles/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    }
  );
}

export async function deleteAdminArticle(id: number) {
  return adminFetch<{ data: { id: number; message: string } }>(
    `/admin/articles/${id}`,
    {
      method: 'DELETE',
    }
  );
}