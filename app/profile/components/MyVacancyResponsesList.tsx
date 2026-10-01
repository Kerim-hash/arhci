"use client";

import { useApiVacanciesMyResponsesListQuery } from "@/services/generatedApi";
import type { ModerationStatus } from "@/components/ModerationStatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { MyResponseCard } from "./MyResponseCard";

// В openapi.yaml вложенная вакансия описана как свободный объект — фиксируем
// поля, которые реально отдаёт бэкенд.
interface ResponseVacancy {
  id: number;
  title: string;
  companyName?: string;
  moderationStatus?: ModerationStatus;
}

/** Отклики текущего пользователя на вакансии. */
export function MyVacancyResponsesList() {
  const { data, isLoading, isError, refetch } = useApiVacanciesMyResponsesListQuery({});
  const responses = data?.results || [];

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Загрузка...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Не удалось загрузить отклики.</p>
        <Button variant="outline" className="mt-4 rounded-[40px]" onClick={() => refetch()}>
          Повторить
        </Button>
      </div>
    );
  }

  if (responses.length === 0) {
    return (
      <EmptyState
        title="Вы пока не откликались на вакансии"
        description="Найдите подходящую вакансию и оставьте отклик — он появится здесь."
        actionLabel="Смотреть вакансии"
        actionHref="/work"
      />
    );
  }

  return (
    <div className="space-y-4">
      {responses.map((response) => {
        const vacancy = response.vacancy as ResponseVacancy;
        return (
          <MyResponseCard
            key={response.id}
            href={`/work/vacancy/${vacancy.id}`}
            title={vacancy.title}
            subtitle={vacancy.companyName}
            status={vacancy.moderationStatus}
            message={response.message}
            createdAt={response.createdAt}
          />
        );
      })}
    </div>
  );
}
