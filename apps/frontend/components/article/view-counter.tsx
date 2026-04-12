'use client';

import { useEffect } from 'react';
import { incrementArticleViews } from '@/lib/api';

type Props = {
  articleId: number;
};

export default function ViewCounter({ articleId }: Props) {
  useEffect(() => {
    incrementArticleViews(articleId).catch(() => {});
  }, [articleId]);

  return null;
}