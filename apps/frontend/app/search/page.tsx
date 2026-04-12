'use client';

import { useEffect, useState } from 'react';
import { searchArticles } from '@/lib/api';
import { ArticleCard as ArticleCardType } from '@/lib/types';
import Container from '@/components/layout/container';
import ArticleList from '@/components/article/article-list';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get('q') || '';

  const [inputValue, setInputValue] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [articles, setArticles] = useState<ArticleCardType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    setInputValue(initialQuery);
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    async function runSearch() {
      if (!query.trim()) {
        setArticles([]);
        setSearched(false);
        return;
      }

      setLoading(true);

      try {
        const res = await searchArticles(query, { page: 1, perPage: 12 });
        setArticles(res.data);
        setSearched(true);
      } catch {
        setArticles([]);
        setSearched(true);
      } finally {
        setLoading(false);
      }
    }

    runSearch();
  }, [query]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = inputValue.trim();

    if (!trimmed) {
      router.push('/search');
      setQuery('');
      return;
    }

    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    setQuery(trimmed);
  }

  return (
    <main className="py-10">
      <Container>
        <section className="mb-8">
          <h1 className="mb-3 text-4xl font-bold">Пошук</h1>
          <p className="text-gray-600">
            Шукайте статті за назвою, описом або вмістом.
          </p>
        </section>

        <section className="mb-8 rounded-3xl border bg-white p-5 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Наприклад: nextjs, seo, express..."
              className="h-12 flex-1 rounded-xl border px-4 outline-none focus:border-black"
            />
            <button
              type="submit"
              className="h-12 rounded-xl bg-black px-5 text-white"
            >
              Знайти
            </button>
          </form>
        </section>

        {loading ? (
          <div className="rounded-2xl border bg-white p-8 text-center text-gray-500">
            Завантаження...
          </div>
        ) : searched ? (
          <>
            <div className="mb-5 text-sm text-gray-500">
              Результатів: {articles.length}
            </div>
            <ArticleList articles={articles} />
          </>
        ) : (
          <div className="rounded-2xl border bg-white p-8 text-center text-gray-500">
            Введи запит для пошуку статей.
          </div>
        )}
      </Container>
    </main>
  );
}