import { ArticleCard as ArticleCardType } from '@/lib/types';
import ArticleCard from './article-card';

type Props = {
  articles: ArticleCardType[];
};

export default function ArticleList({ articles }: Props) {
  if (!articles.length) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-gray-500">
        Немає статей.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}