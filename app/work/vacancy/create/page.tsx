// app/work/vacancy/create/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useApiVacanciesCreateCreateMutation } from "@/services/generatedApi";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { SPECIALTIES, type SpecialtyId } from "@/lib/specialties";
import { displayName } from "@/lib/displayName";
import { formatApiError } from "@/lib/formatApiError";
import {
  EMPLOYMENT_OPTIONS,
  SOFTWARE_OPTIONS,
  VACANCY_EXPERIENCE_OPTIONS,
} from "../../model/options";

const CURRENCY_OPTIONS = ["сом", "₽", "USD", "EUR"];

// Подписи полей для ошибок валидации с бэкенда
const FIELD_LABELS: Record<string, string> = {
  title: "Название вакансии",
  specialization: "Специализация",
  salaryFrom: "Зарплата от",
  salaryTo: "Зарплата до",
  companyName: "Название компании",
  companyEmail: "Email компании",
  publisherEmail: "Email для связи",
  programs: "Программы",
};

const REQUIRED_MSG = "Это поле не может быть пустым.";

const SCHEDULE_OPTIONS = [
  "Полный день",
  "Сменный график",
  "Гибкий график",
  "Удаленная работа",
  "Гибридный формат",
];

const WORK_FORMAT_OPTIONS = ["Офис", "Удаленка", "Гибрид"];

export default function CreateVacancyPage() {
  const router = useRouter();
  const [createVacancy] = useApiVacanciesCreateCreateMutation();
  const { user, isAuthenticated } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);

  // States
  const [title, setTitle] = useState("");
  const [specialization, setSpecialization] = useState<SpecialtyId | "">("");
  const [programs, setPrograms] = useState<string[]>([]);
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [currency, setCurrency] = useState("сом");
  const [experience, setExperience] = useState("");
  
  const [workPlace, setWorkPlace] = useState("");
  const [employment, setEmployment] = useState("");
  const [schedule, setSchedule] = useState("");
  const [workFormat, setWorkFormat] = useState("");
  const [workingHours, setWorkingHours] = useState("");

  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");

  const [publisherName, setPublisherName] = useState("");
  const [publisherPosition, setPublisherPosition] = useState("");
  const [publisherPhone, setPublisherPhone] = useState("");
  const [publisherEmail, setPublisherEmail] = useState("");

  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState<string[]>([""]);
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [benefits, setBenefits] = useState<string[]>([""]);

  // Предзаполняем компанию и контактное лицо, когда профиль загрузится.
  // В профиле нет поля `name`, поэтому имя собирает displayName(); уже
  // введённое вручную значение не перетираем.
  useEffect(() => {
    if (!user) return;
    const name = displayName(user);
    setCompany((prev) => prev || name);
    setPublisherName((prev) => prev || name);
    setPublisherEmail((prev) => prev || user.email || "");
  }, [user]);

  const toggleProgram = (value: string) => {
    setPrograms((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

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
    if (!title.trim()) {
      setTitleError(REQUIRED_MSG);
      toast.error("Укажите название вакансии.");
      return;
    }
    if (!isAuthenticated || !user) {
      toast.error("Пожалуйста, войдите в систему, чтобы опубликовать вакансию.");
      return;
    }
    setIsSubmitting(true);

    try {
      await createVacancy({
        vacancyCreate: {
          title: title.trim(),
          specialization: specialization || undefined,
          programs,
          salaryFrom: Number(salaryFrom) || undefined,
          salaryTo: Number(salaryTo) || undefined,
          currency,
          experience,
          description,
          responsibilities: responsibilities.filter((r) => r.trim() !== ""),
          requirements: requirements.filter((r) => r.trim() !== ""),
          offers: benefits.filter((b) => b.trim() !== ""),
          workPlace: workPlace,
          employment,
          schedule,
          workingHours: workingHours,
          workFormat: workFormat,
          companyName: company.trim() || displayName(user),
          companyAddress: address,
          companyWebsite: companyWebsite,
          companyPhone: companyPhone,
          companyEmail: companyEmail,
          companyDescription: companyDescription,
          publisherName: publisherName,
          publisherPosition: publisherPosition,
          publisherPhone: publisherPhone,
          publisherEmail: publisherEmail,
        },
      }).unwrap();
      toast.success("Вакансия отправлена на модерацию");
      router.push("/profile");
    } catch (error) {
      console.error("Ошибка создания вакансии:", error);
      toast.error(formatApiError(error, "Не удалось отправить вакансию.", FIELD_LABELS));
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
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleError(null);
              }}
              placeholder="Ведущий архитектор (Lead Architect)"
              className={titleError ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {titleError && <p className="text-sm text-red-500 mt-1">{titleError}</p>}
          </div>
          {/* По специализации вакансию находят через фильтр в разделе «Работа» */}
          <div className="mt-4">
            <label className="text-sm font-medium text-[#333] mb-2 block">
              Специализация
            </label>
            <div className="flex flex-wrap gap-2">
              {SPECIALTIES.map((spec) => (
                <Badge
                  key={spec.id}
                  variant={specialization === spec.id ? "default" : "outline"}
                  className="cursor-pointer text-sm py-1.5 px-4"
                  onClick={() =>
                    setSpecialization(specialization === spec.id ? "" : spec.id)
                  }
                >
                  {spec.plural}
                </Badge>
              ))}
            </div>
          </div>
          {/* По программам вакансию тоже находят через фильтр */}
          <div className="mt-4">
            <label className="text-sm font-medium text-[#333] mb-2 block">
              Программы / ПО
            </label>
            <div className="flex flex-wrap gap-2">
              {SOFTWARE_OPTIONS.map((program) => (
                <Badge
                  key={program}
                  variant={programs.includes(program) ? "default" : "outline"}
                  className="cursor-pointer text-sm py-1.5 px-4"
                  onClick={() => toggleProgram(program)}
                >
                  {program}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* ===== Зарплата ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Зарплата и валюта</h2>
          <Separator className="mb-4" />
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Диапазон зарплаты
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

            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Валюта
              </label>
              <div className="flex flex-wrap gap-2">
                {CURRENCY_OPTIONS.map((curr) => (
                  <Badge
                    key={curr}
                    variant={currency === curr ? "default" : "outline"}
                    className="cursor-pointer text-sm py-1.5 px-4"
                    onClick={() => setCurrency(curr)}
                  >
                    {curr}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===== Опыт ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Требуемый опыт</h2>
          <Separator className="mb-4" />
          <div className="flex flex-wrap gap-2">
            {VACANCY_EXPERIENCE_OPTIONS.map((exp) => (
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

        {/* ===== Условия работы ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Условия работы</h2>
          <Separator className="mb-4" />
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Место работы (город, регион)
              </label>
              <Input
                value={workPlace}
                onChange={(e) => setWorkPlace(e.target.value)}
                placeholder="Бишкек, Кыргызстан"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Занятость
              </label>
              <div className="flex flex-wrap gap-2">
                {EMPLOYMENT_OPTIONS.map((emp) => (
                  <Badge
                    key={emp}
                    variant={employment === emp ? "default" : "outline"}
                    className="cursor-pointer text-sm py-1.5 px-4"
                    onClick={() => setEmployment(emp)}
                  >
                    {emp}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                График работы
              </label>
              <div className="flex flex-wrap gap-2">
                {SCHEDULE_OPTIONS.map((sched) => (
                  <Badge
                    key={sched}
                    variant={schedule === sched ? "default" : "outline"}
                    className="cursor-pointer text-sm py-1.5 px-4"
                    onClick={() => setSchedule(sched)}
                  >
                    {sched}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Формат работы
              </label>
              <div className="flex flex-wrap gap-2">
                {WORK_FORMAT_OPTIONS.map((format) => (
                  <Badge
                    key={format}
                    variant={workFormat === format ? "default" : "outline"}
                    className="cursor-pointer text-sm py-1.5 px-4"
                    onClick={() => setWorkFormat(format)}
                  >
                    {format}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Рабочие часы
              </label>
              <Input
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                placeholder="Например: 9:00 - 18:00"
              />
            </div>
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
                Адрес компании
              </label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Бишкек, улица Акариба Банкова, 148/3"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-[#333] mb-2 block">
                  Сайт компании
                </label>
                <Input
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#333] mb-2 block">
                  Телефон компании
                </label>
                <Input
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  placeholder="+996 XXX XXX XXX"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#333] mb-2 block">
                  Email компании
                </label>
                <Input
                  value={companyEmail}
                  type="email"
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="hr@example.com"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Описание компании
              </label>
              <Textarea
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
                placeholder="Расскажите немного о вашей компании, проектах и команде..."
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* ===== Контактное лицо ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Контактное лицо (Публикатор)</h2>
          <Separator className="mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Имя контактного лица
              </label>
              <Input
                value={publisherName}
                onChange={(e) => setPublisherName(e.target.value)}
                placeholder="Александр Иванов"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Должность
              </label>
              <Input
                value={publisherPosition}
                onChange={(e) => setPublisherPosition(e.target.value)}
                placeholder="HR-менеджер"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Телефон для связи
              </label>
              <Input
                value={publisherPhone}
                onChange={(e) => setPublisherPhone(e.target.value)}
                placeholder="+996 XXX XXX XXX"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Email для связи
              </label>
              <Input
                value={publisherEmail}
                type="email"
                onChange={(e) => setPublisherEmail(e.target.value)}
                placeholder="alexander@example.com"
              />
            </div>
          </div>
        </div>

        {/* ===== Детали вакансии ===== */}
        <div className="space-y-8">
          {/* Описание вакансии */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Описание вакансии</h2>
            <Separator className="mb-4" />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Подробно опишите вакансию, задачи, стек технологий..."
              rows={6}
            />
          </div>

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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Отправка..." : "Отправить на модерацию"}
          </Button>
        </div>
      </div>
    </section>
  );
}
