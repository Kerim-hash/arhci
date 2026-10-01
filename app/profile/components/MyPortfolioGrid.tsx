"use client";

import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useApiProjectsDestroyMutation,
  useApiProjectsListQuery,
} from "@/services/generatedApi";
import ProjectCard from "@/app/projects/components/ProjectCard";
import { EmptyState } from "@/components/EmptyState";
import { ModerationStatusBadge } from "@/components/ModerationStatusBadge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatApiError } from "@/lib/formatApiError";

export function MyPortfolioGrid() {
  const { data, isLoading, isError, refetch } = useApiProjectsListQuery({ mine: true });
  const [destroyProject, { isLoading: isDeleting }] = useApiProjectsDestroyMutation();
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

  if (isError) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Не удалось загрузить проекты.</p>
        <Button variant="outline" className="mt-4 rounded-[40px]" onClick={() => refetch()}>
          Повторить
        </Button>
      </div>
    );
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
        <div key={project.id} className="flex flex-col gap-2">
          <ProjectCard project={project} />
          <div className="flex items-center justify-between gap-2">
            <ModerationStatusBadge status={project.moderationStatus} />
            <div className="flex items-center gap-3">
              <Link
                href={`/projects/${project.id}/edit`}
                className="inline-flex items-center gap-1 text-sm text-[#333] hover:underline"
              >
                <Pencil className="w-3.5 h-3.5" />
                Редактировать
              </Link>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-sm text-red-500 hover:underline cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Удалить
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Удалить проект?</AlertDialogTitle>
                    <AlertDialogDescription>
                      «{project.title}» будет удалён без возможности восстановления.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(project.id)}
                      disabled={isDeleting}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      {isDeleting ? "Удаление..." : "Удалить"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          {project.moderationStatus === "rejected" && project.moderationComment && (
            <p className="text-xs text-red-600">Причина: {project.moderationComment}</p>
          )}
        </div>
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
