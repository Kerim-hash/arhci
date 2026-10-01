"use client";

import Link from "next/link";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import {
  useApiSpecialistsTopListQuery,
  type SpecialistListRead,
} from "@/services/generatedApi";

const FIRMS_LIMIT = 5;
const SPECIALISTS_LIMIT = 5;

export default function ArchitectureFirms() {
  const { data, isLoading } = useApiSpecialistsTopListQuery({ page: 1 });
  // /api/specialists/top/ returns a plain array, not the paginated { results } shape.
  const topSpecialists: SpecialistListRead[] = Array.isArray(data)
    ? data
    : data?.results || [];

  // Уникальные названия бюро считаем один раз, а не дважды в разметке
  const firms = Array.from(
    new Set(
      topSpecialists
        .map((specialist) => specialist.firm?.trim() ?? "")
        .filter((firm) => firm !== ""),
    ),
  ).slice(0, FIRMS_LIMIT);

  // У компаний нет своей страницы в /specialists — ссылку вести некуда
  const linkableSpecialists = topSpecialists
    .filter((specialist) => specialist.category !== "companies")
    .slice(0, SPECIALISTS_LIMIT);

  return (
    <div className="sticky top-27.5">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок - Архитектурные бюро */}
        <Card className="mb-5 p-5">
          <h5 className="text-[20px] font-semibold text-[#333333] mb-4">
            Архитектурные бюро
          </h5>

          <div className="grid grid-cols-2 gap-4">
            {isLoading ? (
              <p className="text-gray-500 text-sm">Загрузка...</p>
            ) : firms.length > 0 ? (
              firms.map((firm) => (
                <p key={firm} className="text-[#333333] text-[16px] truncate">
                  {firm}
                </p>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Нет данных</p>
            )}
          </div>
        </Card>

        <Separator className="bg-[#333333] mb-5" />

        <Card className="p-5">
          <h5 className="text-[20px] font-semibold text-[#333333] mb-4">
            Топ специалисты
          </h5>

          <div className="grid grid-cols-2 gap-3">
            {isLoading ? (
              <p className="text-gray-500 text-sm">Загрузка...</p>
            ) : linkableSpecialists.length > 0 ? (
              linkableSpecialists.map((specialist) => (
                <Link
                  key={specialist.id}
                  href={`/specialists/${specialist.category}/${specialist.slug}`}
                  className="text-[#333333] text-[16px] hover:text-[#4677F3] truncate"
                >
                  {specialist.name}
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Нет данных</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
