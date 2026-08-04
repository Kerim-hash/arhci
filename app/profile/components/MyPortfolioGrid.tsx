"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useApiProjectsListQuery } from "@/services/generatedApi";
import ProjectCard from "@/app/projects/components/ProjectCard";
import { EmptyState } from "@/components/EmptyState";

export function MyPortfolioGrid() {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}

      <Link href="/projects/create" className="block">
        <div className="border-2 border-dashed border-[#E0E0E0] rounded-lg flex flex-col items-center justify-center min-h-[200px] hover:border-[#333] transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center mb-3">
            <Plus className="w-5 h-5 text-[#333]" />
          </div>
          <span className="text-sm text-[#333] font-medium">Создать проект</span>
        </div>
      </Link>
    </div>
  );
}
