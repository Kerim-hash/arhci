"use client";

import Link from "next/link";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { useApiSpecialistsTopListQuery } from "@/services/generatedApi";

export default function ArchitectureFirms() {
  const { data, isLoading } = useApiSpecialistsTopListQuery({ page: 1 });
  const topSpecialists = data?.results || [];

  return (
    <div className="sticky top-27.5">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок - Архитектурные бюро */}
        <Card className="mb-5 p-5">
          <h5 className="text-[20px] font-semibold text-[#333333] mb-4">
            Архитектурные бюро
          </h5>

          <div className="flex flex-wrap gap-4">
            {isLoading ? (
              <p className="text-gray-500 text-sm">Загрузка...</p>
            ) : Array.from(new Set(topSpecialists.filter((s: any) => s.firm?.trim()).map((s: any) => s.firm.trim()))).length > 0 ? (
              Array.from(new Set(topSpecialists.filter((s: any) => s.firm?.trim()).map((s: any) => s.firm.trim()))).slice(0, 5).map((firm: any, index: number) => (
                <p key={index} className="text-[#333333] text-[16px] hover:text-[#4677F3] cursor-pointer">
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
            Топ Архитекторы
          </h5>

          <div className="flex flex-col gap-3">
            {isLoading ? (
              <p className="text-gray-500 text-sm">Загрузка...</p>
            ) : topSpecialists.length > 0 ? (
              topSpecialists.slice(0, 5).map((specialist: any) => (
                <Link
                  key={specialist.id}
                  href={`/specialists/architects/${specialist.slug}`}
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
