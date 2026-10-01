"use client";

import { usePagedQuery } from "@/app/work/model/usePagedQuery";
import { PublicationsSection } from "@/components/content/PublicationsSection";
import {
  useApiNewsListQuery,
  type PaginatedNewsListListRead,
} from "@/services/generatedApi";

interface NewsPageClientProps {
  /** Первая страница с сервера. */
  initialPage?: PaginatedNewsListListRead;
}

export default function NewsPageClient({ initialPage }: NewsPageClientProps) {
  const { items, hasMore, isLoading, isLoadingMore, isError, loadMore, retry } = usePagedQuery(
    useApiNewsListQuery,
    {},
    initialPage,
  );

  return (
    <PublicationsSection
      title="Новости"
      basePath="/news"
      emptyText="Новости пока не добавлены"
      errorText="Ошибка при загрузке новостей"
      items={items}
      isLoading={isLoading}
      isError={isError}
      hasMore={hasMore}
      isLoadingMore={isLoadingMore}
      onLoadMore={loadMore}
      onRetry={retry}
    />
  );
}
