// app/vacancy/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useApiVacanciesRetrieveQuery } from "@/services/generatedApi";
import { VacancyDetailComponent } from "../../components/VacancyDetail";

export default function VacancyPage() {
  const params = useParams();
  const vacancyId = Number(params.id);

  const { data: vacancy, isLoading, error } = useApiVacanciesRetrieveQuery(
    { id: vacancyId },
    { skip: isNaN(vacancyId) }
  );

  if (isLoading)
    return <div className="container mx-auto px-4 py-8">Загрузка...</div>;
  if (error)
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">
        Ошибка загрузки
      </div>
    );
  if (!vacancy) return null;

  return <VacancyDetailComponent vacancy={vacancy as any} />;
}
