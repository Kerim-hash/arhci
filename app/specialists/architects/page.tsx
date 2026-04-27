// app/specialists/architects/page.tsx (App Router)
// ИЛИ
// pages/specialists/architects/index.tsx (Pages Router)

"use client";

import { useAppSelector } from "@/app/store/hooks";
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
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import SpecialistCard from "../components/SpecialistCard";

// Опции сортировки
const sortOptions = [
  { value: "rating-desc", label: "По рейтингу (высший)" },
  { value: "rating-asc", label: "По рейтингу (низший)" },
  { value: "views-desc", label: "По просмотрам" },
  { value: "likes-desc", label: "По оценкам" },
  { value: "name-asc", label: "По имени (А-Я)" },
  { value: "name-desc", label: "По имени (Я-А)" },
];

export default function ArchitectsPage() {
  const { specialists } = useAppSelector((state) => state.specialists);
  const allArchitects = specialists.filter((s) => s.category === "architects");

  // Состояния
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating-desc");

  // Функция для сброса поиска
  const resetSearch = () => {
    setSearchTerm("");
    setSortBy("rating-desc");
  };

  // Фильтрация и сортировка архитекторов
  const filteredAndSortedArchitects = useMemo(() => {
    let filtered = [...allArchitects];

    // Поиск по имени, фирме и описанию
    if (searchTerm) {
      filtered = filtered.filter(
        (architect) =>
          architect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          architect.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
          architect.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    // Сортировка
    switch (sortBy) {
      case "rating-desc":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "rating-asc":
        filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case "views-desc":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "likes-desc":
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [allArchitects, searchTerm, sortBy]);

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
          Найдено: {filteredAndSortedArchitects.length} архитекторов
        </p>
        {searchTerm && (
          <Button variant="ghost" size="sm" onClick={resetSearch}>
            Очистить поиск
          </Button>
        )}
      </div>

      {/* Grid карточек */}
      {filteredAndSortedArchitects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
          {filteredAndSortedArchitects.map((architect) => (
            <SpecialistCard
              key={architect.id}
              specialist={architect}
              simplified={false}
            />
          ))}
        </div>
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
