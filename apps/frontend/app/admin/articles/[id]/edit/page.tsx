'use client';

import { useEffect, useState } from 'react';
import Container from '@/components/layout/container';
import AdminGuard from '@/components/admin/admin-guard';
import AdminShell from '@/components/admin/admin-shell';
import ArticleForm from '@/components/admin/article-form';
import {
  deleteAdminArticle,
  getAdminArticleById,
  getAdminMeta,
  updateAdminArticle,
  type AdminArticleResponse,
  type AdminMetaResponse,
} from '@/lib/admin-api';
import { useParams, useRouter } from 'next/navigation';

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const articleId = Number(params.id);

  const [meta, setMeta] = useState<AdminMetaResponse['data'] | null>(null);
  const [article, setArticle] = useState<AdminArticleResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadPage() {
      try {
        const [metaRes, articleRes] = await Promise.all([
          getAdminMeta(),
          getAdminArticleById(articleId),
        ]);

        setMeta(metaRes.data);
        setArticle(articleRes.data);
      } catch (err) {
        setPageError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setLoading(false);
      }
    }

    if (articleId) {
      loadPage();
    }
  }, [articleId]);

  async function handleUpdate(payload: Parameters<typeof updateAdminArticle>[1]) {
    await updateAdminArticle(articleId, payload);
    router.refresh();
  }

  async function handleDelete() {
    const confirmed = window.confirm('Точно видалити статтю?');

    if (!confirmed) return;

    try {
      setDeleting(true);
      await deleteAdminArticle(articleId);
      router.push('/admin/articles');
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="py-10">
      <Container>
        <AdminGuard>
          <AdminShell>
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Редагування статті</h1>
                  <p className="text-sm text-gray-500">
                    Оновлення контенту, SEO та тегів.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-xl border border-red-300 px-4 py-2 text-sm text-red-600 disabled:opacity-60"
                >
                  {deleting ? 'Видалення...' : 'Видалити'}
                </button>
              </div>

              {loading ? (
                <div className="rounded-2xl border bg-gray-50 p-8 text-center text-gray-500">
                  Завантаження...
                </div>
              ) : pageError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  {pageError}
                </div>
              ) : meta && article ? (
                <ArticleForm
                  meta={meta}
                  initialValues={article}
                  submitLabel="Зберегти зміни"
                  onSubmit={handleUpdate}
                />
              ) : null}
            </div>
          </AdminShell>
        </AdminGuard>
      </Container>
    </main>
  );
}