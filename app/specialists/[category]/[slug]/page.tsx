import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchApi } from "@/lib/serverApi";
import { findSpecialty } from "@/lib/specialties";
import type {
  PaginatedProjectListListRead,
  SpecialistDetailRead,
} from "@/services/generatedApi";

import SpecialistProfilePage from "../../components/SpecialistProfilePage";

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

const DESCRIPTION_LENGTH = 160;

// Пустой список: профили не собираются при сборке, а кэшируются по первому заходу
export function generateStaticParams() {
  return [];
}

function loadSpecialist(slug: string) {
  return fetchApi<SpecialistDetailRead>(`/api/specialists/${encodeURIComponent(slug)}/`);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const specialist = await loadSpecialist(slug);
  if (!specialist) return {};

  const role = specialist.categoryName || findSpecialty(specialist.category)?.label || "";
  const title = role ? `${specialist.name} — ${role}` : specialist.name;
  const description =
    (specialist.description || specialist.bio || "").slice(0, DESCRIPTION_LENGTH) ||
    `${title}: портфолио и контакты`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: specialist.avatar ? [specialist.avatar] : [],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { category, slug } = await params;
  const specialty = findSpecialty(category);
  if (!specialty) notFound();

  const initialSpecialist = await loadSpecialist(slug);
  const initialProjects = initialSpecialist
    ? await fetchApi<PaginatedProjectListListRead>(
        `/api/projects/specialist/${initialSpecialist.id}/`,
      )
    : undefined;

  return (
    <SpecialistProfilePage
      slug={slug}
      specialty={specialty}
      initialSpecialist={initialSpecialist}
      initialProjects={initialProjects}
    />
  );
}
