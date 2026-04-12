'use client';

import { FormEvent, useMemo, useState } from 'react';
import { AdminArticlePayload, AdminMetaResponse } from '@/lib/admin-api';

type Props = {
  meta: AdminMetaResponse['data'];
  initialValues?: Partial<AdminArticlePayload>;
  submitLabel: string;
  onSubmit: (payload: AdminArticlePayload) => Promise<void>;
};

export default function ArticleForm({
  meta,
  initialValues,
  submitLabel,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [slug, setSlug] = useState(initialValues?.slug || '');
  const [excerpt, setExcerpt] = useState(initialValues?.excerpt || '');
  const [content, setContent] = useState(initialValues?.content || '');
  const [coverUrl, setCoverUrl] = useState(initialValues?.cover_url || '');
  const [authorId, setAuthorId] = useState<string>(
    initialValues?.author_id ? String(initialValues.author_id) : ''
  );
  const [categoryId, setCategoryId] = useState<string>(
    initialValues?.category_id ? String(initialValues.category_id) : ''
  );
  const [status, setStatus] = useState<'draft' | 'published'>(
    initialValues?.status || 'draft'
  );
  const [metaTitle, setMetaTitle] = useState(initialValues?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(
    initialValues?.meta_description || ''
  );
  const [publishedAt, setPublishedAt] = useState(
    initialValues?.published_at
      ? new Date(initialValues.published_at).toISOString().slice(0, 16)
      : ''
  );
  const [tagIds, setTagIds] = useState<number[]>(initialValues?.tag_ids || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const slugPreview = useMemo(() => {
    if (slug.trim()) return slug.trim();

    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9а-яіїєґ\s-]/gi, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }, [slug, title]);

  function toggleTag(tagId: number) {
    setTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit({
        title: title.trim(),
        slug: slugPreview,
        excerpt: excerpt.trim(),
        content: content.trim(),
        cover_url: coverUrl.trim(),
        author_id: authorId ? Number(authorId) : null,
        category_id: categoryId ? Number(categoryId) : null,
        status,
        meta_title: metaTitle.trim(),
        meta_description: metaDescription.trim(),
        published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
        tag_ids: tagIds,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submit failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Заголовок *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-11 w-full rounded-xl border px-4 outline-none focus:border-black"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Slug *</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Якщо пусто — згенерується з title"
            className="h-11 w-full rounded-xl border px-4 outline-none focus:border-black"
          />
          <p className="mt-2 text-xs text-gray-500">Preview: {slugPreview}</p>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Короткий опис</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Контент (HTML) *</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          className="w-full rounded-xl border px-4 py-3 font-mono text-sm outline-none focus:border-black"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Cover URL</label>
        <input
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
          className="h-11 w-full rounded-xl border px-4 outline-none focus:border-black"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium">Автор</label>
          <select
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            className="h-11 w-full rounded-xl border px-4 outline-none focus:border-black"
          >
            <option value="">Оберіть автора</option>
            {meta.authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Категорія</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="h-11 w-full rounded-xl border px-4 outline-none focus:border-black"
          >
            <option value="">Оберіть категорію</option>
            {meta.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Статус</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
            className="h-11 w-full rounded-xl border px-4 outline-none focus:border-black"
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Meta title</label>
          <input
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="h-11 w-full rounded-xl border px-4 outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Дата публікації</label>
          <input
            type="datetime-local"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            className="h-11 w-full rounded-xl border px-4 outline-none focus:border-black"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Meta description</label>
        <textarea
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          rows={3}
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
        />
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium">Теги</label>
        <div className="flex flex-wrap gap-2">
          {meta.tags.map((tag) => {
            const active = tagIds.includes(tag.id);

            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`rounded-full border px-3 py-2 text-sm ${
                  active ? 'bg-black text-white border-black' : 'bg-white'
                }`}
              >
                #{tag.name}
              </button>
            );
          })}
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="h-11 rounded-xl bg-black px-5 text-white disabled:opacity-60"
      >
        {loading ? 'Збереження...' : submitLabel}
      </button>
    </form>
  );
}