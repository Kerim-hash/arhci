// components/FiltersSidebar.tsx
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { resetFilters, updateFilters } from "../model/vacanciesSlice";

export function FiltersSidebar() {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.vacancies);

  const specializations = [
    "Архитекторы",
    "Инженеры",
    "Дизайнеры интерьер",
    "Визуализаторы",
  ];
  const softwareList = [
    "ArchiCAD",
    "AutoCAD",
    "Revit",
    "3ds Max + Corona",
    "SketchUp",
  ];
  const experienceList = ["1-3 года", "3-6 лет", "6+ лет"];
  const employmentTypes = ["Полный день (В штат)", "Фриланс", "Проектно"];
  const regions = [
    { value: "all", label: "Все" },
    { value: "bishkek", label: "Бишкек" },
    { value: "osh", label: "Ош" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Фильтры</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch(resetFilters())}
        >
          Сбросить все
        </Button>
      </div>

      <Accordion
        type="multiple"
        className="space-y-2"
        defaultValue={[
          "spec",
          "income",
          "software",
          "experience",
          "employment",
          "region",
        ]}
      >
        {/* Специализация */}
        <AccordionItem value="spec" className="border rounded-lg px-4">
          <AccordionTrigger>Специализация</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {specializations.map((spec) => (
              <div key={spec} className="flex items-center space-x-2">
                <Checkbox
                  id={spec}
                  checked={filters.specializations.includes(spec)}
                  onCheckedChange={(checked) => {
                    const newSpecs = checked
                      ? [...filters.specializations, spec]
                      : filters.specializations.filter((s) => s !== spec);
                    dispatch(updateFilters({ specializations: newSpecs }));
                  }}
                />
                <Label htmlFor={spec}>{spec}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Уровень дохода */}
        <AccordionItem value="income" className="border rounded-lg px-4">
          <AccordionTrigger>Уровень дохода</AccordionTrigger>
          <AccordionContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="От"
                type="number"
                value={filters.incomeFrom}
                onChange={(e) =>
                  dispatch(updateFilters({ incomeFrom: e.target.value }))
                }
              />
              <Input
                placeholder="До"
                type="number"
                value={filters.incomeTo}
                onChange={(e) =>
                  dispatch(updateFilters({ incomeTo: e.target.value }))
                }
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                dispatch(updateFilters({ incomeFrom: "", incomeTo: "" }))
              }
            >
              Сбросить
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Выплаты */}
        <AccordionItem value="payment" className="border rounded-lg px-4">
          <AccordionTrigger>Выплаты</AccordionTrigger>
          <AccordionContent>
            <Select
              value={filters.paymentType}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onValueChange={(value: any) =>
                dispatch(updateFilters({ paymentType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Раз в месяц</SelectItem>
                <SelectItem value="week">Раз в неделю</SelectItem>
                <SelectItem value="day">Ежедневно</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        {/* Указан доход */}
        <AccordionItem value="hasIncome" className="border rounded-lg px-4">
          <AccordionTrigger>Указан доход</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasIncome"
                checked={filters.hasIncome}
                onCheckedChange={(checked) =>
                  dispatch(updateFilters({ hasIncome: !!checked }))
                }
              />
              <Label htmlFor="hasIncome">Только с указанным доходом</Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Программы */}
        <AccordionItem value="software" className="border rounded-lg px-4">
          <AccordionTrigger>Программы</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {softwareList.map((software) => (
              <div key={software} className="flex items-center space-x-2">
                <Checkbox
                  id={software}
                  checked={filters.software.includes(software)}
                  onCheckedChange={(checked) => {
                    const newSoftware = checked
                      ? [...filters.software, software]
                      : filters.software.filter((s) => s !== software);
                    dispatch(updateFilters({ software: newSoftware }));
                  }}
                />
                <Label htmlFor={software}>{software}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Опыт */}
        <AccordionItem value="experience" className="border rounded-lg px-4">
          <AccordionTrigger>Опыт</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {experienceList.map((exp) => (
              <div key={exp} className="flex items-center space-x-2">
                <Checkbox
                  id={exp}
                  checked={filters.experience === exp}
                  onCheckedChange={(checked) => {
                    if (checked) dispatch(updateFilters({ experience: exp }));
                    else dispatch(updateFilters({ experience: "" }));
                  }}
                />
                <Label htmlFor={exp}>{exp}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Тип занятости */}
        <AccordionItem value="employment" className="border rounded-lg px-4">
          <AccordionTrigger>Тип занятости</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {employmentTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={filters.employmentType.includes(type)}
                  onCheckedChange={(checked) => {
                    const newTypes = checked
                      ? [...filters.employmentType, type]
                      : filters.employmentType.filter((t) => t !== type);
                    dispatch(updateFilters({ employmentType: newTypes }));
                  }}
                />
                <Label htmlFor={type}>{type}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Регион */}
        <AccordionItem value="region" className="border rounded-lg px-4">
          <AccordionTrigger>Регион</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {regions.map((region) => (
                <div key={region.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={region.value}
                    checked={filters.region === region.value}
                    onCheckedChange={(checked) => {
                      if (checked)
                        dispatch(updateFilters({ region: region.value }));
                    }}
                  />
                  <Label htmlFor={region.value}>{region.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
