"use client";

import { useRouter } from "next/navigation";

import { isNotFound } from "@/lib/isNotFound";
import { useApiNewsRetrieveQuery, type NewsDetailRead } from "@/services/generatedApi";

import { NewsContent } from "./NewsDetailContent";

interface NewsDetailProps {
  slug: string;
  /** Новость с сервера: текст виден сразу, без ожидания клиентского запроса. */
  initialNews?: NewsDetailRead;
}

export default function NewsDetail({ slug, initialNews }: NewsDetailProps) {
  const router = useRouter();
  const query = useApiNewsRetrieveQuery({ slug }, { skip: !slug });
  // Серверная копия не показывается, если API уже ответил, что новости нет
  const news = query.data ?? (isNotFound(query.error) ? undefined : initialNews);

  if (query.isLoading && !news) {
    return (
      <section className="container mx-auto relative px-4 sm:px-6 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </section>
    );
  }

  if (!news) {
    return (
      <section className="container mx-auto relative px-4 sm:px-6 py-12">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <p className="text-xl">Ошибка при загрузке новости</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => query.refetch()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Попробовать снова
            </button>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Вернуться назад
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-12">
      {/* Кнопка назад */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Назад к списку
      </button>

      <NewsContent content={news.content ?? ""} title={news.title} />
    </section>
  );
}
