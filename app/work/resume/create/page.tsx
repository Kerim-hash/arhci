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

export default function CreateResumePage() {
  const router = useRouter();
  const [createResume] = useApiResumesCreateCreateMutation();
  const user = useAppSelector((state) => state.authSlice.user);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Основная информация
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

  // --- Сабмит ---

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      await createResume({
        resumeCreate: {
          name: user?.name || "",
          category,
          salary_from: Number(salaryFrom) || 0,
          salary_to: Number(salaryTo) || 0,
          experience,
          specialization: specializations,
          description,
          about,
          software,
          employment_type: employmentType,
          region,
          work_place: workPlace,
          employment,
          schedule,
          phone,
          email,
          social_links: socialLinks,
          key_skills: keySkills,
          work_experience: workExperiences.map((exp) => ({
            company: exp.company,
            position: exp.position,
            start_date: exp.startDate,
            end_date: exp.endDate,
            duties: exp.duties.filter((d) => d.trim() !== ""),
            achievement: exp.achievement || undefined,
          })),
        },
      }).unwrap();
      router.push("/work");
    } catch (error) {
      console.error("Ошибка создания резюме:", error);
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* Соцсети */}
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Социальные сети
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {socialLinks.map((link, i) => (
                  <Badge key={i} variant="secondary" className="gap-1 text-sm py-1 px-3">
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
                  <Badge key={i} variant="secondary" className="gap-1 text-sm py-1 px-3">
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
                          onChange={(e) => updateWorkExp(exp.id, "company", e.target.value)}
                          placeholder='ООО "Компания"'
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#949494] mb-1 block">Должность</label>
                        <Input
                          value={exp.position}
                          onChange={(e) => updateWorkExp(exp.id, "position", e.target.value)}
                          placeholder="Ведущий архитектор"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[#949494] mb-1 block">Начало</label>
                        <Input
                          value={exp.startDate}
                          onChange={(e) => updateWorkExp(exp.id, "startDate", e.target.value)}
                          placeholder="Январь 2020"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#949494] mb-1 block">Окончание</label>
                        <Input
                          value={exp.endDate}
                          onChange={(e) => updateWorkExp(exp.id, "endDate", e.target.value)}
                          placeholder="Настоящее время"
                        />
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
            disabled={!category.trim() || isSubmitting}
          >
            {isSubmitting ? "Создание..." : "Опубликовать резюме"}
          </Button>
        </div>
      </div>
    </section>
  );
}
