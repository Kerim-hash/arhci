import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchApi } from "@/lib/serverApi";
import { SPECIALTIES, findSpecialty } from "@/lib/specialties";
import type { PaginatedSpecialistListListRead } from "@/services/generatedApi";

import SpecialistCategoryPage from "../components/SpecialistCategoryPage";

interface PageProps {
  params: Promise<{ category: string }>;
}

// Каталоги всех специальностей собираются заранее; незнакомая категория — 404 (см. Page)
export function generateStaticParams() {
  return SPECIALTIES.map((specialty) => ({ category: specialty.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const specialty = findSpecialty(category);
  if (!specialty) return {};
  return {
    title: specialty.plural,
    description: specialty.intro || `${specialty.plural} Кыргызстана — портфолио и контакты`,
  };
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;
  const specialty = findSpecialty(category);
  if (!specialty) notFound();

  // Те же параметры, с которыми страница запрашивает список на клиенте
  const initialPage = await fetchApi<PaginatedSpecialistListListRead>(
    `/api/specialists/?category=${specialty.id}&ordering=-rating&page=1`,
  );

  return <SpecialistCategoryPage specialty={specialty} initialPage={initialPage} />;
}
