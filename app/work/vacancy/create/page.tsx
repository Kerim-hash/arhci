// app/work/vacancy/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { createVacancy } from "@/app/work/model/vacanciesSlice";
import Link from "next/link";

const EXPERIENCE_OPTIONS = [
  "Без опыта",
  "1-3 года",
  "3-6 лет",
  "6+ лет",
  "По доверенности",
];

export default function CreateVacancyPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.authSlice.user);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [experience, setExperience] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");

  const [responsibilities, setResponsibilities] = useState<string[]>([""]);
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [benefits, setBenefits] = useState<string[]>([""]);

  const handleListItemChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const addListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => [...prev, ""]);
  };

  const removeListItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setter((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !user) return;
    setIsSubmitting(true);

    try {
      const vacancyData = {
        title,
        salaryFrom: Number(salaryFrom) || 0,
        salaryTo: Number(salaryTo) || 0,
        experience,
        company: company || user.name || "",
        address,
        responsibilities: responsibilities.filter((r) => r.trim() !== ""),
        requirements: requirements.filter((r) => r.trim() !== ""),
        benefits: benefits.filter((b) => b.trim() !== ""),
      };

      await dispatch(createVacancy(vacancyData)).unwrap();
      router.push("/work");
    } catch (error) {
      console.error("Ошибка создания вакансии:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8 max-w-[800px]">
      {/* Навигация */}
      <div className="mb-6">
        <nav className="text-sm text-gray-500">
          <Link href="/work" className="hover:text-gray-700">
            Работа
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Создать вакансию</span>
        </nav>
      </div>

      <h1 className="text-2xl font-bold mb-8">Создание вакансии</h1>

      <div className="space-y-8">
        {/* ===== Должность ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Должность</h2>
          <Separator className="mb-4" />
          <div>
            <label className="text-sm font-medium text-[#333] mb-2 block">
              Название вакансии
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ведущий архитектор (Lead Architect)"
            />
          </div>
        </div>

        {/* ===== Зарплата ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Зарплата</h2>
          <Separator className="mb-4" />
          <div>
            <label className="text-sm font-medium text-[#333] mb-2 block">
              Диапазон зарплаты (₽)
            </label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={salaryFrom}
                onChange={(e) => setSalaryFrom(e.target.value)}
                placeholder="от"
                className="flex-1"
              />
              <span className="text-[#949494]">—</span>
              <Input
                type="number"
                value={salaryTo}
                onChange={(e) => setSalaryTo(e.target.value)}
                placeholder="до"
                className="flex-1"
              />
            </div>
            <p className="text-xs text-[#949494] mt-2">
              Оставьте пустым, если зарплата не указывается
            </p>
          </div>
        </div>

        {/* ===== Опыт ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Требуемый опыт</h2>
          <Separator className="mb-4" />
          <div className="flex flex-wrap gap-2">
            {EXPERIENCE_OPTIONS.map((exp) => (
              <Badge
                key={exp}
                variant={experience === exp ? "default" : "outline"}
                className="cursor-pointer text-sm py-1.5 px-4"
                onClick={() => setExperience(exp)}
              >
                {exp}
              </Badge>
            ))}
          </div>
        </div>

        {/* ===== Компания ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Компания</h2>
          <Separator className="mb-4" />
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Название компании
              </label>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="ООО «Архитектурное бюро»"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Адрес
              </label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Бишкек, улица Акариба Банкова, 148/3"
              />
            </div>
          </div>
        </div>

        {/* ===== Детали вакансии ===== */}
        <div className="space-y-8">
          {/* Обязанности */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Обязанности</h2>
            <Separator className="mb-4" />
            <div className="space-y-2">
              {responsibilities.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) =>
                      handleListItemChange(setResponsibilities, index, e.target.value)
                    }
                    placeholder="Что нужно будет делать..."
                  />
                  {responsibilities.length > 1 && (
                    <button
                      onClick={() => removeListItem(setResponsibilities, index)}
                      className="text-[#949494] hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addListItem(setResponsibilities)}
                className="text-sm text-[#949494] hover:text-[#333] mt-2 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Добавить пункт
              </button>
            </div>
          </div>

          {/* Требования */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Требования</h2>
            <Separator className="mb-4" />
            <div className="space-y-2">
              {requirements.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) =>
                      handleListItemChange(setRequirements, index, e.target.value)
                    }
                    placeholder="Знание ПО, опыт, навыки..."
                  />
                  {requirements.length > 1 && (
                    <button
                      onClick={() => removeListItem(setRequirements, index)}
                      className="text-[#949494] hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addListItem(setRequirements)}
                className="text-sm text-[#949494] hover:text-[#333] mt-2 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Добавить пункт
              </button>
            </div>
          </div>

          {/* Мы предлагаем */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Мы предлагаем</h2>
            <Separator className="mb-4" />
            <div className="space-y-2">
              {benefits.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) =>
                      handleListItemChange(setBenefits, index, e.target.value)
                    }
                    placeholder="Условия, бонусы, офис..."
                  />
                  {benefits.length > 1 && (
                    <button
                      onClick={() => removeListItem(setBenefits, index)}
                      className="text-[#949494] hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addListItem(setBenefits)}
                className="text-sm text-[#949494] hover:text-[#333] mt-2 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Добавить пункт
              </button>
            </div>
          </div>
        </div>

        {/* ===== Кнопки действий ===== */}
        <Separator />
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Link href="/work">
            <Button variant="outline" className="rounded-[40px] w-full sm:w-auto">
              Отмена
            </Button>
          </Link>
          <Button
            className="rounded-[40px] w-full sm:w-auto"
            onClick={handleSubmit}
            disabled={!title.trim() || isSubmitting}
          >
            {isSubmitting ? "Создание..." : "Опубликовать вакансию"}
          </Button>
        </div>
      </div>
    </section>
  );
}
