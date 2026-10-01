"use client";

import { toast } from "sonner";
import {
  useApiProjectsDestroyMutation,
  useApiProjectsListQuery,
} from "@/services/generatedApi";
import { formatApiError } from "@/lib/formatApiError";
import { MyContentRow } from "./MyContentRow";
import { EmptyState } from "@/components/EmptyState";

export function MyProjectsList() {
  const { data, isLoading, refetch } = useApiProjectsListQuery({ mine: true });
  const [destroyProject] = useApiProjectsDestroyMutation();
  const projects = data?.results || [];

  const handleDelete = async (id: number) => {
    try {
      await destroyProject({ id }).unwrap();
      toast.success("Проект удалён");
      refetch();
    } catch (err) {
      toast.error(formatApiError(err, "Не удалось удалить проект"));
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Загрузка...</div>;
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        title="Пока нет ни одного проекта"
        description="Добавьте свой первый проект в портфолио, чтобы его увидели клиенты и коллеги."
        actionLabel="Создать проект"
        actionHref="/projects/create"
      />
    );
  }

  return (
    <div>
      {projects.map((project) => (
        <MyContentRow
          key={project.id}
          title={project.title}
          createdAt={project.createdAt}
          status={project.moderationStatus}
          moderationComment={project.moderationComment}
          href={`/projects/${project.id}`}
          editHref={`/projects/${project.id}/edit`}
          onDelete={() => handleDelete(project.id)}
        />
      ))}
    </div>
  );
}
