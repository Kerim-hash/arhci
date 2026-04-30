"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import ArchitectureFirms from "@/components/architectureFirms";
import Link from "next/link";
import {
  useApiArticlesListQuery,
  useApiNewsListQuery,
} from "@/services/generatedApi";

const filters = ["Статьи", "Конкурсы", "Личности", "Объект"];

export default function Page() {
  const { data: articlesData, isLoading: articlesLoading } =
    useApiArticlesListQuery({ page: 1 });
  const { data: newsData, isLoading: newsLoading } = useApiNewsListQuery({
    page: 1,
  });

  const articles = articlesData?.results?.slice(0, 3) || [];
  const news = newsData?.results?.slice(0, 3) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      month: "long",
      day: "numeric",
    });
  };

  const getCategory = (id: number) => {
    const categories = ["Личности", "Архитектура", "Дизайн", "Искусство"];
    return categories[id % categories.length];
  };

  return (
    <section className="container mx-auto relative px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Основной контент - занимает всю ширину на мобиле, 6 колонок на десктопе */}
        <div className="lg:col-span-6">
          <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-left mb-5">
            Первое архитектурное сообщество Кыргызстана
          </h1>
          <Separator className="bg-[#333333] mb-6 md:mb-10" />

          {/* Фильтры - адаптивное отображение */}
          <div className="flex flex-wrap gap-6 mb-4">
            {filters.map((item, i) => (
              <button
                key={item}
                className={cn(
                  "text-[16px] transition-colors cursor-pointer",
                  i === 0
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Карточки статей */}
          <div className="space-y-4 md:space-y-6">
            {articlesLoading ? (
              <div className="text-center py-8 text-gray-500">Загрузка...</div>
            ) : articles.length > 0 ? (
              articles.map((item: any) => (
                <Link href={`/articles/${item.slug}`} key={item.id}>
                  <Card className="overflow-hidden mb-4 md:mb-6">
                    {/* Изображение - меняется пропорция на мобиле */}
                    <div className="relative aspect-video md:aspect-[2/5] overflow-hidden md:max-h-[320px] w-full bg-gray-100">
                      {item.previewImage ? (
                        <Image
                          src={item.previewImage}
                          alt={item.title}
                          fill
                          className="object-cover w-full"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-400">Нет изображения</span>
                        </div>
                      )}

                      {/* Бейдж */}
                      <Badge
                        variant="secondary"
                        className="absolute bottom-3 right-3 text-xs"
                      >
                        {getCategory(item.id)}
                      </Badge>
                    </div>

                    {/* Контент карточки */}
                    <div className="p-4 md:p-6">
                      <h2 className="text-lg sm:text-xl md:text-[32px] font-medium leading-tight underline mb-3">
                        {item.title}
                      </h2>

                      <p className="text-sm md:text-[16px] text-[#6D6D6D] leading-relaxed line-clamp-3 md:line-clamp-4">
                        {item.shortDescription || "Описание отсутствует"}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 py-4">Нет доступных статей.</p>
            )}
          </div>
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
              news.map((item: any) => (
                <Link href={`/news/${item.slug}`} key={item.id} className="block mb-4 md:mb-6">
                  <Card className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
                    <time
                      dateTime={item.createdAt}
                      className="text-sm font-medium text-muted-foreground block mb-2"
                    >
                      {formatDate(item.createdAt)}
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
          <ArchitectureFirms />
        </div>
      </div>
    </section>
  );
}
