// app/projects/page.tsx
"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  generatedApi,
  useApiProjectsListQuery,
  useApiProjectsSpecialistListQuery,
  type ProjectListRead,
} from "@/services/generatedApi";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import ProjectCard from "./components/ProjectCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRole } from "@/hooks/use-role";
import { useDebounce } from "@/hooks/use-debounce";
import { formatApiError } from "@/lib/formatApiError";
import Link from "next/link";

const sortOptions = [
  { value: "-created_at", label: "Сначала новые" },
  { value: "created_at", label: "Сначала старые" },
  { value: "-views", label: "По просмотрам" },
  { value: "-likes", label: "По оценкам" },
];

const SEARCH_DEBOUNCE_MS = 300;

/**
 * Страницы после первой подгружаются кнопкой «Показать ещё» и копятся здесь.
 * Ключ — параметры списка: стоит им измениться (поиск, сортировка, специалист),
 * накопленное отбрасывается само, без эффектов и ручного сброса.
 */
interface ExtraPages {
  key: string;
  page: number;
  items: ProjectListRead[];
  next: string | null;
}

const NO_EXTRA_PAGES: ExtraPages = { key: "", page: 1, items: [], next: null };

const parseSpecialistId = (raw: string | null): number | null => {
  if (!raw) return null;
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
};

function ProjectsPageContent() {
  const searchParams = useSearchParams();
  const specialistId = parseSpecialistId(searchParams.get("specialist"));
  const isSpecialistMode = specialistId !== null;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("-created_at");
  const [extra, setExtra] = useState<ExtraPages>(NO_EXTRA_PAGES);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const { isAuthenticated } = useRole();

  const debouncedSearch = useDebounce(searchTerm.trim(), SEARCH_DEBOUNCE_MS);
  const search = debouncedSearch || undefined;
  const listKey = `${specialistId ?? ""}|${debouncedSearch}|${sortBy}`;

  const allProjects = useApiProjectsListQuery(
    { search, ordering: sortBy, page: 1 },
    { skip: isSpecialistMode },
  );
  const specialistProjects = useApiProjectsSpecialistListQuery(
    { specialistId: specialistId ?? 0, search, ordering: sortBy, page: 1 },
    { skip: !isSpecialistMode },
  );
  const { data, isLoading, isError, refetch } = isSpecialistMode
    ? specialistProjects
    : allProjects;

  const [loadMoreAll, allMore] = generatedApi.endpoints.apiProjectsList.useLazyQuery();
  const [loadMoreSpecialist, specialistMore] =
    generatedApi.endpoints.apiProjectsSpecialistList.useLazyQuery();
  const isLoadingMore = allMore.isFetching || specialistMore.isFetching;

  const loaded = extra.key === listKey ? extra : NO_EXTRA_PAGES;
  const results = [...(data?.results ?? []), ...loaded.items];
  const nextUrl = loaded.page > 1 ? loaded.next : data?.next ?? null;

  const handleLoadMore = async () => {
    const nextPage = loaded.page + 1;
    setLoadMoreError(null);
    try {
      const response = isSpecialistMode
        ? await loadMoreSpecialist({
            specialistId: specialistId ?? 0,
            search,
            ordering: sortBy,
            page: nextPage,
          }).unwrap()
        : await loadMoreAll({ search, ordering: sortBy, page: nextPage }).unwrap();
      setExtra({
        key: listKey,
        page: nextPage,
        items: [...loaded.items, ...response.results],
        next: response.next ?? null,
      });
    } catch (err) {
      setLoadMoreError(formatApiError(err, "Не удалось загрузить проекты."));
    }
  };

  const renderResults = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <p className="text-[#666666]">Загрузка проектов...</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center py-12">
          <p className="text-lg font-medium text-[#666666]">
            Не удалось загрузить проекты
          </p>
          <p className="text-sm text-[#666666] mt-2">
            Проверьте соединение и попробуйте ещё раз
          </p>
          <Button className="mt-6 rounded-[40px]" onClick={() => refetch()}>
            Повторить
          </Button>
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <div className="text-center py-12">
          <Search className="w-12 h-12 mx-auto mb-4 text-[#666666] opacity-50" />
          <p className="text-lg font-medium text-[#666666]">
            Проекты не найдены
          </p>
          <p className="text-sm text-[#666666] mt-2">
            Попробуйте изменить параметры поиска
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        {loadMoreError && (
          <p className="text-center text-sm text-red-500 mt-6">{loadMoreError}</p>
        )}
        {nextUrl && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              className="rounded-[40px]"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? "Загрузка..." : "Показать ещё"}
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-left mb-2">
            {isSpecialistMode ? "Проекты специалиста" : "Все проекты"}
          </h1>
          <p className="text-[#666666] text-sm sm:text-base">
            Портфолио работ наших архитекторов и дизайнеров
          </p>
        </div>
        {/* Проекты публикуют и специалисты, и компании */}
        {isAuthenticated && (
          <Link href="/projects/create">
            <Button className="w-full sm:w-auto rounded-[40px] gap-2">
              <Plus className="w-4 h-4" />
              Создать проект
            </Button>
          </Link>
        )}
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

      {renderResults()}
    </section>
  );
}

// useSearchParams требует Suspense-границу, иначе страница не соберётся статически.
export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <section className="container mx-auto relative px-4 sm:px-6 py-8">
          <div className="text-center py-12">
            <p className="text-[#666666]">Загрузка проектов...</p>
          </div>
        </section>
      }
    >
      <ProjectsPageContent />
    </Suspense>
  );
}
