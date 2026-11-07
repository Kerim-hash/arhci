// components/VacancyCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  useApiVacanciesRespondCreateMutation,
  type VacancyListRead,
} from "@/services/generatedApi";
import { companyHref } from "@/app/companies/model/listParams";
import { formatSalaryRange } from "../model/format";
import { RespondButton } from "./RespondButton";

interface VacancyCardProps {
  vacancy: VacancyListRead;
}

export function VacancyCard({ vacancy }: VacancyCardProps) {
  const [respondToVacancy] = useApiVacanciesRespondCreateMutation();
  const salary = formatSalaryRange(vacancy.salaryFrom, vacancy.salaryTo, vacancy.currency);

  return (
    <Card className="border border-[#F1EFEF] transition-shadow">
      <CardContent className="p-5">
        <div className="flex justify-between items-start gap-4">
          {/* Левая часть: ссылка на вакансию — заголовок, зарплата и опыт */}
          <Link href={`/work/vacancy/${vacancy.id}`} className="flex-1 block">
            <h3 className="text-[24px] font-bold mb-2 text-primary">
              {vacancy.title}
            </h3>

            {/* Зарплата и опыт в одной строке */}
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              {salary ? (
                <div className="flex items-center gap-1 text-primary font-medium">
                  <span>{salary}</span>
                </div>
              ) : (
                <div className="text-gray-500 text-sm">Зарплата не указана</div>
              )}
              {vacancy.experience && (
                <div className="flex bg-[#F5F5F7] px-2 py-1 rounded-[40px] items-center gap-1 text-[#949494]">
                  <span className="text-sm">Опыт: {vacancy.experience}</span>
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Компания — сосед ссылки на вакансию, а не её потомок: своя ссылка на страницу компании */}
        {vacancy.companyName && (
          <div className="flex items-center gap-1 mb-2 text-primary">
            {vacancy.companySlug ? (
              <Link
                href={companyHref(vacancy.companySlug)}
                className="text-sm font-medium hover:underline"
              >
                {vacancy.companyName}
              </Link>
            ) : (
              <span className="text-sm font-medium">{vacancy.companyName}</span>
            )}
          </div>
        )}

        {/* Адрес */}
        {vacancy.companyAddress && (
          <div className="flex items-center gap-1 text-[#949494]">
            <span className="text-sm">{vacancy.companyAddress}</span>
          </div>
        )}

        {/* Кнопка — сосед ссылки, а не её потомок, иначе <button> внутри <a> */}
        <RespondButton
          className="mt-6"
          onRespond={() => respondToVacancy({ id: vacancy.id }).unwrap()}
        />
      </CardContent>
    </Card>
  );
}
