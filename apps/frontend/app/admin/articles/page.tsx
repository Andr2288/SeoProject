'use client';

import { useEffect, useState } from 'react';
import Container from '@/components/layout/container';
import AdminGuard from '@/components/admin/admin-guard';
import AdminShell from '@/components/admin/admin-shell';
import { getAdminArticles } from '@/lib/admin-api';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

type AdminArticle = {
  id: number;
  title: string;
  slug: string;
  status: string;
  views: number;
  published_at?: string | null;
  created_at?: string | null;
  category?: { id: number; name: string; slug: string } | null;
  author?: { id: number; name: string; slug: string } | null;
};

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await getAdminArticles({ page: 1, perPage: 20 });
        setArticles(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  return (
    <main className="py-10">
      <Container>
        <AdminGuard>
          <AdminShell>
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Статті</h1>
                  <p className="text-sm text-gray-500">
                    Список усіх статей, включно з чернетками.
                  </p>
                </div>

                <Link
                  href="/admin/articles/new"
                  className="rounded-xl bg-black px-4 py-2 text-sm text-white"
                >
                  + Нова стаття
                </Link>
              </div>

              {loading ? (
                <div className="rounded-2xl border bg-gray-50 p-8 text-center text-gray-500">
                  Завантаження...
                </div>
              ) : error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              ) : !articles.length ? (
                <div className="rounded-2xl border bg-gray-50 p-8 text-center text-gray-500">
                  Статей поки немає.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-separate border-spacing-y-2">
                    <thead>
                      <tr className="text-left text-sm text-gray-500">
                        <th className="px-3 py-2">Назва</th>
                        <th className="px-3 py-2">Статус</th>
                        <th className="px-3 py-2">Категорія</th>
                        <th className="px-3 py-2">Автор</th>
                        <th className="px-3 py-2">Перегляди</th>
                        <th className="px-3 py-2">Дата</th>
                        <th className="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.map((article) => (
                        <tr key={article.id} className="rounded-2xl border bg-gray-50 text-sm">
                          <td className="px-3 py-3">
                            <div className="font-medium">{article.title}</div>
                            <div className="text-xs text-gray-500">{article.slug}</div>
                          </td>
                          <td className="px-3 py-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs ${
                                article.status === 'published'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {article.status}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            {article.category?.name || '—'}
                          </td>
                          <td className="px-3 py-3">
                            {article.author?.name || '—'}
                          </td>
                          <td className="px-3 py-3">{article.views || 0}</td>
                          <td className="px-3 py-3">
                            {formatDate(article.published_at || article.created_at)}
                          </td>
                          <td className="px-3 py-3">
                            <Link
                              href={`/admin/articles/${article.id}/edit`}
                              className="rounded-lg border px-3 py-2 text-xs"
                            >
                              Редагувати
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </AdminShell>
        </AdminGuard>
      </Container>
    </main>
  );
}