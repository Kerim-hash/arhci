"use client";

import { toast } from "sonner";
import {
  useApiResumesDestroyMutation,
  useApiResumesListQuery,
} from "@/services/generatedApi";
import { formatApiError } from "@/lib/formatApiError";
import { MyContentRow } from "./MyContentRow";
import { EmptyState } from "@/components/EmptyState";

export function MyResumesList() {
  const { data, isLoading, refetch } = useApiResumesListQuery({ mine: true });
  const [destroyResume] = useApiResumesDestroyMutation();
  const resumes = data?.results || [];

  const handleDelete = async (id: number) => {
    try {
      await destroyResume({ id }).unwrap();
      toast.success("Резюме удалено");
      refetch();
    } catch (err) {
      toast.error(formatApiError(err, "Не удалось удалить резюме"));
    }
  };

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
          moderationComment={resume.moderationComment}
          href={`/work/resume/${resume.id}`}
          onDelete={() => handleDelete(resume.id)}
        />
      ))}
    </div>
  );
}
