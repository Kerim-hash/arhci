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
  duties?: string;
}

const REQUIRED_MSG = "Это поле не может быть пустым.";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Maps resumeCreate payload keys to the keys used in fieldErrors below.
const SERVER_FIELD_MAP: Record<string, string> = {
  category: "category",
  specialization: "specialization",
  salaryFrom: "salaryFrom",
  salaryTo: "salaryTo",
  experience: "experience",
  description: "description",
  software: "software",
  employment_type: "employmentType",
  region: "region",
  workPlace: "workPlace",
  employment: "employment",
  schedule: "schedule",
  phone: "phone",
  social_links: "socialLinks",
  key_skills: "keySkills",
};

export default function CreateResumePage() {
  const router = useRouter();
  const [createResume] = useApiResumesCreateCreateMutation();
  const { user, isAuthenticated } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [workExpErrors, setWorkExpErrors] = useState<Record<number, WorkExpFieldErrors>>({});

  const clearError = (key: string) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

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
      clearError("keySkills");
    }
  };

  const addSocialLink = () => {
    const trimmed = newSocialLink.trim();
    if (trimmed && !socialLinks.includes(trimmed)) {
      setSocialLinks([...socialLinks, trimmed]);
      setNewSocialLink("");
      clearError("socialLinks");
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
  // Всё обязательно, кроме поля «О себе».

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!name.trim()) errors.name = REQUIRED_MSG;
    if (!category.trim()) errors.category = REQUIRED_MSG;
    if (specializations.length === 0) errors.specialization = "Выберите хотя бы одну специализацию.";
    if (!salaryFrom.trim()) errors.salaryFrom = REQUIRED_MSG;
    if (!salaryTo.trim()) errors.salaryTo = REQUIRED_MSG;
    if (!experience) errors.experience = "Выберите опыт работы.";
    if (!description.trim()) errors.description = REQUIRED_MSG;
    if (!workPlace.trim()) errors.workPlace = REQUIRED_MSG;
    if (!employment.trim()) errors.employment = REQUIRED_MSG;
    if (!schedule.trim()) errors.schedule = REQUIRED_MSG;
    if (!region) errors.region = "Выберите регион.";
    if (employmentType.length === 0) errors.employmentType = "Выберите хотя бы один тип занятости.";
    if (!phone.trim()) errors.phone = REQUIRED_MSG;
    if (!email.trim()) {
      errors.email = REQUIRED_MSG;
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      errors.email = "Введите правильный адрес электронной почты.";
    }
    if (socialLinks.length === 0) errors.socialLinks = "Добавьте хотя бы одну ссылку.";
    if (software.length === 0) errors.software = "Выберите хотя бы одну программу.";
    if (keySkills.length === 0) errors.keySkills = "Добавьте хотя бы один навык.";

    setFieldErrors(errors);

    const nextWorkExpErrors: Record<number, WorkExpFieldErrors> = {};
    workExperiences.forEach((exp, index) => {
      const expErrors: WorkExpFieldErrors = {};
      if (!exp.company.trim()) expErrors.company = REQUIRED_MSG;
      if (!exp.position.trim()) expErrors.position = REQUIRED_MSG;
      if (!exp.startDate.trim()) expErrors.startDate = REQUIRED_MSG;
      if (!exp.endDate.trim()) expErrors.endDate = REQUIRED_MSG;
      if (!exp.duties.some((d) => d.trim())) expErrors.duties = "Укажите хотя бы одну обязанность.";
      if (Object.keys(expErrors).length > 0) {
        nextWorkExpErrors[index] = expErrors;
      }
    });
    setWorkExpErrors(nextWorkExpErrors);

    return Object.keys(errors).length === 0 && Object.keys(nextWorkExpErrors).length === 0;
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
          employmentType,
          region,
          workPlace: workPlace,
          employment,
          schedule,
          phone,
          email,
          socialLinks,
          keySkills,
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
        const { name: nameErr, email: emailErr, workExperience, ...rest } = error.data;

        const nextFieldErrors: Record<string, string> = {};
        if (Array.isArray(nameErr) && nameErr[0]) nextFieldErrors.name = nameErr[0];
        if (Array.isArray(emailErr) && emailErr[0]) nextFieldErrors.email = emailErr[0];

        const unmapped: [string, unknown][] = [];
        Object.entries(rest).forEach(([key, val]) => {
          const mappedKey = SERVER_FIELD_MAP[key];
          if (mappedKey && Array.isArray(val) && typeof val[0] === "string") {
            nextFieldErrors[mappedKey] = val[0];
          } else {
            unmapped.push([key, val]);
          }
        });

        if (Object.keys(nextFieldErrors).length > 0) {
          setFieldErrors((prev) => ({ ...prev, ...nextFieldErrors }));
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
                duties: entry.duties?.[0],
              };
            }
          });
          setWorkExpErrors(nextWorkExpErrors);
        }

        const remainingMessages = unmapped
          .flatMap(([, val]) => (Array.isArray(val) ? val : [val]))
          .filter((v): v is string => typeof v === "string");

        if (remainingMessages.length > 0) {
          toast.error(remainingMessages.join(", "));
        } else if (Object.keys(nextFieldErrors).length > 0 || workExperience) {
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
                  clearError("name");
                }}
                placeholder="Иванов Александр Петрович"
                className={fieldErrors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {fieldErrors.name && <p className="text-sm text-red-500 mt-1">{fieldErrors.name}</p>}
            </div>

            {/* Категория */}
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Категория / Должность
              </label>
              <Input
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  clearError("category");
                }}
                placeholder="Например: Архитектор, Инженер, Дизайнер интерьера"
                className={fieldErrors.category ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {fieldErrors.category && <p className="text-sm text-red-500 mt-1">{fieldErrors.category}</p>}
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
                    onClick={() => {
                      toggleMultiSelect(specializations, setSpecializations, spec);
                      clearError("specialization");
                    }}
                  >
                    {spec}
                  </Badge>
                ))}
              </div>
              {fieldErrors.specialization && <p className="text-sm text-red-500 mt-1">{fieldErrors.specialization}</p>}
            </div>

            {/* Зарплата */}
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Желаемая зарплата (сом)
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={salaryFrom}
                    onChange={(e) => {
                      setSalaryFrom(e.target.value);
                      clearError("salaryFrom");
                    }}
                    placeholder="от"
                    className={fieldErrors.salaryFrom ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {fieldErrors.salaryFrom && <p className="text-sm text-red-500 mt-1">{fieldErrors.salaryFrom}</p>}
                </div>
                <span className="text-[#949494]">—</span>
                <div className="flex-1">
                  <Input
                    type="number"
                    value={salaryTo}
                    onChange={(e) => {
                      setSalaryTo(e.target.value);
                      clearError("salaryTo");
                    }}
                    placeholder="до"
                    className={fieldErrors.salaryTo ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {fieldErrors.salaryTo && <p className="text-sm text-red-500 mt-1">{fieldErrors.salaryTo}</p>}
                </div>
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
                    onClick={() => {
                      setExperience(exp);
                      clearError("experience");
                    }}
                  >
                    {exp}
                  </Badge>
                ))}
              </div>
              {fieldErrors.experience && <p className="text-sm text-red-500 mt-1">{fieldErrors.experience}</p>}
            </div>

            {/* Описание */}
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Краткое описание
              </label>
              <Input
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  clearError("description");
                }}
                placeholder="Жилая недвижимость, Проектирование объектов ХоРеКа..."
                className={fieldErrors.description ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {fieldErrors.description && <p className="text-sm text-red-500 mt-1">{fieldErrors.description}</p>}
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
                  onChange={(e) => {
                    setWorkPlace(e.target.value);
                    clearError("workPlace");
                  }}
                  placeholder="Кыргызстан"
                  className={fieldErrors.workPlace ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {fieldErrors.workPlace && <p className="text-sm text-red-500 mt-1">{fieldErrors.workPlace}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-[#333] mb-2 block">
                  Занятость
                </label>
                <Input
                  value={employment}
                  onChange={(e) => {
                    setEmployment(e.target.value);
                    clearError("employment");
                  }}
                  placeholder="Полная, Фриланс..."
                  className={fieldErrors.employment ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {fieldErrors.employment && <p className="text-sm text-red-500 mt-1">{fieldErrors.employment}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#333] mb-2 block">
                  График
                </label>
                <Input
                  value={schedule}
                  onChange={(e) => {
                    setSchedule(e.target.value);
                    clearError("schedule");
                  }}
                  placeholder="5/2, Свободный..."
                  className={fieldErrors.schedule ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {fieldErrors.schedule && <p className="text-sm text-red-500 mt-1">{fieldErrors.schedule}</p>}
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
                      onClick={() => {
                        setRegion(r.value);
                        clearError("region");
                      }}
                    >
                      {r.label}
                    </Badge>
                  ))}
                </div>
                {fieldErrors.region && <p className="text-sm text-red-500 mt-1">{fieldErrors.region}</p>}
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
                    onClick={() => {
                      toggleMultiSelect(employmentType, setEmploymentType, et);
                      clearError("employmentType");
                    }}
                  >
                    {et}
                  </Badge>
                ))}
              </div>
              {fieldErrors.employmentType && <p className="text-sm text-red-500 mt-1">{fieldErrors.employmentType}</p>}
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
                  onChange={(e) => {
                    setPhone(e.target.value);
                    clearError("phone");
                  }}
                  placeholder="+996 XXX XXX XXX"
                  className={fieldErrors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {fieldErrors.phone && <p className="text-sm text-red-500 mt-1">{fieldErrors.phone}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-[#333] mb-2 block">
                  Email
                </label>
                <Input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                  placeholder="email@example.com"
                  className={fieldErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {fieldErrors.email && <p className="text-sm text-red-500 mt-1">{fieldErrors.email}</p>}
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
                  className={fieldErrors.socialLinks ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                <Button variant="outline" onClick={addSocialLink} className="rounded-[40px]">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {fieldErrors.socialLinks && <p className="text-sm text-red-500 mt-1">{fieldErrors.socialLinks}</p>}
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
                    onClick={() => {
                      toggleMultiSelect(software, setSoftware, sw);
                      clearError("software");
                    }}
                  >
                    {sw}
                  </Badge>
                ))}
              </div>
              {fieldErrors.software && <p className="text-sm text-red-500 mt-1">{fieldErrors.software}</p>}
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
                  className={fieldErrors.keySkills ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                <Button variant="outline" onClick={addSkill} className="rounded-[40px]">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {fieldErrors.keySkills && <p className="text-sm text-red-500 mt-1">{fieldErrors.keySkills}</p>}
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
                          onChange={(e) => {
                            updateWorkExp(exp.id, "position", e.target.value);
                            if (workExpErrors[expIndex]?.position) {
                              setWorkExpErrors((prev) => ({
                                ...prev,
                                [expIndex]: { ...prev[expIndex], position: undefined },
                              }));
                            }
                          }}
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
                              onChange={(e) => {
                                updateDuty(exp.id, dutyIndex, e.target.value);
                                if (workExpErrors[expIndex]?.duties) {
                                  setWorkExpErrors((prev) => ({
                                    ...prev,
                                    [expIndex]: { ...prev[expIndex], duties: undefined },
                                  }));
                                }
                              }}
                              placeholder="Описание обязанности..."
                              className={workExpErrors[expIndex]?.duties ? "border-red-500 focus-visible:ring-red-500" : ""}
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
                      {workExpErrors[expIndex]?.duties && (
                        <p className="text-sm text-red-500 mt-1">{workExpErrors[expIndex].duties}</p>
                      )}
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
