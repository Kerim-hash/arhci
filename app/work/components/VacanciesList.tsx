// components/VacanciesList.tsx (с прокруткой)
"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { VacancyCard } from "./VacancyCard";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { setSearchQuery } from "../model/vacanciesSlice";
import { useApiVacanciesListQuery } from "@/services/generatedApi";
import Link from "next/link";

export function VacanciesList() {
  const dispatch = useAppDispatch();
  const { searchQuery } = useAppSelector((state) => state.vacancies);

  const { data, isLoading } = useApiVacanciesListQuery({
    search: searchQuery || undefined,
  });
  const vacancies = data?.results || [];

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Загрузка...</div>;
  }

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

      {/* Список с прокруткой */}
      <div className="space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {vacancies.map((vacancy: any, index: number) => (
          <Link
            href={`/work/vacancy/${vacancy.id}`}
            key={vacancy.id}
            className="relative block"
          >
            <div className="absolute -left-6 top-5 text-gray-400 text-sm font-mono">
              {index + 1}
            </div>
            <VacancyCard vacancy={vacancy} />
          </Link>
        ))}

        {vacancies.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Ничего не найдено
          </div>
        )}
      </div>
    </div>
  );
}
