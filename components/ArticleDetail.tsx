"use client";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ArticleContent } from "./ArticleDetailContent";

interface ArticleType {
  id: number;
  title: string;
  slug: string;
  previewImage: string;
  shortDescription: string;
  content: string;
  views: number;
  createdAt: string;
}

interface ArticleDetailProps {
  slug: string;
}

const fetchArticleById = async (slug: string): Promise<ArticleType> => {
    console.log("Fetching article with slug:", slug);
  const { data } = await axios.get<ArticleType>(
    `http://84.46.243.175:8000/api/articles/${slug}/`,
  );
  return data;
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

// Компонент для отображения HTML контента


// Основной компонент с логикой
function ArticleDetailContent({ slug }: ArticleDetailProps) {
  const router = useRouter();

  const {
    data: article,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => fetchArticleById(slug),
  });

  if (isLoading) {
    return (
      <section className="container mx-auto relative px-4 sm:px-6 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </section>
    );
  }

  if (error || !article) {
    return (
      <section className="container mx-auto relative px-4 sm:px-6 py-12">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <p className="text-xl">Ошибка при загрузке статьи</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => refetch()}
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
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Назад к списку
      </button>

      <ArticleContent content={article.content} />
    </section>
  );
}

// Оборачиваем в провайдер
const ArticleDetail = ({ slug }: ArticleDetailProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ArticleDetailContent slug={slug} />
    </QueryClientProvider>
  );
};

export default ArticleDetail;
