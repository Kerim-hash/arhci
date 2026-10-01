// components/VacanciesList.tsx (с прокруткой)
"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { VacancyCard } from "./VacancyCard";
import { LoadMoreButton } from "./LoadMoreButton";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { setSearchQuery } from "../model/vacanciesSlice";
import { usePagedQuery } from "../model/usePagedQuery";
import { useApiVacanciesListQuery } from "@/services/generatedApi";
import { useDebounce } from "@/hooks/use-debounce";

const SEARCH_DEBOUNCE_MS = 300;

export function VacanciesList() {
  const dispatch = useAppDispatch();
  const { searchQuery, filters } = useAppSelector((state) => state.vacancies);
  const debouncedSearch = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  const { items: vacancies, hasMore, isLoading, isLoadingMore, loadMore } = usePagedQuery(
    useApiVacanciesListQuery,
    {
      search: debouncedSearch || undefined,
      specialization: filters.specializations.join(",") || undefined,
      experience: filters.experience || undefined,
      region: filters.region && filters.region !== "all" ? filters.region : undefined,
      salaryFrom: filters.incomeFrom ? Number(filters.incomeFrom) : undefined,
      salaryTo: filters.incomeTo ? Number(filters.incomeTo) : undefined,
      hasSalary: filters.hasIncome || undefined,
      programs: filters.software.join(",") || undefined,
      employment: filters.employmentType.join(",") || undefined,
    },
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          leftIcon={<Search className="text-gray-400 h-4 w-4" />}
          placeholder="Поиск вакансий..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="pl-10 rounded-[40px]"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Загрузка...</div>
      ) : (
        /* Список с прокруткой */
        <div className="space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          {vacancies.map((vacancy, index) => (
            <div key={vacancy.id} className="relative">
              <div className="absolute -left-6 top-5 text-gray-400 text-sm font-mono">
                {index + 1}
              </div>
              <VacancyCard vacancy={vacancy} />
            </div>
          ))}

          {vacancies.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Ничего не найдено
            </div>
          )}

          <LoadMoreButton hasMore={hasMore} isLoading={isLoadingMore} onClick={loadMore} />
        </div>
      )}
    </div>
  );
}
