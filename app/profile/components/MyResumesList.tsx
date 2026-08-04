"use client";

import { toast } from "sonner";
import { useApiResumesListQuery } from "@/services/generatedApi";
import { MyContentRow } from "./MyContentRow";
import { EmptyState } from "@/components/EmptyState";

export function MyResumesList() {
  const { data, isLoading } = useApiResumesListQuery({ mine: true });
  const resumes = data?.results || [];

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Загрузка...</div>;
  }

  if (resumes.length === 0) {
    return (
      <EmptyState
        title="Пока нет ни одного резюме"
        description="Опубликуйте резюме, чтобы работодатели могли предложить вам вакансию."
        actionLabel="Создать резюме"
        actionHref="/work/resume/create"
      />
    );
  }

  return (
    <div>
      {resumes.map((resume) => (
        <MyContentRow
          key={resume.id}
          title={resume.name}
          createdAt={resume.createdAt}
          status={resume.moderationStatus}
          onDelete={() => { toast.error("Удаление резюме скоро будет доступно"); }}
        />
      ))}
    </div>
  );
}
