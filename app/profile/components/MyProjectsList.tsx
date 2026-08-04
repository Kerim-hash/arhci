"use client";

import { toast } from "sonner";
import { useApiProjectsListQuery } from "@/services/generatedApi";
import { MyContentRow } from "./MyContentRow";
import { EmptyState } from "@/components/EmptyState";

export function MyProjectsList() {
  const { data, isLoading } = useApiProjectsListQuery({ mine: true });
  const projects = data?.results || [];

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
          onDelete={() => { toast.error("Удаление проектов скоро будет доступно"); }}
        />
      ))}
    </div>
  );
}
