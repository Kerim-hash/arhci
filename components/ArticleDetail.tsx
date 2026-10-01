"use client";

import { useRouter } from "next/navigation";
import { isNotFound } from "@/lib/isNotFound";
import { useApiArticlesRetrieveQuery, type ArticleDetailRead } from "@/services/generatedApi";
import { ModerationStatusBadge } from "@/components/ModerationStatusBadge";
import { ArticleContent } from "./ArticleDetailContent";

interface ArticleDetailProps {
  slug: string;
  /** Статья с сервера (анонимный запрос): одобренная видна сразу. */
  initialArticle?: ArticleDetailRead;
}

function unavailableMessage(status: unknown): string {
  if (status === 404) {
    return "Статья не найдена или ещё не прошла модерацию.";
  }
  return "Не удалось загрузить статью. Проверьте соединение и попробуйте ещё раз.";
}

/**
 * Деталь статьи. Запрос идёт через общий API-слайс с токеном: так автор видит
 * свою статью ещё до одобрения (с пометкой о модерации), а не «не найдено».
 */
export default function ArticleDetail({ slug, initialArticle }: ArticleDetailProps) {
  const router = useRouter();
  const query = useApiArticlesRetrieveQuery({ slug }, { skip: !slug });
  const { error, refetch } = query;
  // Серверная копия не показывается, если API уже ответил, что статьи нет
  const article = query.data ?? (isNotFound(error) ? undefined : initialArticle);
  const isLoading = query.isLoading && !article;
  const isError = query.isError && !article;

  if (isLoading) {
    return (
      <section className="container mx-auto relative px-4 sm:px-6 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </section>
    );
  }

  if (isError || !article) {
    const status = isError && error && "status" in error ? error.status : undefined;
    return (
      <section className="container mx-auto relative px-4 sm:px-6 py-12">
        <div className="text-center max-w-md mx-auto">
          <p className="text-xl font-semibold text-[#333] mb-2">Статья недоступна</p>
          <p className="text-[#666666] mb-6">{unavailableMessage(status)}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-[#333] text-white rounded-[40px] hover:bg-black transition-colors"
            >
              Попробовать снова
            </button>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 text-[#333] rounded-[40px] hover:bg-gray-50 transition-colors"
            >
              Вернуться назад
            </button>
          </div>
        </div>
      </section>
    );
  }

  const isUnderModeration = article.moderationStatus !== "approved";

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

      {/* Неодобренную статью API отдаёт только автору и сотрудникам — им и нужна пометка */}
      {isUnderModeration && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-[#333]">
          <ModerationStatusBadge status={article.moderationStatus} />
          {article.moderationStatus === "pending" ? (
            <span>
              Статья на модерации. Сейчас её видят только автор и модераторы, для всех она
              появится после проверки.
            </span>
          ) : (
            <span>
              Статья отклонена модератором.
              {article.moderationComment ? ` Причина: ${article.moderationComment}` : ""}
            </span>
          )}
        </div>
      )}

      <ArticleContent article={article} />
    </section>
  );
}
