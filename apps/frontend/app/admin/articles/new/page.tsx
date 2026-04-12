'use client';

import { useEffect, useState } from 'react';
import Container from '@/components/layout/container';
import AdminGuard from '@/components/admin/admin-guard';
import AdminShell from '@/components/admin/admin-shell';
import ArticleForm from '@/components/admin/article-form';
import {
  createAdminArticle,
  getAdminMeta,
  type AdminArticlePayload,
  type AdminMetaResponse,
} from '@/lib/admin-api';
import { useRouter } from 'next/navigation';

export default function NewArticlePage() {
  const router = useRouter();
  const [meta, setMeta] = useState<AdminMetaResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [formVersion, setFormVersion] = useState(0);

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

  const templateInitialValues: Partial<AdminArticlePayload> | undefined = meta
    ? {
        title: 'Як підготувати статтю для SEO: простий чекліст',
        slug: 'yak-pidgotuvaty-stattyu-dlya-seo-prostyy-cheklist',
        excerpt:
          'Покроковий приклад оформлення статті: структура, ключові слова, внутрішні посилання та базова оптимізація для пошуку.',
        content: `<h2>Вступ</h2>
<p>У цьому прикладі показано базову структуру SEO-статті. Заміни текст на свій, але залиш логіку побудови матеріалу.</p>

<h2>1. Пропиши мету сторінки</h2>
<p>Коротко опиши, на який пошуковий запит відповідає стаття і яку користь отримає читач.</p>

<h2>2. Використай підзаголовки H2/H3</h2>
<p>Кожен блок має розкривати окремий підпункт теми. Додавай списки та приклади, де це доречно.</p>

<h2>3. Додай внутрішні посилання</h2>
<p>Посилайся на 2-3 релевантні матеріали блогу, щоб покращити навігацію та поведінкові фактори.</p>

<h2>Висновок</h2>
<p>Підсумуй головну думку в 2-3 реченнях і додай заклик до дії.</p>`,
        cover_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
        author_id: meta.authors[0]?.id ?? null,
        category_id: meta.categories[0]?.id ?? null,
        status: 'draft',
        meta_title: 'SEO-чекліст для нової статті: приклад оформлення',
        meta_description:
          'Готовий приклад заповнення статті в адмінці: структура контенту, SEO-мета поля, slug, теги та дата публікації.',
        published_at: new Date().toISOString(),
        tag_ids: meta.tags[0] ? [meta.tags[0].id] : [],
      }
    : undefined;

  return (
    <main className="py-10">
      <Container>
        <AdminGuard>
          <AdminShell>
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="mb-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h1 className="text-3xl font-bold">Нова стаття</h1>
                  {meta ? (
                    <button
                      type="button"
                      onClick={() => setFormVersion((prev) => prev + 1)}
                      className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Скинути до шаблону
                    </button>
                  ) : null}
                </div>
                <p className="text-sm text-gray-500">Створи нову статтю для блогу.</p>
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
                  key={formVersion}
                  meta={meta}
                  initialValues={templateInitialValues}
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