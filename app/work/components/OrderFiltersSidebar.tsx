// components/OrderFiltersSidebar.tsx
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
import { updateFilters, resetFilters } from "@/app/store/features/ordersSlice";

export function OrderFiltersSidebar() {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.orders);

  const propertyTypes = [
    "Жилая",
    "Коммерческая",
    "Благоустройство",
    "Промышленная",
  ];
  const softwareList = [
    "ArchiCAD",
    "AutoCAD",
    "Revit",
    "3ds Max + Corona",
    "SketchUp",
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
        defaultValue={["type", "budget", "software"]}
      >
        {/* Тип недвижимости */}
        <AccordionItem value="type" className="border rounded-lg px-4">
          <AccordionTrigger>Тип недвижимости</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {propertyTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={filters.propertyTypes.includes(type)}
                  onCheckedChange={(checked) => {
                    const newTypes = checked
                      ? [...filters.propertyTypes, type]
                      : filters.propertyTypes.filter((t) => t !== type);
                    dispatch(updateFilters({ propertyTypes: newTypes }));
                  }}
                />
                <Label htmlFor={type}>{type}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Бюджет заказа */}
        <AccordionItem value="budget" className="border rounded-lg px-4">
          <AccordionTrigger>Бюджет заказа</AccordionTrigger>
          <AccordionContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="От"
                type="number"
                value={filters.budgetFrom}
                onChange={(e) =>
                  dispatch(updateFilters({ budgetFrom: e.target.value }))
                }
              />
              <Input
                placeholder="До"
                type="number"
                value={filters.budgetTo}
                onChange={(e) =>
                  dispatch(updateFilters({ budgetTo: e.target.value }))
                }
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                dispatch(updateFilters({ budgetFrom: "", budgetTo: "" }))
              }
            >
              Сбросить
            </Button>
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
      </Accordion>
    </div>
  );
}
