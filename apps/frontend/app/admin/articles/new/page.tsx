'use client';

import { useEffect, useState } from 'react';
import Container from '@/components/layout/container';
import AdminGuard from '@/components/admin/admin-guard';
import AdminShell from '@/components/admin/admin-shell';
import ArticleForm from '@/components/admin/article-form';
import { createAdminArticle, getAdminMeta, type AdminMetaResponse } from '@/lib/admin-api';
import { useRouter } from 'next/navigation';

export default function NewArticlePage() {
  const router = useRouter();
  const [meta, setMeta] = useState<AdminMetaResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  useEffect(() => {
    async function loadMeta() {
      try {
        const res = await getAdminMeta();
        setMeta(res.data);
      } catch (err) {
        setPageError(err instanceof Error ? err.message : 'Failed to load meta');
      } finally {
        setLoading(false);
      }
    }

    loadMeta();
  }, []);

  async function handleCreate(payload: Parameters<typeof createAdminArticle>[0]) {
    const res = await createAdminArticle(payload);
    router.push(`/admin/articles/${res.data.id}/edit`);
  }

  return (
    <main className="py-10">
      <Container>
        <AdminGuard>
          <AdminShell>
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h1 className="text-3xl font-bold">Нова стаття</h1>
                <p className="text-sm text-gray-500">
                  Створи нову статтю для блогу.
                </p>
              </div>

              {loading ? (
                <div className="rounded-2xl border bg-gray-50 p-8 text-center text-gray-500">
                  Завантаження...
                </div>
              ) : pageError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  {pageError}
                </div>
              ) : meta ? (
                <ArticleForm
                  meta={meta}
                  submitLabel="Створити статтю"
                  onSubmit={handleCreate}
                />
              ) : null}
            </div>
          </AdminShell>
        </AdminGuard>
      </Container>
    </main>
  );
}