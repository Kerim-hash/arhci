// components/VacancyCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useApiVacanciesRespondCreateMutation } from "@/services/generatedApi";
import { useState } from "react";
import { RoleGuard } from "@/components/RoleGuard";

interface VacancyCardProps {
  vacancy: any;
}

export function VacancyCard({ vacancy }: VacancyCardProps) {
  const [respondToVacancy] = useApiVacanciesRespondCreateMutation();
  const [isResponding, setIsResponding] = useState(false);
  const hasSalary = vacancy.salaryFrom > 0 || vacancy.salaryTo > 0;

  const handleRespond = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResponding(true);
    try {
      await respondToVacancy({ id: vacancy.id }).unwrap();
      console.log("Отклик отправлен");
    } catch (error) {
      console.error("Ошибка при отклике", error);
    } finally {
      setIsResponding(false);
    }
  };

  return (
    <Card className="border border-[#F1EFEF] transition-shadow">
      <CardContent className="p-5">
        <div className="flex justify-between items-start gap-4">
          {/* Левая часть с контентом - обернута в Link */}
          <Link href={`/work/vacancy/${vacancy.id}`} className="flex-1">
            <div>
              {/* Заголовок */}
              <h3 className="text-[24px] font-bold mb-2 text-primary">
                {vacancy.title}
              </h3>

              {/* Зарплата и опыт в одной строке */}
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                {hasSalary ? (
                  <div className="flex items-center gap-1 text-primary font-medium">
                    <span>
                      {vacancy.salaryFrom.toLocaleString()} ₽ —{" "}
                      {vacancy.salaryTo.toLocaleString()} ₽
                    </span>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">
                    Зарплата не указана
                  </div>
                )}
                <div className="flex bg-[#F5F5F7] px-2 py-1 rounded-[40px] items-center gap-1 text-[#949494]">
                  <span className="text-sm">Опыт: {vacancy.experience}</span>
                </div>
              </div>

              {/* Компания */}
              {vacancy.company && (
                <div className="flex items-center gap-1 mb-2 text-primary">
                  <span className="text-sm font-medium">{vacancy.company}</span>
                </div>
              )}

              {/* Адрес */}
              {vacancy.address && (
                <div className="flex items-center gap-1 text-[#949494]">
                  <span className="text-sm">{vacancy.address}</span>
                </div>
              )}
            </div>
               <RoleGuard role="specialist">
                 <div onClick={(e) => e.stopPropagation()}>
                   <Button
                     className="mt-8 rounded-[40px] whitespace-nowrap"
                     onClick={handleRespond}
                     disabled={isResponding}
                   >
                     {isResponding ? "Отправка..." : "Откликнуться"}
                   </Button>
                 </div>
               </RoleGuard>
          </Link>

        
        </div>
      </CardContent>
    </Card>
  );
}
