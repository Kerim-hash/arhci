"use client";

import { toast } from "sonner";
import { useApiVacanciesListQuery } from "@/services/generatedApi";
import { MyContentRow } from "./MyContentRow";
import { EmptyState } from "@/components/EmptyState";

export function MyVacanciesList() {
  const { data, isLoading } = useApiVacanciesListQuery({ mine: true });
  const vacancies = data?.results || [];

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
          onDelete={() => { toast.error("Удаление вакансий скоро будет доступно"); }}
        />
      ))}
    </div>
  );
}
