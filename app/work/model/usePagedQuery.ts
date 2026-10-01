// app/work/model/usePagedQuery.ts
"use client";

import { useEffect, useMemo, useState } from "react";

interface PageOf<TItem> {
  results: TItem[];
  next?: string | null;
}

interface PagedQueryResult<TItem> {
  currentData?: PageOf<TItem>;
  isLoading: boolean;
  isFetching: boolean;
}

interface LoadedPages<TItem> {
  key: string;
  byPage: Record<number, TItem[]>;
  next: string | null;
}

/**
 * Постраничная подгрузка «Показать ещё» поверх RTK Query-хука списка.
 *
 * Номер страницы привязан к сериализованным аргументам запроса: при смене
 * поиска или фильтров список начинается с первой страницы без лишнего
 * запроса. Результаты хранятся по страницам, поэтому повторная загрузка
 * текущей страницы после инвалидации кэша не дублирует элементы.
 */
export function usePagedQuery<TArgs extends object, TItem>(
  useQuery: (args: TArgs & { page: number }) => PagedQueryResult<TItem>,
  args: TArgs,
) {
  const argsKey = JSON.stringify(args);
  const [paging, setPaging] = useState({ key: argsKey, page: 1 });
  const page = paging.key === argsKey ? paging.page : 1;

  const { currentData, isLoading, isFetching } = useQuery({ ...args, page });

  // Ранее загруженные страницы текущего набора аргументов
  const [loaded, setLoaded] = useState<LoadedPages<TItem>>({
    key: argsKey,
    byPage: {},
    next: null,
  });

  useEffect(() => {
    if (!currentData) return;
    setLoaded((prev) => ({
      key: argsKey,
      byPage: {
        ...(prev.key === argsKey ? prev.byPage : {}),
        [page]: currentData.results,
      },
      next: currentData.next ?? null,
    }));
  }, [currentData, page, argsKey]);

  const isSameQuery = loaded.key === argsKey;

  // Текущая страница берётся прямо из ответа, чтобы не мигать пустым
  // списком между приходом данных и коммитом эффекта выше.
  const items = useMemo(() => {
    const byPage: Record<number, TItem[]> = isSameQuery ? { ...loaded.byPage } : {};
    if (currentData) byPage[page] = currentData.results;
    return Object.keys(byPage)
      .map(Number)
      .sort((a, b) => a - b)
      .flatMap((pageNumber) => byPage[pageNumber]);
  }, [loaded, isSameQuery, currentData, page]);

  const hasMore = currentData
    ? Boolean(currentData.next)
    : isSameQuery && Boolean(loaded.next);

  const loadMore = () => setPaging({ key: argsKey, page: page + 1 });

  return {
    items,
    hasMore,
    isLoading: isLoading || (page === 1 && isFetching && !currentData),
    isLoadingMore: page > 1 && isFetching,
    loadMore,
  };
}
