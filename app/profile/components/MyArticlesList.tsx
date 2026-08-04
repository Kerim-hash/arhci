"use client";

import { toast } from "sonner";
import { useApiArticlesListQuery } from "@/services/generatedApi";
import { MyContentRow } from "./MyContentRow";
import { EmptyState } from "@/components/EmptyState";

export function MyArticlesList() {
  const { data, isLoading } = useApiArticlesListQuery({ mine: true });
  const articles = data?.results || [];

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Загрузка...</div>;
  }

  if (articles.length === 0) {
    return (
      <EmptyState
        title="Пока нет ни одной статьи"
        description="Поделитесь своим опытом и знаниями — опубликуйте первую статью."
        actionLabel="Создать статью"
        actionHref="/create-article"
      />
    );
  }

  return (
    <div>
      {articles.map((article) => (
        <MyContentRow
          key={article.id}
          title={article.title}
          createdAt={article.createdAt}
          status={article.moderationStatus}
          onDelete={() => { toast.error("Удаление статей скоро будет доступно"); }}
        />
      ))}
    </div>
  );
}
