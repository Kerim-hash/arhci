// app/specialists/page.tsx
"use client";

import { useApiSpecialistsListQuery } from "@/services/generatedApi";
import SpecialistCategorySection from "./components/SpecialistCategorySection";

const categories = [
  { id: "architects" as const, title: "Архитекторы" },
  { id: "engineers" as const, title: "Инженеры" },
  { id: "interior-designers" as const, title: "Дизайнеры интерьера" },
  { id: "visualizers" as const, title: "Визуализаторы" },
];

export default function SpecialistsPage() {
  const { data } = useApiSpecialistsListQuery({});
  const specialists = data?.results || [];

  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8">
      {categories.map((category) => {
        const categorySpecialists = specialists.filter(
          (s: any) => s.category === category.id,
        );

        if (categorySpecialists.length === 0) return null;

        return (
          <SpecialistCategorySection
            key={category.id}
            title={category.title}
            category={category.id}
            specialists={categorySpecialists}
          />
        );
      })}
    </section>
  );
}
