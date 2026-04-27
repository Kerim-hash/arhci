// components/SpecialistCategorySection.tsx
import { Button } from "@/components/ui/button";
import { Specialist, SpecialistCategory } from "@/types/specialists";
import SpecialistCard from "./SpecialistCard";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

interface SpecialistCategorySectionProps {
  title: string;
  category: SpecialistCategory;
  specialists: Specialist[];
}

export default function SpecialistCategorySection({
  title,
  category,
  specialists,
}: SpecialistCategorySectionProps) {
  // Показываем только первых 4 специалистов
  const displaySpecialists = specialists.slice(0, 4);

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{title}</h2>
        <Link href={`/specialists/${category}`}>
          <Button variant="outline" className="hover:bg-gray-100">
            Смотреть всех
          </Button>
        </Link>
      </div>
      <Separator className="bg-[#333333] mb-6" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {displaySpecialists.map((specialist) => (
          <SpecialistCard
            key={specialist.id}
            specialist={specialist}
            simplified={true} // Упрощенная версия без оценок и просмотров
          />
        ))}
      </div>
    </div>
  );
}
