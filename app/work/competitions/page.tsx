// app/competitions/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchCompetitions } from "@/app/store/features/competitionsSlice";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import CompetitionCard from "@/app/work/competitions/components/CompetitionCard";
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
  { value: "deadline", label: "Скоро закрытие" },
  { value: "popular", label: "По популярности" },
  { value: "prize", label: "По призовому фонду" },
];

export default function CompetitionsPage() {
  const dispatch = useAppDispatch();
  const { competitions, loading } = useAppSelector((state) => state.competitions);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showActive, setShowActive] = useState(false);

  useEffect(() => {
    dispatch(fetchCompetitions());
  }, [dispatch]);

  const filteredAndSortedCompetitions = () => {
    let filtered = [...competitions];

    if (searchTerm) {
      filtered = filtered.filter(
        (comp) =>
          comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          comp.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (showActive) {
      filtered = filtered.filter((comp) => comp.isActive);
    }

    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "deadline":
        filtered.sort((a, b) =>
          new Date(a.dates.submissionDeadline).getTime() - new Date(b.dates.submissionDeadline).getTime()
        );
        break;
      case "popular":
        filtered.sort((a, b) => b.views - a.views);
        break;
      case "prize":
        filtered.sort((a, b) => b.participantsCount - a.participantsCount);
        break;
    }

    return filtered;
  };

  const results = filteredAndSortedCompetitions();

  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-left mb-2">
          Архитектурные конкурсы
        </h1>
        <p className="text-[#666666] text-sm sm:text-base">
          Участвуйте в международных конкурсах и выигрывайте гранты
        </p>
      </div>
      <Separator className="bg-[#333333] mb-6" />

      {/* Поиск и фильтры */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Поиск конкурсов по названию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
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

          <Button
            variant={showActive ? "default" : "outline"}
            onClick={() => setShowActive(!showActive)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Активные
          </Button>
        </div>
      </div>

      {/* Результаты */}
      <div className="mb-4">
        <p className="text-sm text-[#666666]">
          Найдено: {results.length} конкурсов
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="text-[#666666] mt-4">Загрузка конкурсов...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((competition) => (
            <CompetitionCard key={competition.id} competition={competition} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="w-12 h-12 mx-auto mb-4 text-[#666666] opacity-50" />
          <p className="text-lg font-medium text-[#666666]">Конкурсы не найдены</p>
          <p className="text-sm text-[#666666] mt-2">
            Попробуйте изменить параметры поиска
          </p>
        </div>
      )}
    </section>
  );
}