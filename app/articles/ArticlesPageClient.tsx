"use client";

import { usePagedQuery } from "@/app/work/model/usePagedQuery";
import { PublicationsSection } from "@/components/content/PublicationsSection";
import {
  useApiArticlesListQuery,
  type PaginatedArticleListListRead,
} from "@/services/generatedApi";

interface ArticlesPageClientProps {
  /** Первая страница с сервера. */
  initialPage?: PaginatedArticleListListRead;
}

export default function ArticlesPageClient({ initialPage }: ArticlesPageClientProps) {
  const { items, hasMore, isLoading, isLoadingMore, isError, loadMore, retry } = usePagedQuery(
    useApiArticlesListQuery,
    {},
    initialPage,
  );

  return (
    <PublicationsSection
      title="Статьи"
      basePath="/articles"
      emptyText="Статьи пока не добавлены"
      errorText="Ошибка при загрузке статей"
      showViews
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
