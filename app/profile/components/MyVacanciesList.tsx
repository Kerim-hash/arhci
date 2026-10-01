"use client";

import { toast } from "sonner";
import {
  useApiVacanciesDestroyMutation,
  useApiVacanciesListQuery,
} from "@/services/generatedApi";
import { formatApiError } from "@/lib/formatApiError";
import { MyContentRow } from "./MyContentRow";
import { ResponsesCountLink } from "./ResponsesCountLink";
import { EmptyState } from "@/components/EmptyState";

export function MyVacanciesList() {
  const { data, isLoading, refetch } = useApiVacanciesListQuery({ mine: true });
  const [destroyVacancy] = useApiVacanciesDestroyMutation();
  const vacancies = data?.results || [];

  const handleDelete = async (id: number) => {
    try {
      await destroyVacancy({ id }).unwrap();
      toast.success("Вакансия удалена");
      refetch();
    } catch (err) {
      toast.error(formatApiError(err, "Не удалось удалить вакансию"));
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Загрузка...</div>;
  }

  if (vacancies.length === 0) {
    return (
      <EmptyState
        title="Пока нет ни одной вакансии"
        description="Опубликуйте вакансию, чтобы найти специалиста в свою команду."
        actionLabel="Создать вакансию"
        actionHref="/work/vacancy/create"
      />
    );
  }

  return (
    <div>
      {vacancies.map((vacancy) => (
        <MyContentRow
          key={vacancy.id}
          title={vacancy.title}
          createdAt={vacancy.createdAt}
          status={vacancy.moderationStatus}
          moderationComment={vacancy.moderationComment}
          href={`/work/vacancy/${vacancy.id}`}
          extra={
            <ResponsesCountLink
              href={`/profile/vacancies/${vacancy.id}/responses`}
              // Счётчик есть в ответе бэкенда, но ещё не попал в openapi.yaml.
              count={(vacancy as { responsesCount?: string | number }).responsesCount}
            />
          }
          onDelete={() => handleDelete(vacancy.id)}
        />
      ))}
    </div>
  );
}
