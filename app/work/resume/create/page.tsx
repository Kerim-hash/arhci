// app/work/resume/create/page.tsx
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, ArrowLeft } from "lucide-react";
import { useAppSelector } from "@/app/store/hooks";
import { useApiResumesCreateCreateMutation } from "@/services/generatedApi";
import type { WorkExperience } from "@/app/store/features/resumesSlice";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const SPECIALIZATION_OPTIONS = [
  "Архитекторы",
  "Инженеры",
  "Визуализаторы",
  "Дизайнеры интерьер",
];

const SOFTWARE_OPTIONS = [
  "ArchiCAD",
  "AutoCAD",
  "Revit",
  "SketchUp",
  "3ds Max + Corona",
  "Photoshop",
  "Rhino",
];

const EMPLOYMENT_TYPE_OPTIONS = [
  "Полный день (В штат)",
  "Фриланс",
  "Проектно",
  "Удалённо",
];

const EXPERIENCE_OPTIONS = [
  "Без опыта",
  "1-3 года",
  "3-6 лет",
  "6+ лет",
];

const REGION_OPTIONS = [
  { value: "bishkek", label: "Бишкек" },
  { value: "osh", label: "Ош" },
  { value: "other", label: "Другой" },
];

interface WorkExpForm {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  duties: string[];
  achievement: string;
}

interface WorkExpFieldErrors {
  company?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
}

export default function CreateResumePage() {
  const router = useRouter();
  const [createResume] = useApiResumesCreateCreateMutation();
  const { user, isAuthenticated } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [workExpErrors, setWorkExpErrors] = useState<Record<number, WorkExpFieldErrors>>({});

  // Основная информация
  const [name, setName] = useState(user?.name || "");
  const [category, setCategory] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  const [about, setAbout] = useState("");

  // Контакты
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [socialLinks, setSocialLinks] = useState<string[]>([]);
  const [newSocialLink, setNewSocialLink] = useState("");

  // Работа
  const [workPlace, setWorkPlace] = useState("");
  const [employment, setEmployment] = useState("");
  const [schedule, setSchedule] = useState("");
  const [region, setRegion] = useState("");

  // Мультиселекты
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [software, setSoftware] = useState<string[]>([]);
  const [employmentType, setEmploymentType] = useState<string[]>([]);
  const [keySkills, setKeySkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  // Опыт работы
  const [workExperiences, setWorkExperiences] = useState<WorkExpForm[]>([]);

  // --- Хелперы ---

  const toggleMultiSelect = (
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    setter(
      list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value]
    );
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !keySkills.includes(trimmed)) {
      setKeySkills([...keySkills, trimmed]);
      setNewSkill("");
    }
  };

  const addSocialLink = () => {
    const trimmed = newSocialLink.trim();
    if (trimmed && !socialLinks.includes(trimmed)) {
      setSocialLinks([...socialLinks, trimmed]);
      setNewSocialLink("");
    }
  };

  const addWorkExperience = () => {
    setWorkExperiences([
      ...workExperiences,
      {
        id: `${Date.now()}`,
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        duties: [""],
        achievement: "",
      },
    ]);
  };

  const updateWorkExp = (id: string, field: string, value: any) => {
    setWorkExperiences((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const removeWorkExp = (id: string) => {
    setWorkExperiences((prev) => prev.filter((exp) => exp.id !== id));
  };

  const addDuty = (expId: string) => {
    setWorkExperiences((prev) =>
      prev.map((exp) =>
        exp.id === expId ? { ...exp, duties: [...exp.duties, ""] } : exp
      )
    );
  };

  const updateDuty = (expId: string, index: number, value: string) => {
    setWorkExperiences((prev) =>
      prev.map((exp) =>
        exp.id === expId
          ? {
              ...exp,
              duties: exp.duties.map((d, i) => (i === index ? value : d)),
            }
          : exp
      )
    );
  };

  const removeDuty = (expId: string, index: number) => {
    setWorkExperiences((prev) =>
      prev.map((exp) =>
        exp.id === expId
          ? { ...exp, duties: exp.duties.filter((_, i) => i !== index) }
          : exp
      )
    );
  };

  // --- Валидация ---

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const REQUIRED_MSG = "Это поле не может быть пустым.";

  const validate = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError(REQUIRED_MSG);
      isValid = false;
    } else {
      setNameError("");
    }

    if (email.trim() && !EMAIL_PATTERN.test(email.trim())) {
      setEmailError("Введите правильный адрес электронной почты.");
      isValid = false;
    } else {
      setEmailError("");
    }

    const nextWorkExpErrors: Record<number, WorkExpFieldErrors> = {};
    workExperiences.forEach((exp, index) => {
      const errors: WorkExpFieldErrors = {};
      if (!exp.company.trim()) errors.company = REQUIRED_MSG;
      if (!exp.startDate.trim()) errors.startDate = REQUIRED_MSG;
      if (!exp.endDate.trim()) errors.endDate = REQUIRED_MSG;
      if (Object.keys(errors).length > 0) {
        nextWorkExpErrors[index] = errors;
        isValid = false;
      }
    });
    setWorkExpErrors(nextWorkExpErrors);

    return isValid;
  };

  // --- Сабмит ---

  const handleSubmit = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Пожалуйста, войдите в систему, чтобы опубликовать резюме.");
      return;
    }
    if (!validate()) {
      toast.error("Проверьте отмеченные поля в форме.");
      return;
    }
    setIsSubmitting(true);

    try {
      await createResume({
        resumeCreate: {
          name,
          category,
          salaryFrom: Number(salaryFrom) || 0,
          salaryTo: Number(salaryTo) || 0,
          experience,
          specialization: specializations,
          description,
          about,
          software,
          employment_type: employmentType,
          region,
          workPlace: workPlace,
          employment,
          schedule,
          phone,
          email,
          social_links: socialLinks,
          key_skills: keySkills,
          workExperience: workExperiences.map((exp) => ({
            company: exp.company,
            position: exp.position,
            startDate: exp.startDate,
            endDate: exp.endDate,
            duties: exp.duties.filter((d) => d.trim() !== ""),
            achievement: exp.achievement || undefined,
          })),
        },
      }).unwrap();
      toast.success("Резюме успешно опубликовано!");
      router.push("/work");
    } catch (error: any) {
      console.error("Ошибка создания резюме:", error);

      if (typeof error?.data === "string") {
        toast.error(error.data);
      } else if (error?.data?.detail) {
        toast.error(error.data.detail);
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else if (error?.data && typeof error.data === "object") {
        const { name: nameErr, email, workExperience, ...rest } = error.data;

        if (Array.isArray(nameErr) && nameErr[0]) {
          setNameError(nameErr[0]);
        }

        if (Array.isArray(email) && email[0]) {
          setEmailError(email[0]);
        }

        if (Array.isArray(workExperience)) {
          const nextWorkExpErrors: Record<number, WorkExpFieldErrors> = {};
          workExperience.forEach((entry: Record<string, string[]>, index: number) => {
            if (entry && typeof entry === "object") {
              nextWorkExpErrors[index] = {
                company: entry.company?.[0],
                position: entry.position?.[0],
                startDate: entry.startDate?.[0] || entry.start_date?.[0],
                endDate: entry.endDate?.[0] || entry.end_date?.[0],
              };
            }
          });
          setWorkExpErrors(nextWorkExpErrors);
        }

        const remainingMessages = Object.values(rest)
          .flat()
          .filter((v): v is string => typeof v === "string");

        if (remainingMessages.length > 0) {
          toast.error(remainingMessages.join(", "));
        } else if (nameErr || email || workExperience) {
          toast.error("Проверьте отмеченные поля в форме.");
        } else {
          toast.error("Не удалось опубликовать резюме.");
        }
      } else {
        toast.error("Не удалось опубликовать резюме.");
      }
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
          <span className="text-gray-900">Создать резюме</span>
        </nav>
      </div>

      <h1 className="text-2xl font-bold mb-8">Создание резюме</h1>

      <div className="space-y-8">
        {/* ===== Основная информация ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Основная информация</h2>
          <Separator className="mb-4" />
          <div className="space-y-4">
            {/* Имя */}
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Имя
              </label>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError("");
                }}
                placeholder="Иванов Александр Петрович"
                className={nameError ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {nameError && <p className="text-sm text-red-500 mt-1">{nameError}</p>}
            </div>

            {/* Категория */}
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Категория / Должность
              </label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Например: Архитектор, Инженер, Дизайнер интерьера"
              />
            </div>

            {/* Специализация */}
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Специализация
              </label>
              <div className="flex flex-wrap gap-2">
                {SPECIALIZATION_OPTIONS.map((spec) => (
                  <Badge
                    key={spec}
                    variant={specializations.includes(spec) ? "default" : "outline"}
                    className="cursor-pointer text-sm py-1 px-3"
                    onClick={() =>
                      toggleMultiSelect(specializations, setSpecializations, spec)
                    }
                  >
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Зарплата */}
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Желаемая зарплата (сом)
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
            </div>

            {/* Опыт */}
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Опыт работы
              </label>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE_OPTIONS.map((exp) => (
                  <Badge
                    key={exp}
                    variant={experience === exp ? "default" : "outline"}
                    className="cursor-pointer text-sm py-1 px-3"
                    onClick={() => setExperience(exp)}
                  >
                    {exp}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Описание */}
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Краткое описание
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Жилая недвижимость, Проектирование объектов ХоРеКа..."
              />
            </div>
          </div>
        </div>

        {/* ===== О себе ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-4">О себе</h2>
          <Separator className="mb-4" />
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Расскажите о себе, своих навыках и опыте..."
            rows={5}
            className="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#333] focus:border-transparent"
          />
        </div>

        {/* ===== Условия работы ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Условия работы</h2>
          <Separator className="mb-4" />
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#333] mb-2 block">
                  Место работы
                </label>
                <Input
                  value={workPlace}
                  onChange={(e) => setWorkPlace(e.target.value)}
                  placeholder="Кыргызстан"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#333] mb-2 block">
                  Занятость
                </label>
                <Input
                  value={employment}
                  onChange={(e) => setEmployment(e.target.value)}
                  placeholder="Полная, Фриланс..."
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#333] mb-2 block">
                  График
                </label>
                <Input
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  placeholder="5/2, Свободный..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#333] mb-2 block">
                  Регион
                </label>
                <div className="flex flex-wrap gap-2">
                  {REGION_OPTIONS.map((r) => (
                    <Badge
                      key={r.value}
                      variant={region === r.value ? "default" : "outline"}
                      className="cursor-pointer text-sm py-1 px-3"
                      onClick={() => setRegion(r.value)}
                    >
                      {r.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Тип занятости */}
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Тип занятости
              </label>
              <div className="flex flex-wrap gap-2">
                {EMPLOYMENT_TYPE_OPTIONS.map((et) => (
                  <Badge
                    key={et}
                    variant={employmentType.includes(et) ? "default" : "outline"}
                    className="cursor-pointer text-sm py-1 px-3"
                    onClick={() =>
                      toggleMultiSelect(employmentType, setEmploymentType, et)
                    }
                  >
                    {et}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===== Контакты ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Контакты</h2>
          <Separator className="mb-4" />
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#333] mb-2 block">
                  Телефон
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+996 XXX XXX XXX"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#333] mb-2 block">
                  Email
                </label>
                <Input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  placeholder="email@example.com"
                  className={emailError ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
              </div>
            </div>

            {/* Соцсети */}
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Социальные сети
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {socialLinks.map((link, i) => (
                  <Badge key={i} variant="default" className="gap-1 text-sm py-1 px-3">
                    {link}
                    <button onClick={() => setSocialLinks(socialLinks.filter((_, idx) => idx !== i))}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newSocialLink}
                  onChange={(e) => setNewSocialLink(e.target.value)}
                  placeholder="instagram, telegram, linkedin..."
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSocialLink())}
                />
                <Button variant="outline" onClick={addSocialLink} className="rounded-[40px]">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Навыки и ПО ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Навыки и программы</h2>
          <Separator className="mb-4" />
          <div className="space-y-4">
            {/* Программы */}
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Программное обеспечение
              </label>
              <div className="flex flex-wrap gap-2">
                {SOFTWARE_OPTIONS.map((sw) => (
                  <Badge
                    key={sw}
                    variant={software.includes(sw) ? "default" : "outline"}
                    className="cursor-pointer text-sm py-1 px-3"
                    onClick={() => toggleMultiSelect(software, setSoftware, sw)}
                  >
                    {sw}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Ключевые навыки */}
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Ключевые навыки
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {keySkills.map((skill, i) => (
                  <Badge key={i} variant="default" className="gap-1 text-sm py-1 px-3">
                    {skill}
                    <button onClick={() => setKeySkills(keySkills.filter((_, idx) => idx !== i))}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Добавить навык..."
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                />
                <Button variant="outline" onClick={addSkill} className="rounded-[40px]">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Опыт работы ===== */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Опыт работы</h2>
            <Button
              variant="outline"
              className="rounded-[40px] gap-2 text-sm"
              onClick={addWorkExperience}
            >
              <Plus className="w-4 h-4" />
              Добавить
            </Button>
          </div>
          <Separator className="mb-4" />

          {workExperiences.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-[#949494] text-sm">
                Нажмите «Добавить» чтобы указать опыт работы
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {workExperiences.map((exp, expIndex) => (
                <Card key={exp.id}>
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Место работы {expIndex + 1}</h3>
                      <button
                        onClick={() => removeWorkExp(exp.id)}
                        className="text-[#949494] hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[#949494] mb-1 block">Компания</label>
                        <Input
                          value={exp.company}
                          onChange={(e) => {
                            updateWorkExp(exp.id, "company", e.target.value);
                            if (workExpErrors[expIndex]?.company) {
                              setWorkExpErrors((prev) => ({
                                ...prev,
                                [expIndex]: { ...prev[expIndex], company: undefined },
                              }));
                            }
                          }}
                          placeholder='ООО "Компания"'
                          className={workExpErrors[expIndex]?.company ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {workExpErrors[expIndex]?.company && (
                          <p className="text-sm text-red-500 mt-1">{workExpErrors[expIndex].company}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs text-[#949494] mb-1 block">Должность</label>
                        <Input
                          value={exp.position}
                          onChange={(e) => updateWorkExp(exp.id, "position", e.target.value)}
                          placeholder="Ведущий архитектор"
                          className={workExpErrors[expIndex]?.position ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {workExpErrors[expIndex]?.position && (
                          <p className="text-sm text-red-500 mt-1">{workExpErrors[expIndex].position}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[#949494] mb-1 block">Начало</label>
                        <Input
                          value={exp.startDate}
                          onChange={(e) => {
                            updateWorkExp(exp.id, "startDate", e.target.value);
                            if (workExpErrors[expIndex]?.startDate) {
                              setWorkExpErrors((prev) => ({
                                ...prev,
                                [expIndex]: { ...prev[expIndex], startDate: undefined },
                              }));
                            }
                          }}
                          placeholder="Январь 2020"
                          className={workExpErrors[expIndex]?.startDate ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {workExpErrors[expIndex]?.startDate && (
                          <p className="text-sm text-red-500 mt-1">{workExpErrors[expIndex].startDate}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs text-[#949494] mb-1 block">Окончание</label>
                        <Input
                          value={exp.endDate}
                          onChange={(e) => {
                            updateWorkExp(exp.id, "endDate", e.target.value);
                            if (workExpErrors[expIndex]?.endDate) {
                              setWorkExpErrors((prev) => ({
                                ...prev,
                                [expIndex]: { ...prev[expIndex], endDate: undefined },
                              }));
                            }
                          }}
                          placeholder="Настоящее время"
                          className={workExpErrors[expIndex]?.endDate ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {workExpErrors[expIndex]?.endDate && (
                          <p className="text-sm text-red-500 mt-1">{workExpErrors[expIndex].endDate}</p>
                        )}
                      </div>
                    </div>

                    {/* Обязанности */}
                    <div>
                      <label className="text-xs text-[#949494] mb-1 block">Обязанности</label>
                      <div className="space-y-2">
                        {exp.duties.map((duty, dutyIndex) => (
                          <div key={dutyIndex} className="flex gap-2">
                            <Input
                              value={duty}
                              onChange={(e) => updateDuty(exp.id, dutyIndex, e.target.value)}
                              placeholder="Описание обязанности..."
                            />
                            {exp.duties.length > 1 && (
                              <button
                                onClick={() => removeDuty(exp.id, dutyIndex)}
                                className="text-[#949494] hover:text-red-500"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => addDuty(exp.id)}
                        className="text-sm text-[#949494] hover:text-[#333] mt-2 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Добавить обязанность
                      </button>
                    </div>

                    {/* Достижение */}
                    <div>
                      <label className="text-xs text-[#949494] mb-1 block">
                        Достижение (необязательно)
                      </label>
                      <Input
                        value={exp.achievement}
                        onChange={(e) => updateWorkExp(exp.id, "achievement", e.target.value)}
                        placeholder="Главное достижение на этой позиции..."
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
            disabled={!name.trim() || !category.trim() || isSubmitting}
          >
            {isSubmitting ? "Создание..." : "Опубликовать резюме"}
          </Button>
        </div>
      </div>
    </section>
  );
}
