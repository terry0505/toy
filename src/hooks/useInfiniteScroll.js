import { useEffect, useRef } from "react";

export default function useInfiniteScroll({
  hasMore,
  loading,
  onLoadMore,
  observeTarget
}) {
  const observerRef = useRef(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (loading || !hasMore) return;

    const callback = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isFetchingRef.current) {
        isFetchingRef.current = true;
        onLoadMore();

        setTimeout(() => {
          isFetchingRef.current = false;
        }, 300);
      }
    };

    const observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0
    });

    if (observeTarget?.current) {
      observer.observe(observeTarget.current);
    }

    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading, observeTarget, onLoadMore]);
}
