"use client";

import { findSpecialty, type Specialty, type SpecialtyId } from "@/lib/specialties";
import {
  useApiSpecialistsListQuery,
  type PaginatedSpecialistListListRead,
} from "@/services/generatedApi";

import SpecialistCategorySection from "./SpecialistCategorySection";

/** Порядок разделов на странице. */
const SPECIALISTS_INDEX_ORDER: SpecialtyId[] = [
  "architects",
  "engineers",
  "constructors",
  "interior-designers",
  "visualizers",
];

export type InitialSpecialistsByCategory = Partial<
  Record<SpecialtyId, PaginatedSpecialistListListRead>
>;

/**
 * Список пагинирован по 20, поэтому один общий запрос показывал только тех,
 * кто попал на первую страницу: категории дальше по списку просто пропадали.
 * Запрашиваем каждую категорию отдельно — полный список ведёт «Смотреть всех».
 */
function CategoryBlock({
  specialty,
  initialPage,
}: {
  specialty: Specialty;
  initialPage?: PaginatedSpecialistListListRead;
}) {
  const { data = initialPage } = useApiSpecialistsListQuery({
    category: specialty.id,
    ordering: "-rating",
    page: 1,
  });
  const specialists = data?.results || [];

  if (specialists.length === 0) return null;

  return (
    <SpecialistCategorySection
      title={specialty.plural}
      category={specialty.id}
      specialists={specialists}
    />
  );
}

export default function SpecialistsIndex({
  initialByCategory,
}: {
  initialByCategory: InitialSpecialistsByCategory;
}) {
  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8">
      {SPECIALISTS_INDEX_ORDER.map((id) => {
        const specialty = findSpecialty(id);
        if (!specialty) return null;
        return (
          <CategoryBlock key={id} specialty={specialty} initialPage={initialByCategory[id]} />
        );
      })}
    </section>
  );
}
