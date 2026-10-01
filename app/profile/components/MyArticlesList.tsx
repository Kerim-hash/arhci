"use client";

import { toast } from "sonner";
import {
  useApiArticlesDestroyMutation,
  useApiArticlesListQuery,
} from "@/services/generatedApi";
import { formatApiError } from "@/lib/formatApiError";
import { MyContentRow } from "./MyContentRow";
import { EmptyState } from "@/components/EmptyState";

export function MyArticlesList() {
  const { data, isLoading, refetch } = useApiArticlesListQuery({ mine: true });
  const [destroyArticle] = useApiArticlesDestroyMutation();
  const articles = data?.results || [];

  const handleDelete = async (slug?: string) => {
    if (!slug) {
      toast.error("У статьи нет адреса — удалить её пока нельзя");
      return;
    }
    try {
      await destroyArticle({ slug }).unwrap();
      toast.success("Статья удалена");
      refetch();
    } catch (err) {
      toast.error(formatApiError(err, "Не удалось удалить статью"));
    }
  };

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
          moderationComment={article.moderationComment}
          href={article.slug ? `/articles/${article.slug}` : undefined}
          onDelete={() => handleDelete(article.slug)}
        />
      ))}
    </div>
  );
}
