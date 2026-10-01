"use client";

import {
  generatedApi,
  useApiSpecialistsListQuery,
  type SpecialistListRead,
} from "@/services/generatedApi";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import SpecialistCard from "../components/SpecialistCard";
import { formatApiError } from "@/lib/formatApiError";

// Опции сортировки
const sortOptions = [
  { value: "-rating", label: "По рейтингу (высший)" },
  { value: "rating", label: "По рейтингу (низший)" },
  { value: "-views", label: "По просмотрам" },
  { value: "-likes", label: "По оценкам" },
  { value: "name", label: "По имени (А-Я)" },
  { value: "-name", label: "По имени (Я-А)" },
];

const CATEGORY = "architects";

// Страницы после первой копятся здесь; ключ — параметры списка,
// при их смене накопленное отбрасывается само.
interface ExtraPages {
  key: string;
  page: number;
  items: SpecialistListRead[];
  next: string | null;
}

const NO_EXTRA_PAGES: ExtraPages = { key: "", page: 1, items: [], next: null };

export default function ArchitectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("-rating");
  const [extra, setExtra] = useState<ExtraPages>(NO_EXTRA_PAGES);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  const search = searchTerm || undefined;
  const listKey = `${searchTerm}|${sortBy}`;

  const { data, isLoading } = useApiSpecialistsListQuery({
    category: CATEGORY,
    search,
    ordering: sortBy,
    page: 1,
  });
  const [loadMore, { isFetching: isLoadingMore }] =
    generatedApi.endpoints.apiSpecialistsList.useLazyQuery();

  const loaded = extra.key === listKey ? extra : NO_EXTRA_PAGES;
  const filteredAndSortedArchitects = [...(data?.results || []), ...loaded.items];
  const nextUrl = loaded.page > 1 ? loaded.next : data?.next ?? null;

  // Функция для сброса поиска
  const resetSearch = () => {
    setSearchTerm("");
    setSortBy("-rating");
  };

  const handleLoadMore = async () => {
    const nextPage = loaded.page + 1;
    setLoadMoreError(null);
    try {
      const response = await loadMore({
        category: CATEGORY,
        search,
        ordering: sortBy,
        page: nextPage,
      }).unwrap();
      setExtra({
        key: listKey,
        page: nextPage,
        items: [...loaded.items, ...response.results],
        next: response.next ?? null,
      });
    } catch (err) {
      setLoadMoreError(formatApiError(err, "Не удалось загрузить специалистов."));
    }
  };

  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-left mb-2">
          Архитекторы
        </h1>
        <p className="text-[#666666] text-sm sm:text-base">
          Профессиональные архитекторы для создания уникальных и функциональных
          пространств
        </p>
      </div>
      <Separator className="bg-[#333333] mb-6" />

      {/* Search and Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Поиск архитекторов по имени, компании или описанию..."
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

      {/* Результаты */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-[#666666]">
          Найдено: {data?.count ?? 0} архитекторов
        </p>
        {searchTerm && (
          <Button variant="ghost" size="sm" onClick={resetSearch}>
            Очистить поиск
          </Button>
        )}
      </div>

      {/* Grid карточек */}
      {isLoading ? (
        <div className="text-center py-12 text-[#666666]">Загрузка...</div>
      ) : filteredAndSortedArchitects.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            {filteredAndSortedArchitects.map((architect) => (
              <SpecialistCard
                key={architect.id}
                specialist={architect}
                simplified={false}
              />
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
      ) : (
        <div className="text-center py-12">
          <div className="text-[#666666] mb-4">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Архитекторы не найдены</p>
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
