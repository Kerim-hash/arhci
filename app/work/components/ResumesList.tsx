// components/ResumesList.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { setSearchQuery } from "@/app/store/features/resumesSlice";
import { ResumeCard } from "./ResumeCard";

export function ResumesList() {
  const dispatch = useAppDispatch();
  const { resumes, searchQuery, filters } = useAppSelector(
    (state) => state.resumes,
  );

  const filteredResumes = resumes.filter((resume) => {
    // Поиск по имени и описанию
    const matchesSearch =
      resume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resume.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Фильтр по специализации
    const matchesSpecialization =
      filters.specializations.length === 0 ||
      filters.specializations.some((spec) =>
        resume.specialization.includes(spec),
      );

    // Фильтр по опыту
    const matchesExperience =
      !filters.experience || resume.experience === filters.experience;

    // Фильтр по программам
    const matchesSoftware =
      filters.software.length === 0 ||
      filters.software.some((sw) => resume.software.includes(sw));

    // Фильтр по типу занятости
    const matchesEmployment =
      filters.employmentType.length === 0 ||
      filters.employmentType.some((type) =>
        resume.employmentType.includes(type),
      );

    // Фильтр по региону
    const matchesRegion =
      !filters.region || filters.region === "all" || resume.region === filters.region;

    // Фильтр по зарплате
    const matchesIncome =
      (!filters.incomeFrom ||
        resume.salaryFrom >= Number(filters.incomeFrom)) &&
      (!filters.incomeTo || resume.salaryFrom <= Number(filters.incomeTo));

    // Фильтр по наличию дохода
    const matchesHasIncome =
      !filters.hasIncome || resume.salaryFrom > 0;

    return (
      matchesSearch &&
      matchesSpecialization &&
      matchesExperience &&
      matchesSoftware &&
      matchesEmployment &&
      matchesRegion &&
      matchesIncome &&
      matchesHasIncome
    );
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          leftIcon={<Search className="text-gray-400 h-4 w-4" />}
          placeholder="Поиск резюме..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="pl-10 rounded-[40px]"
        />
      </div>

      <div className="space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {filteredResumes.map((resume) => (
          <ResumeCard key={resume.id} resume={resume} />
        ))}

        {filteredResumes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Ничего не найдено
          </div>
        )}
      </div>
    </div>
  );
}
