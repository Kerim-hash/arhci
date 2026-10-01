"use client";

import { useParams } from "next/navigation";
import {
  useApiVacanciesResponsesListQuery,
  useApiVacanciesRetrieveQuery,
} from "@/services/generatedApi";
import { ResponsesPage } from "@/app/profile/components/ResponsesPage";

/** Отклики на вакансию — доступны только её автору. */
export default function VacancyResponsesPage() {
  const params = useParams();
  const vacancyId = Number(params.id);
  const skip = !Number.isFinite(vacancyId);

  const { data: vacancy } = useApiVacanciesRetrieveQuery({ id: vacancyId }, { skip });
  const { data, isLoading, isError, error, refetch } = useApiVacanciesResponsesListQuery(
    { id: vacancyId },
    { skip },
  );

  return (
    <ResponsesPage
      heading="Отклики на вакансию"
      itemTitle={vacancy?.title}
      responses={data?.results || []}
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
    />
  );
}
