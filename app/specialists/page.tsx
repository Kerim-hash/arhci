// app/specialists/page.tsx
"use client";

import {
  useApiSpecialistsListQuery,
  type SpecialistCategoryEnum,
} from "@/services/generatedApi";
import SpecialistCategorySection from "./components/SpecialistCategorySection";

const categories: { id: SpecialistCategoryEnum; title: string }[] = [
  { id: "architects", title: "Архитекторы" },
  { id: "engineers", title: "Инженеры" },
  { id: "constructors", title: "Конструкторы" },
  { id: "interior-designers", title: "Дизайнеры интерьера" },
  { id: "visualizers", title: "Визуализаторы" },
];

/**
 * Список пагинирован по 20, поэтому один общий запрос показывал только тех,
 * кто попал на первую страницу: категории дальше по списку просто пропадали.
 * Запрашиваем каждую категорию отдельно — полный список ведёт «Смотреть всех».
 */
function CategoryBlock({ id, title }: { id: SpecialistCategoryEnum; title: string }) {
  const { data } = useApiSpecialistsListQuery({
    category: id,
    ordering: "-rating",
    page: 1,
  });
  const specialists = data?.results || [];

  if (specialists.length === 0) return null;

  return (
    <SpecialistCategorySection
      title={title}
      category={id}
      specialists={specialists}
    />
  );
}

export default function SpecialistsPage() {
  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8">
      {categories.map((category) => (
        <CategoryBlock key={category.id} id={category.id} title={category.title} />
      ))}
    </section>
  );
}
