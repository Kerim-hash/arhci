// components/ResumeFiltersSidebar.tsx
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
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { SPECIALTIES } from "@/lib/specialties";
import {
  resetFilters,
  updateFilters,
} from "@/app/store/features/resumesSlice";
import { EXPERIENCE_OPTIONS, REGIONS } from "../model/options";

const REGION_FILTER_OPTIONS = [{ value: "all", label: "Все" }, ...REGIONS];

// Бэкенд фильтрует резюме только по специализации, зарплате «от»,
// опыту и региону — остальные контролы здесь не нужны.
export function ResumeFiltersSidebar() {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.resumes);

  // В фильтре хранятся ключи категорий — их и ждёт бэкенд
  const specializations = SPECIALTIES;

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
        defaultValue={["spec", "income", "experience", "region"]}
      >
        {/* Специализация */}
        <AccordionItem value="spec" className="border rounded-lg px-4">
          <AccordionTrigger>Специализация</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {specializations.map((spec) => (
              <div key={spec.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`resume-${spec.id}`}
                  checked={filters.specializations.includes(spec.id)}
                  onCheckedChange={(checked) => {
                    const newSpecs = checked
                      ? [...filters.specializations, spec.id]
                      : filters.specializations.filter((s) => s !== spec.id);
                    dispatch(updateFilters({ specializations: newSpecs }));
                  }}
                />
                <Label htmlFor={`resume-${spec.id}`}>{spec.plural}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Уровень дохода */}
        <AccordionItem value="income" className="border rounded-lg px-4">
          <AccordionTrigger>Уровень дохода</AccordionTrigger>
          <AccordionContent className="space-y-3">
            <Input
              placeholder="От"
              type="number"
              value={filters.incomeFrom}
              onChange={(e) =>
                dispatch(updateFilters({ incomeFrom: e.target.value }))
              }
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(updateFilters({ incomeFrom: "" }))}
            >
              Сбросить
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Опыт */}
        <AccordionItem value="experience" className="border rounded-lg px-4">
          <AccordionTrigger>Опыт</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {EXPERIENCE_OPTIONS.map((exp) => (
              <div key={exp} className="flex items-center space-x-2">
                <Checkbox
                  id={`resume-${exp}`}
                  checked={filters.experience === exp}
                  onCheckedChange={(checked) => {
                    if (checked) dispatch(updateFilters({ experience: exp }));
                    else dispatch(updateFilters({ experience: "" }));
                  }}
                />
                <Label htmlFor={`resume-${exp}`}>{exp}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Регион */}
        <AccordionItem value="region" className="border rounded-lg px-4">
          <AccordionTrigger>Регион</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {REGION_FILTER_OPTIONS.map((region) => (
                <div key={region.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`resume-region-${region.value}`}
                    checked={
                      region.value === "all"
                        ? !filters.region || filters.region === "all"
                        : filters.region === region.value
                    }
                    onCheckedChange={(checked) => {
                      if (checked)
                        dispatch(updateFilters({ region: region.value }));
                    }}
                  />
                  <Label htmlFor={`resume-region-${region.value}`}>{region.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
