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
            {/* Пока статика, так как в API нет отдельного эндпоинта для бюро, 
                либо можно фильтровать специалистов по категории "компании" */}
            <p className="text-[#333333] text-[16px] hover:text-[#4677F3] cursor-pointer">
              Schema
            </p>
            <p className="text-[#333333] text-[16px] hover:text-[#4677F3] cursor-pointer">
              GeoMetric Design
            </p>
            <p className="text-[#333333] text-[16px] hover:text-[#4677F3] cursor-pointer">
              Plane & Angle Studio
            </p>
            <p className="text-[#333333] text-[16px] hover:text-[#4677F3] cursor-pointer">
              Zenith
            </p>
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
