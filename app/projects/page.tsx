// app/projects/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { fetchProjects } from "@/app/store/features/projectsSlice";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  { value: "newest", label: "Сначала новые" },
  { value: "oldest", label: "Сначала старые" },
  { value: "most-viewed", label: "По просмотрам" },
  { value: "most-liked", label: "По оценкам" },
];

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector((state) => state.projects);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const filteredAndSortedProjects = () => {
    let filtered = [...projects];

    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "most-viewed":
        filtered.sort((a, b) => b.views - a.views);
        break;
      case "most-liked":
        filtered.sort((a, b) => b.likes - a.likes);
        break;
    }

    return filtered;
  };

  const results = filteredAndSortedProjects();

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
          Найдено: {results.length} проектов
        </p>
      </div>

      {loading ? (
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
