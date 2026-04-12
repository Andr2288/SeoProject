export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
};

export type Author = {
  id: number;
  name: string;
  slug: string;
  bio?: string | null;
  avatar_url?: string | null;
};

export type Tag = {
  id: number;
  name: string;
  slug: string;
};

export type ArticleCard = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  cover_url?: string | null;
  published_at?: string | null;
  views?: number;
  category?: Category | null;
  author?: Author | null;
};

export type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  cover_url?: string | null;
  published_at?: string | null;
  views?: number;
  meta_title?: string | null;
  meta_description?: string | null;
  category?: Category | null;
  author?: Author | null;
  tags?: Tag[];
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
};

export type SingleResponse<T> = {
  data: T;
};

export type CategoryArticlesResponse = {
  data: {
    category: Category;
    articles: ArticleCard[];
  };
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
};

export type AuthorArticlesResponse = {
  data: {
    author: Author;
    articles: ArticleCard[];
  };
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
};

export type TagArticlesResponse = {
  data: {
    tag: Tag;
    articles: ArticleCard[];
  };
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
};