"use client";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { NewsContent } from "./NewsDetailContent";

interface NewsType {
  id: number;
  title: string;
  preview_image: string;
  short_description: string;
  word_file: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  content: string;
}

interface NewsDetailProps {
  slug: string;
}

const fetchNewsById = async (slug: string): Promise<NewsType> => {
  console.log("Fetching news with slug:", slug);
  const { data } = await axios.get<NewsType>(
    `http://84.46.243.175:8000/api/news/${slug}/`,
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

// Основной компонент с логикой
function NewsDetailContent({ slug }: NewsDetailProps) {
  const router = useRouter();

  const {
    data: news,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["news", slug],
    queryFn: () => fetchNewsById(slug),
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

  if (error || !news) {
    return (
      <section className="container mx-auto relative px-4 sm:px-6 py-12">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <p className="text-xl">Ошибка при загрузке новости</p>
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

      <NewsContent content={news.content} />
    </section>
  );
}

// Оборачиваем в провайдер
const NewsDetail = ({ slug }: NewsDetailProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <NewsDetailContent slug={slug} />
    </QueryClientProvider>
  );
};

export default NewsDetail;
