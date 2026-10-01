// app/projects/page.tsx
import type { Metadata } from "next";

import { fetchApi } from "@/lib/serverApi";
import type { PaginatedProjectListListRead } from "@/services/generatedApi";

import ProjectsPageClient from "./components/ProjectsPageClient";
import { DEFAULT_PROJECTS_ORDERING, parseSpecialistId } from "./model/listParams";

export const metadata: Metadata = {
  title: "Проекты",
  description: "Портфолио работ архитекторов, инженеров и дизайнеров Кыргызстана",
};

interface PageProps {
  searchParams: Promise<{ specialist?: string | string[] }>;
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const { specialist } = await searchParams;
  const specialistId = parseSpecialistId(Array.isArray(specialist) ? specialist[0] : specialist);

  // Те же параметры, с которыми список запрашивается на клиенте
  const query = `ordering=${DEFAULT_PROJECTS_ORDERING}&page=1`;
  const initialPage = await fetchApi<PaginatedProjectListListRead>(
    specialistId === null
      ? `/api/projects/?${query}`
      : `/api/projects/specialist/${specialistId}/?${query}`,
  );

  return <ProjectsPageClient initialPage={initialPage} />;
}
