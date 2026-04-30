// components/ArticleWithLocalQuery.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";

interface ArticleType {
  id: number;
  title: string;
  slug: string;
  previewImage: string;
  shortDescription: string;
  views: number;
  createdAt: string;
}
interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ArticleType[];
}

const fetchArticles = async (): Promise<ArticleType[]> => {
  const { data } = await axios.get<ApiResponse>(
    "http://84.46.243.175:8000/api/articles/",
  );

  // Проверяем, является ли ответ пагинированным (есть поле results)
  if (data && typeof data === "object" && "results" in data) {
    return data.results;
  }

  // Если это просто массив
  return data as ArticleType[];
};

// Создаем локальный queryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

// Основной компонент с логикой
function ArticleContent() {
  const {
    data: articles,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategory = (article: ArticleType) => {
    const categories = ["Личности", "Архитектура", "Дизайн", "Искусство"];
    return categories[article.id % categories.length];
  };

  if (isLoading) {
    return (
      <section className="container mx-auto relative px-4 sm:px-6 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto relative px-4 sm:px-6 py-12">
        <div className="text-center text-red-600">
          <p className="text-xl">Ошибка при загрузке статей</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Попробовать снова
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-left mb-5">
            Статьи
          </h1>
          <Separator className="bg-[#333333] mb-6 md:mb-10" />
        </div>
      </div>

      {!articles || articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Статьи пока не добавлены</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="overflow-hidden flex flex-col">
              <div className="relative aspect-video md:aspect-[2/5] overflow-hidden md:max-h-[320px] w-full bg-gray-100">
                {article.previewImage ? (
                  <Image
                    src={`${article.previewImage}`}
                    alt={article.title}
                    fill
                    className="object-cover w-full"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-image.jpg";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">Нет изображения</span>
                  </div>
                )}

                <Badge
                  variant="secondary"
                  className="absolute bottom-3 right-3 text-[16px] px-7 z-10"
                >
                  {getCategory(article)}
                </Badge>
              </div>

              <div className="p-4 md:p-6 flex-1">
                <h2 className="text-lg sm:text-xl md:text-[32px] font-medium leading-tight underline mb-3 line-clamp-2">
                  {article.title}
                </h2>

                <p className="text-sm md:text-[16px] text-[#6D6D6D] leading-relaxed line-clamp-3 md:line-clamp-4 mb-4">
                  {article.shortDescription || "Описание отсутствует"}
                </p>

                <p className="text-xs text-gray-400 mb-2">
                  {formatDate(article.createdAt)}
                </p>
              </div>

              <Link
                href={`/articles/${article.slug}`}
                className="block text-right px-4 md:px-6 pb-4 md:pb-6 font-medium text-[18px] text-blue-600 hover:text-blue-800 transition-colors"
              >
                Читать далее →
              </Link>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

// Оборачиваем в провайдер
const ArticleWithLocalQuery = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ArticleContent />
    </QueryClientProvider>
  );
};

export default ArticleWithLocalQuery;
