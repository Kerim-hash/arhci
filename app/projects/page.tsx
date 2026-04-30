// app/projects/page.tsx
"use client";

import { useState } from "react";
import { useApiProjectsListQuery } from "@/services/generatedApi";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ProjectCard from "./components/ProjectCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sortOptions = [
  { value: "-created_at", label: "Сначала новые" },
  { value: "created_at", label: "Сначала старые" },
  { value: "-views", label: "По просмотрам" },
  { value: "-likes", label: "По оценкам" },
];

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("-created_at");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useApiProjectsListQuery({
    search: searchTerm || undefined,
    ordering: sortBy,
    page,
  });

  const results = data?.results || [];

  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-left mb-2">
          Все проекты
        </h1>
        <p className="text-[#666666] text-sm sm:text-base">
          Портфолио работ наших архитекторов и дизайнеров
        </p>
      </div>
      <Separator className="bg-[#333333] mb-6" />

      {/* Поиск и сортировка */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Поиск проектов по названию или описанию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Результаты */}
      <div className="mb-4">
        <p className="text-sm text-[#666666]">
          Найдено: {data?.count || 0} проектов
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-[#666666]">Загрузка проектов...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="w-12 h-12 mx-auto mb-4 text-[#666666] opacity-50" />
          <p className="text-lg font-medium text-[#666666]">
            Проекты не найдены
          </p>
          <p className="text-sm text-[#666666] mt-2">
            Попробуйте изменить параметры поиска
          </p>
        </div>
      )}
    </section>
  );
}
