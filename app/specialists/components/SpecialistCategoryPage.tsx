"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import { LoadMoreButton } from "@/app/work/components/LoadMoreButton";
import { usePagedQuery } from "@/app/work/model/usePagedQuery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/hooks/use-debounce";
import type { Specialty } from "@/lib/specialties";
import {
  useApiSpecialistsListQuery,
  type PaginatedSpecialistListListRead,
} from "@/services/generatedApi";

import SpecialistCard from "./SpecialistCard";

const sortOptions = [
  { value: "-rating", label: "По рейтингу (высший)" },
  { value: "rating", label: "По рейтингу (низший)" },
  { value: "-views", label: "По просмотрам" },
  { value: "-likes", label: "По оценкам" },
  { value: "name", label: "По имени (А-Я)" },
  { value: "-name", label: "По имени (Я-А)" },
];

const DEFAULT_ORDERING = "-rating";
const SEARCH_DEBOUNCE_MS = 300;

interface SpecialistCategoryPageProps {
  specialty: Specialty;
  /** Первая страница с сервера — для сортировки по умолчанию и без поиска. */
  initialPage?: PaginatedSpecialistListListRead;
}

/** Каталог одной специальности: поиск, сортировка, «Показать ещё». */
export default function SpecialistCategoryPage({
  specialty,
  initialPage,
}: SpecialistCategoryPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(DEFAULT_ORDERING);
  const search = useDebounce(searchTerm.trim(), SEARCH_DEBOUNCE_MS) || undefined;
  const isDefaultQuery = !search && sortBy === DEFAULT_ORDERING;

  const { items, count, hasMore, isLoading, isLoadingMore, loadMore } = usePagedQuery(
    useApiSpecialistsListQuery,
    { category: specialty.id, search, ordering: sortBy },
    isDefaultQuery ? initialPage : undefined,
  );

  const resetSearch = () => {
    setSearchTerm("");
    setSortBy(DEFAULT_ORDERING);
  };

  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-left mb-2">
          {specialty.plural}
        </h1>
        {specialty.intro && (
          <p className="text-[#666666] text-sm sm:text-base">{specialty.intro}</p>
        )}
      </div>
      <Separator className="bg-[#333333] mb-6" />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={`Поиск ${specialty.genitivePlural} по имени, компании или описанию...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
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
      </div>

      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-[#666666]">
          Найдено: {count ?? 0} {specialty.genitivePlural}
        </p>
        {searchTerm && (
          <Button variant="ghost" size="sm" onClick={resetSearch}>
            Очистить поиск
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-[#666666]">Загрузка...</div>
      ) : items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {items.map((specialist) => (
              <SpecialistCard key={specialist.id} specialist={specialist} simplified={false} />
            ))}
          </div>
          <div className="mt-8">
            <LoadMoreButton hasMore={hasMore} isLoading={isLoadingMore} onClick={loadMore} />
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-[#666666] mb-4">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">{specialty.plural} не найдены</p>
            <p className="text-sm mt-2">Попробуйте изменить параметры поиска</p>
          </div>
          <Button onClick={resetSearch} variant="outline">
            Очистить поиск
          </Button>
        </div>
      )}
    </section>
  );
}
