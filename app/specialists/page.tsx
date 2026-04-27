// app/specialists/page.tsx (или pages/specialists/index.tsx для Pages Router)
"use client";

import { useAppSelector } from "@/app/store/hooks";
import SpecialistCategorySection from "./components/SpecialistCategorySection";
import { Separator } from "@/components/ui/separator";

const categories = [
  { id: "architects" as const, title: "Архитекторы" },
  { id: "engineers" as const, title: "Инженеры" },
  { id: "interior-designers" as const, title: "Дизайнеры интерьера" },
  { id: "visualizers" as const, title: "Визуализаторы" },
];

export default function SpecialistsPage() {
  const { specialists } = useAppSelector((state) => state.specialists);

  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8">
      {categories.map((category) => {
        const categorySpecialists = specialists.filter(
          (s) => s.category === category.id,
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
