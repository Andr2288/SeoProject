'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';

type Props = {
  threshold?: number;
  pageType: string;
  pageSlug?: string;
};

export default function ScrollDepthTracker({ threshold = 75, pageType, pageSlug }: Props) {
  const firedRef = useRef(false);

  useEffect(() => {
    function onScroll() {
      if (firedRef.current) return;

      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const percent = (window.scrollY / scrollable) * 100;
      if (percent < threshold) return;

      firedRef.current = true;
      trackEvent('scroll_75', {
        page_type: pageType,
        page_slug: pageSlug || '',
        threshold,
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [pageSlug, pageType, threshold]);

  return null;
}

