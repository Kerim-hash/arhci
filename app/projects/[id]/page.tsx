// app/projects/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchApi } from "@/lib/serverApi";
import { stripHtml } from "@/lib/utils";
import type { ProjectDetailRead } from "@/services/generatedApi";

import ProjectDetailClient from "../components/ProjectDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

const DESCRIPTION_LENGTH = 160;

// Пустой список: проекты не собираются при сборке, а кэшируются по первому заходу
export function generateStaticParams() {
  return [];
}

const isProjectId = (id: string) => /^\d+$/.test(id);

function loadProject(id: string) {
  // Только числовой id: иначе в адрес API попал бы произвольный путь
  if (!isProjectId(id)) return Promise.resolve(undefined);
  return fetchApi<ProjectDetailRead>(`/api/projects/${id}/`);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await loadProject(id);
  if (!project) return { title: "Проект" };

  const description =
    stripHtml(project.description || "").slice(0, DESCRIPTION_LENGTH) ||
    `Проект «${project.title}»${project.specialistName ? ` — ${project.specialistName}` : ""}`;
  return {
    title: project.title,
    description,
    openGraph: {
      title: project.title,
      description,
      images: project.previewImage ? [project.previewImage] : [],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  if (!isProjectId(id)) notFound();

  // Проект на модерации сервер не увидит — его покажет клиентский запрос автора
  const initialProject = await loadProject(id);

  return <ProjectDetailClient projectId={parseInt(id, 10)} initialProject={initialProject} />;
}
