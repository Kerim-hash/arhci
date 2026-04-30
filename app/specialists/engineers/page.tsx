// app/specialists/engineers/page.tsx

"use client";

import { useApiSpecialistsListQuery } from "@/services/generatedApi";
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

// Опции сортировки
const sortOptions = [
  { value: "-rating", label: "По рейтингу (высший)" },
  { value: "rating", label: "По рейтингу (низший)" },
  { value: "-views", label: "По просмотрам" },
  { value: "-likes", label: "По оценкам" },
  { value: "name", label: "По имени (А-Я)" },
  { value: "-name", label: "По имени (Я-А)" },
];

export default function EngineersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("-rating");

  const { data } = useApiSpecialistsListQuery({
    category: "engineers",
    search: searchTerm || undefined,
    ordering: sortBy,
  });
  const filteredAndSortedEngineers = data?.results || [];

  const resetSearch = () => {
    setSearchTerm("");
    setSortBy("-rating");
  };

  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-left mb-2">
          Инженеры
        </h1>
      
      </div>
      <Separator className="bg-[#333333] mb-6" />

      {/* Search and Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Поиск инженеров по имени, компании или описанию..."
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
          Найдено: {filteredAndSortedEngineers.length} инженеров
        </p>
        {searchTerm && (
          <Button variant="ghost" size="sm" onClick={resetSearch}>
            Очистить поиск
          </Button>
        )}
      </div>

      {/* Grid карточек */}
      {filteredAndSortedEngineers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {filteredAndSortedEngineers.map((engineer) => (
            <SpecialistCard
              key={engineer.id}
              specialist={engineer}
              simplified={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-[#666666] mb-4">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Инженеры не найдены</p>
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
