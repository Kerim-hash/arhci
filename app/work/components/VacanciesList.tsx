// components/VacanciesList.tsx (с прокруткой)
"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { VacancyCard } from "./VacancyCard";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { setSearchQuery } from "../model/vacanciesSlice";
import Link from "next/link";

export function VacanciesList() {
  const dispatch = useAppDispatch();
  const { vacancies, searchQuery, filters } = useAppSelector(
    (state) => state.vacancies,
  );

  const filteredVacancies = vacancies.filter((vacancy) => {
    // Поиск по заголовку и компании
    const matchesSearch =
      vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vacancy.company.toLowerCase().includes(searchQuery.toLowerCase());

    // Фильтр по специализации
    const matchesSpecialization =
      filters.specializations.length === 0 ||
      filters.specializations.some((spec) =>
        vacancy.title.toLowerCase().includes(spec.toLowerCase()),
      );

    // Фильтр по опыту
    const matchesExperience =
      !filters.experience || vacancy.experience === filters.experience;

    return matchesSearch && matchesSpecialization && matchesExperience;
  });

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
        {filteredVacancies.map((vacancy, index) => (
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

        {filteredVacancies.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Ничего не найдено
          </div>
        )}
      </div>
    </div>
  );
}
