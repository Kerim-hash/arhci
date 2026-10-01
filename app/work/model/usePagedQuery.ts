// app/work/model/usePagedQuery.ts
"use client";

import { useEffect, useMemo, useState } from "react";

interface PageOf<TItem> {
  results: TItem[];
  next?: string | null;
  count?: number;
}

interface PagedQueryResult<TItem> {
  currentData?: PageOf<TItem>;
  isLoading: boolean;
  isFetching: boolean;
  isError?: boolean;
  refetch?: () => unknown;
}

interface LoadedPages<TItem> {
  key: string;
  byPage: Record<number, TItem[]>;
  next: string | null;
  count?: number;
}

/**
 * Постраничная подгрузка «Показать ещё» поверх RTK Query-хука списка.
 *
 * Номер страницы привязан к сериализованным аргументам запроса: при смене
 * поиска или фильтров список начинается с первой страницы без лишнего
 * запроса. Результаты хранятся по страницам, поэтому повторная загрузка
 * текущей страницы после инвалидации кэша не дублирует элементы.
 *
 * `initialPage` — первая страница, полученная на сервере (см. lib/serverApi):
 * она показывается, пока клиентский запрос ещё не ответил. Передавать её
 * нужно только для тех аргументов, с которыми её запрашивал сервер.
 */
export function usePagedQuery<TArgs extends object, TItem>(
  useQuery: (args: TArgs & { page: number }) => PagedQueryResult<TItem>,
  args: TArgs,
  initialPage?: PageOf<TItem>,
) {
  const argsKey = JSON.stringify(args);
  const [paging, setPaging] = useState({ key: argsKey, page: 1 });
  const page = paging.key === argsKey ? paging.page : 1;

  const { currentData, isLoading, isFetching, isError, refetch } = useQuery({ ...args, page });

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
      count: currentData.count,
    }));
  }, [currentData, page, argsKey]);

  const isSameQuery = loaded.key === argsKey;
  const hasLoadedPages = isSameQuery && Object.keys(loaded.byPage).length > 0;

  // Текущая страница берётся прямо из ответа, чтобы не мигать пустым
  // списком между приходом данных и коммитом эффекта выше.
  const items = useMemo(() => {
    const byPage: Record<number, TItem[]> = isSameQuery ? { ...loaded.byPage } : {};
    if (currentData) byPage[page] = currentData.results;
    // Серверная страница заменяет первую, пока клиент не получил свою: в том
    // числе когда «Показать ещё» нажали раньше, чем пришёл ответ на первую
    if (byPage[1] === undefined && initialPage) byPage[1] = initialPage.results;
    return Object.keys(byPage)
      .map(Number)
      .sort((a, b) => a - b)
      .flatMap((pageNumber) => byPage[pageNumber]);
  }, [loaded, isSameQuery, currentData, page, initialPage]);

  const hasMore = currentData
    ? Boolean(currentData.next)
    : hasLoadedPages
      ? Boolean(loaded.next)
      : Boolean(initialPage?.next);

  const loadMore = () => setPaging({ key: argsKey, page: page + 1 });

  return {
    items,
    count: currentData?.count ?? (isSameQuery ? loaded.count : undefined) ?? initialPage?.count,
    hasMore,
    isLoading: !initialPage && (isLoading || (page === 1 && isFetching && !currentData)),
    isLoadingMore: page > 1 && isFetching,
    isError: Boolean(isError) && items.length === 0,
    loadMore,
    retry: () => {
      refetch?.();
    },
  };
}
