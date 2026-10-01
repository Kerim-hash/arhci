"use client";

import Link from "next/link";

import ArchitectureFirms from "@/components/architectureFirms";
import HomeFeedTabs from "@/components/home/HomeFeedTabs";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDayMonth } from "@/lib/formatDate";
import {
  useApiNewsListQuery,
  type PaginatedArticleListListRead,
  type PaginatedNewsListListRead,
  type SpecialistListRead,
} from "@/services/generatedApi";

const NEWS_LIMIT = 3;

export interface HomeViewProps {
  /** Данные первого экрана, полученные на сервере (см. lib/serverApi). */
  initialNews?: PaginatedNewsListListRead;
  initialArticles?: PaginatedArticleListListRead;
  initialTop?: SpecialistListRead[];
}

export default function HomeView({ initialNews, initialArticles, initialTop }: HomeViewProps) {
  const newsQuery = useApiNewsListQuery({ page: 1 });
  const newsData = newsQuery.data ?? initialNews;
  const news = newsData?.results?.slice(0, NEWS_LIMIT) || [];
  const newsLoading = newsQuery.isLoading && !newsData;

  return (
    <section className="container mx-auto relative px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Основной контент - занимает всю ширину на мобиле, 6 колонок на десктопе */}
        <div className="lg:col-span-6">
          <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-left mb-5">
            Первое архитектурное сообщество Кыргызстана
          </h1>
          <Separator className="bg-[#333333] mb-6 md:mb-10" />

          {/* Рубрики: табы переключают контент прямо здесь, без перехода */}
          <HomeFeedTabs initialArticles={initialArticles} />
        </div>

        {/* Колонка новостей - скрывается на маленьких экранах, появляется на средних */}
        <div className="lg:col-span-3">
          <h3 className="text-xl md:text-[32px] font-medium mb-5 mt-8 md:mt-[170px]">
            Новости
          </h3>
          <Separator className="bg-[#333333] mb-6 md:mb-10" />

          <div className="space-y-4 md:space-y-6">
            {newsLoading ? (
              <div className="text-center py-8 text-gray-500">Загрузка...</div>
            ) : news.length > 0 ? (
              news.map((item) => (
                <Link href={`/news/${item.slug}`} key={item.id} className="block mb-4 md:mb-6">
                  <Card className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
                    <time
                      dateTime={item.createdAt}
                      className="text-sm font-medium text-muted-foreground block mb-2"
                    >
                      {formatDayMonth(item.createdAt)}
                    </time>
                    <p className="text-sm md:text-[16px] text-[#333333] leading-relaxed line-clamp-4 md:line-clamp-6">
                      {item.title}
                    </p>
                  </Card>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 py-4">Нет доступных новостей.</p>
            )}
          </div>
        </div>

        {/* Архитектурные фирмы - скрывается на мобильных устройствах */}
        <div className="hidden lg:block lg:col-span-3">
          <ArchitectureFirms initialTop={initialTop} />
        </div>
      </div>
    </section>
  );
}
