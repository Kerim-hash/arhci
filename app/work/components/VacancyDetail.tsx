// components/VacancyDetail.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bookmark, User } from "lucide-react";
import {
  useApiVacanciesRespondCreateMutation,
  useApiVacanciesSaveCreateMutation,
  useApiVacanciesSimilarListQuery,
  type VacancyDetailRead,
} from "@/services/generatedApi";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import RichContent from "@/components/content/RichContent";
import { useRole } from "@/hooks/use-role";
import { formatApiError } from "@/lib/formatApiError";
import { asStringArray, formatSalaryRange } from "../model/format";
import { RespondButton } from "./RespondButton";
import { VacancyCard } from "./VacancyCard";

interface VacancyDetailProps {
  vacancy: VacancyDetailRead;
}

// В сгенерированных типах `isSaved` объявлен строкой, по факту приходит boolean.
const isSavedFlag = (value: unknown) => String(value) === "true";

export function VacancyDetailComponent({ vacancy }: VacancyDetailProps) {
  const { isAuthenticated } = useRole();
  const [respondToVacancy] = useApiVacanciesRespondCreateMutation();
  const [toggleSave, { isLoading: isSaving }] = useApiVacanciesSaveCreateMutation();
  const { data: similarData } = useApiVacanciesSimilarListQuery({ id: vacancy.id });
  const similarVacancies = similarData?.results ?? [];

  // Локальный флаг действует, пока с сервера не придёт новое значение
  // (после мутации кэш инвалидируется и `isSaved` обновляется сам).
  const serverSaved = isSavedFlag(vacancy.isSaved);
  const [savedState, setSavedState] = useState({ server: serverSaved, value: serverSaved });
  const isSaved = savedState.server === serverSaved ? savedState.value : serverSaved;

  const handleToggleSave = async () => {
    try {
      const result = await toggleSave({ id: vacancy.id }).unwrap();
      const saved = (result as { saved?: boolean } | null)?.saved;
      setSavedState({
        server: serverSaved,
        value: typeof saved === "boolean" ? saved : !isSaved,
      });
    } catch (error) {
      toast.error(formatApiError(error, "Не удалось сохранить вакансию"));
    }
  };

  const salary = formatSalaryRange(vacancy.salaryFrom, vacancy.salaryTo, vacancy.currency);
  const responsibilities = asStringArray(vacancy.responsibilities);
  const requirements = asStringArray(vacancy.requirements);
  const offers = asStringArray(vacancy.offers);
  const keySkills = asStringArray(vacancy.keySkills);
  const programs = asStringArray(vacancy.programs);

  const hasCompanyDetails = Boolean(
    vacancy.companyAddress ||
      vacancy.companyWebsite ||
      vacancy.companyPhone ||
      vacancy.companyEmail ||
      vacancy.companyDescription,
  );

  return (
    <div className="container mx-auto ">
      <Breadcrumb >
        <BreadcrumbList className="p-0!">
          <BreadcrumbItem>
            <BreadcrumbLink href="/work">Работа</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/work?tab=vacancies">Вакансии</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Левая колонка - основная информация */}
        <div className="lg:col-span-2 space-y-6">
          {/* Заголовок и основная инфо */}
          <Card>
            <CardContent className="p-0! space-y-4">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">{vacancy.title}</h1>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1 font-semibold">
                      <span>{salary ?? "Зарплата не указана"}</span>
                    </div>
                    <div className="flex bg-[#F5F5F7] px-2 py-1 rounded-[40px] items-center gap-1 text-[#949494]">
                      <span className="text-sm">
                        Опыт: {vacancy.experience || "не указан"}
                      </span>
                    </div>
                  </div>
                </div>
                {isAuthenticated && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full shrink-0"
                    onClick={handleToggleSave}
                    disabled={isSaving}
                    aria-pressed={isSaved}
                    aria-label={isSaved ? "Убрать из сохранённых" : "Сохранить вакансию"}
                    title={isSaved ? "Убрать из сохранённых" : "Сохранить вакансию"}
                  >
                    <Bookmark className={isSaved ? "fill-current" : ""} />
                  </Button>
                )}
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
              {programs.length > 0 && (
                <div className="flex items-start justify-between gap-4">
                  <div className="text-[16px] text-[#333333]">Программы</div>
                  <div className="flex flex-wrap justify-end gap-2">
                    {programs.map((program) => (
                      <Badge key={program} variant="outline" className="text-sm py-1 px-3">
                        {program}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <RespondButton
                className="w-fit"
                onRespond={() => respondToVacancy({ id: vacancy.id }).unwrap()}
              />
            </CardContent>
          </Card>

          {/* Описание */}
          {vacancy.description && (
            <RichContent
              className="ck-content text-gray-700 leading-relaxed"
              html={vacancy.description || ""}
            />
          )}

          {/* Обязанности */}
          {responsibilities.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Обязанности</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {/* Требования */}
          {requirements.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Требования</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {/* Мы предлагаем */}
          {offers.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Мы предлагаем</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {offers.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {/* Ключевые навыки */}
          {keySkills.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Ключевые навыки</h2>
              <div className="flex flex-wrap gap-2">
                {keySkills.map((skill, index) => (
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
          {similarVacancies.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Похожие вакансии</h2>
              <div className="space-y-4">
                {similarVacancies.map((similar) => (
                  <VacancyCard key={similar.id} vacancy={similar} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Компания */}
          <Card>
            <CardContent className="p-0! space-y-2">
              <h3 className="font-semibold">Компания</h3>
              <p className="text-gray-800 font-medium">{vacancy.companyName}</p>
              {vacancy.companyAddress && (
                <p className="text-sm text-gray-500">{vacancy.companyAddress}</p>
              )}
              {vacancy.companyWebsite && (
                <p className="text-sm text-gray-500 break-all">
                  Сайт:{" "}
                  <a
                    href={vacancy.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {vacancy.companyWebsite}
                  </a>
                </p>
              )}
              {vacancy.companyPhone && (
                <p className="text-sm text-gray-500">
                  Телефон:{" "}
                  <a href={`tel:${vacancy.companyPhone}`}>{vacancy.companyPhone}</a>
                </p>
              )}
              {vacancy.companyEmail && (
                <p className="text-sm text-gray-500 break-all">
                  Email:{" "}
                  <a href={`mailto:${vacancy.companyEmail}`}>{vacancy.companyEmail}</a>
                </p>
              )}
              {vacancy.companyDescription && (
                <p className="text-sm text-gray-600 pt-2 whitespace-pre-line">
                  {vacancy.companyDescription}
                </p>
              )}
              {!hasCompanyDetails && (
                <p className="text-sm text-gray-400">Подробности о компании не указаны</p>
              )}
            </CardContent>
          </Card>

          {/* Контактное лицо */}
          <Card>
            <CardContent className="p-0!">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Опубликовал</h3>
                  <p className="text-gray-600">
                    {vacancy.publisherName || "HR-менеджер"}
                  </p>
                  {vacancy.publisherPosition && (
                    <p className="text-sm text-gray-500">{vacancy.publisherPosition}</p>
                  )}
                </div>
              </div>

              {vacancy.publisherPhone && (
                <p className="text-sm text-gray-500 mb-2">
                  Телефон:{" "}
                  <a href={`tel:${vacancy.publisherPhone}`}>{vacancy.publisherPhone}</a>
                </p>
              )}
              {vacancy.publisherEmail && (
                <p className="text-sm text-gray-500 mb-2 break-all">
                  Email:{" "}
                  <a href={`mailto:${vacancy.publisherEmail}`}>{vacancy.publisherEmail}</a>
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
