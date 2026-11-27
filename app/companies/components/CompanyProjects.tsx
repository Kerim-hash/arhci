"use client";

import CreateProjectCard from "@/app/projects/components/CreateProjectCard";
import ProjectCard from "@/app/projects/components/ProjectCard";
import { LoadMoreButton } from "@/app/work/components/LoadMoreButton";
import { usePagedQuery } from "@/app/work/model/usePagedQuery";
import { Button } from "@/components/ui/button";
import {
  useApiProjectsListQuery,
  type PaginatedProjectListListRead,
} from "@/services/generatedApi";

interface CompanyProjectsProps {
  userId: number;
  /** Первая страница с сервера — для тех же аргументов `{ user: userId }`. */
  initialPage?: PaginatedProjectListListRead;
  isOwner: boolean;
}

/**
 * Все проекты компании — /api/projects/?user=… с «Показать ещё», как в
 * профиле специалиста. Публично — одобренные, владельцу — ещё и свои на
 * модерации (это решает API).
 */
export default function CompanyProjects({ userId, initialPage, isOwner }: CompanyProjectsProps) {
  const { items, hasMore, isLoading, isLoadingMore, isError, loadMore, retry } = usePagedQuery(
    useApiProjectsListQuery,
    { user: userId },
    initialPage,
  );

  if (isLoading) {
    return <div className="text-center py-8 text-[#666666]">Загрузка...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-[#666666] mb-4">Не удалось загрузить проекты.</p>
        <Button variant="outline" onClick={retry}>
          Повторить
        </Button>
      </div>
    );
  }

  if (items.length === 0 && !isOwner) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-[#666666]">У компании пока нет опубликованных проектов</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        {isOwner && <CreateProjectCard />}
      </div>
      <LoadMoreButton hasMore={hasMore} isLoading={isLoadingMore} onClick={loadMore} />
    </div>
  );
}
