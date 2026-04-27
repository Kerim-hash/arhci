// components/VacancyDetail.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import type { VacancyDetail, SimilarVacancy } from "@/types/vacancy";
import { useAppDispatch } from "@/app/store/hooks";
import { respondToVacancy } from "@/app/store/features/vacancyDetailSlice";
import { useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface VacancyDetailProps {
  vacancy: VacancyDetail;
}

export function VacancyDetailComponent({ vacancy }: VacancyDetailProps) {
  const dispatch = useAppDispatch();
  const [isResponding, setIsResponding] = useState(false);

  const handleRespond = () => {
    setIsResponding(true);
    dispatch(respondToVacancy(vacancy.id.toString())).finally(() => {
      setIsResponding(false);
    });
  };

  return (
    <div className="container mx-auto ">
      <Breadcrumb >
        <BreadcrumbList className="p-0!">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Работа</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/vacancy">Вакансии</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Левая колонка - основная информация */}
        <div className="lg:col-span-2 space-y-6">
          {/* Заголовок и основная инфо */}
          <Card>
            <CardContent className="p-0! space-y-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">{vacancy.title}</h1>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1 font-semibold">
                      <span>
                        {vacancy.salaryFrom?.toLocaleString()} —{" "}
                        {vacancy.salaryTo?.toLocaleString()} {vacancy.currency}
                      </span>
                    </div>
                    <div className="flex bg-[#F5F5F7] px-2 py-1 rounded-[40px] items-center gap-1 text-[#949494]">
                      <span className="text-sm">
                        Опыт: {vacancy.experience || "не указан"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Детали работы */}

              <div className="flex items-center justify-between">
                <div className="text-[16px] text-[#333333]">Место работы</div>
                <div className="text-[#333333] text-[16px] font-medium">
                  {vacancy.workPlace || "Не указано"}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[16px] text-[#333333]">Занятость</div>
                <div className="text-[#333333] text-[16px] font-medium">
                  {vacancy.employment || "Не указана"}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[16px] text-[#333333]">График</div>
                <div className="text-[#333333] text-[16px] font-medium">
                  {vacancy.schedule || "Не указан"}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[16px] text-[#333333]">Рабочие часы</div>
                <div className="text-[#333333] text-[16px] font-medium">
                  {vacancy.workingHours || "Не указаны"}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[16px] text-[#333333]">Формат работы</div>
                <div className="text-[#333333] text-[16px] font-medium">
                  {vacancy.workFormat || "Не указан"}
                </div>
              </div>
              <Button
                className="w-fit rounded-[40px]"
                onClick={handleRespond}
                disabled={isResponding}
              >
                {isResponding ? "Отправка..." : "Откликнуться"}
              </Button>
            </CardContent>
          </Card>

          {/* Описание */}
          {vacancy.description && (
            <p className="text-gray-700 leading-relaxed">
              {vacancy.description}
            </p>
          )}

          {/* Обязанности */}
          {vacancy.responsibilities && vacancy.responsibilities.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Обязанности</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {vacancy.responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {/* Требования */}
          {vacancy.requirements && vacancy.requirements.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Требования</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {vacancy.requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {/* Мы предлагаем */}
          {vacancy.offers && vacancy.offers.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Мы предлагаем</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {vacancy.offers.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {/* Ключевые навыки */}
          {vacancy.keySkills && vacancy.keySkills.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Ключевые навыки</h2>
              <div className="flex flex-wrap gap-2">
                {vacancy.keySkills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-sm py-1 px-3"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </>
          )}

          {/* Похожие вакансии */}
          {vacancy.similarVacancies && vacancy.similarVacancies.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Похожие вакансии</h2>
              <div className="space-y-4">
                {vacancy.similarVacancies.map((similar) => (
                  <SimilarVacancyCard key={similar.id} vacancy={similar} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-0!">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Опубликовал</h3>
                  <p className="text-gray-600">
                    {vacancy.publisher?.name || "HR-менеджер"}
                  </p>
                </div>
              </div>

              {vacancy.publisher?.phone && (
                <p className="text-sm text-gray-500 mb-2">
                  Телефон: {vacancy.publisher.phone}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Компонент карточки похожей вакансии
function SimilarVacancyCard({ vacancy }: { vacancy: SimilarVacancy }) {
  const hasSalary = vacancy.salaryFrom && vacancy.salaryTo;
  const [isResponding, setIsResponding] = useState(false);
  const dispatch = useAppDispatch();

  const handleRespond = () => {
    setIsResponding(true);
    dispatch(respondToVacancy(vacancy.id.toString())).finally(() => {
      setIsResponding(false);
    });
  };

  return (
    <Card className="transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{vacancy.title}</h3>
        <div className="flex items-center gap-4">
          <div className="mb-2">
            {hasSalary ? (
              <div className="font-medium text-sm">
                {vacancy.salaryFrom!.toLocaleString()} —{" "}
                {vacancy.salaryTo!.toLocaleString()} {vacancy.currency}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                {vacancy.salaryType || "По договоренности"}
              </div>
            )}
          </div>

          {vacancy.experience && (
            <div className="flex bg-[#F5F5F7] px-2 py-1 rounded-[40px] items-center gap-1 text-[#949494]">
              <span className="text-sm">
                Опыт: {vacancy.experience || "не указан"}
              </span>
            </div>
          )}
        </div>
        <div className="text-sm text-gray-600 mb-1">{vacancy.company}</div>
        <div className="text-xs text-gray-400 mb-3">{vacancy.address}</div>

        <Button
          className="rounded-[40px]"
          size="sm"
          onClick={handleRespond}
          disabled={isResponding}
        >
          {isResponding ? "Отправка..." : "Откликнуться"}
        </Button>
      </CardContent>
    </Card>
  );
}
