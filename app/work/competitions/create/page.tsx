// app/work/competitions/create/page.tsx
"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, ImageIcon } from "lucide-react";
import { useAppSelector } from "@/app/store/hooks";
import { useApiCompetitionsCreateCreateMutation } from "@/services/generatedApi";
import Link from "next/link";

const OPEN_FOR_OPTIONS = [
  "Профессионалы",
  "Студенты",
  "Все желающие",
];

export default function CreateCompetitionPage() {
  const router = useRouter();
  const [createCompetition] = useApiCompetitionsCreateCreateMutation();
  const user = useAppSelector((state) => state.authSlice.user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Основная информация
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Организация
  const [organizer, setOrganizer] = useState("");
  const [organizerLink, setOrganizerLink] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [registrationFee, setRegistrationFee] = useState("");
  const [prize, setPrize] = useState("");
  const [openFor, setOpenFor] = useState<string[]>([]);

  // Даты
  const [startRegistration, setStartRegistration] = useState("");
  const [endRegistration, setEndRegistration] = useState("");
  const [submissionDeadline, setSubmissionDeadline] = useState("");
  const [resultsAnnouncement, setResultsAnnouncement] = useState("");

  // Динамические списки
  const [tasks, setTasks] = useState<string[]>([""]);
  const [conditions, setConditions] = useState<string[]>([""]);
  const [projectComposition, setProjectComposition] = useState<string[]>([""]);
  const [evaluationCriteria, setEvaluationCriteria] = useState<string[]>([""]);

  // Статус
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // --- Хелперы ---

  const toggleOpenFor = (value: string) => {
    setOpenFor(
      openFor.includes(value)
        ? openFor.filter((v) => v !== value)
        : [...openFor, value]
    );
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-zа-яё0-9\s-]/gi, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Динамический список хелперы
  const updateListItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    list: string[],
    index: number,
    value: string
  ) => {
    setter(list.map((item, i) => (i === index ? value : item)));
  };

  const addListItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    list: string[]
  ) => {
    setter([...list, ""]);
  };

  const removeListItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    list: string[],
    index: number
  ) => {
    if (list.length > 1) {
      setter(list.filter((_, i) => i !== index));
    }
  };

  // --- Сабмит ---

  const handleSubmit = async () => {
    if (!title.trim() || !user) return;
    setIsSubmitting(true);

    try {
      await createCompetition({
        competitionCreate: {
          slug: slug || generateSlug(title),
          title,
          description,
          short_description: shortDescription,
          image: imagePreview || undefined,
          open_for: openFor,
          country,
          city,
          registration_fee: registrationFee || "Бесплатно",
          prize,
          organizer,
          organizer_link: organizerLink || undefined,
          start_registration: startRegistration || undefined,
          end_registration: endRegistration || undefined,
          submission_deadline: submissionDeadline || undefined,
          results_announcement: resultsAnnouncement || undefined,
          tasks: tasks.filter((t) => t.trim() !== ""),
          conditions: conditions.filter((c) => c.trim() !== ""),
          project_composition: projectComposition.filter((p) => p.trim() !== ""),
          evaluation_criteria: evaluationCriteria.filter((e) => e.trim() !== ""),
          is_active: isActive,
          is_featured: isFeatured,
        },
      }).unwrap();
      router.push("/work");
    } catch (error) {
      console.error("Ошибка создания конкурса:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Компонент динамического списка ---

  const DynamicList = ({
    label,
    items,
    setItems,
    placeholder,
  }: {
    label: string;
    items: string[];
    setItems: React.Dispatch<React.SetStateAction<string[]>>;
    placeholder: string;
  }) => (
    <div>
      <label className="text-sm font-medium text-[#333] mb-2 block">{label}</label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => updateListItem(setItems, items, index, e.target.value)}
              placeholder={placeholder}
            />
            {items.length > 1 && (
              <button
                onClick={() => removeListItem(setItems, items, index)}
                className="text-[#949494] hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={() => addListItem(setItems, items)}
        className="text-sm text-[#949494] hover:text-[#333] mt-2 flex items-center gap-1"
      >
        <Plus className="w-3 h-3" />
        Добавить
      </button>
    </div>
  );

  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8 max-w-[800px]">
      {/* Навигация */}
      <div className="mb-6">
        <nav className="text-sm text-gray-500">
          <Link href="/work" className="hover:text-gray-700">
            Работа
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Создать конкурс</span>
        </nav>
      </div>

      <h1 className="text-2xl font-bold mb-8">Создание конкурса</h1>

      <div className="space-y-8">
        {/* ===== Основная информация ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Основная информация</h2>
          <Separator className="mb-4" />
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Название конкурса
              </label>
              <Input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Проект здания музей современного искусства..."
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                URL-slug
              </label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="museum-of-modern-art"
                className="text-sm text-[#949494]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Краткое описание
              </label>
              <Input
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Краткое описание для карточки конкурса..."
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Полное описание
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Подробное описание конкурса..."
                rows={5}
                className="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#333] focus:border-transparent"
              />
            </div>

            {/* Обложка */}
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Обложка конкурса
              </label>
              {imagePreview ? (
                <div className="relative rounded-lg overflow-hidden aspect-video max-w-[400px]">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => {
                      setImagePreview("");
                      setImageFile(null);
                    }}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#E0E0E0] rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#333] transition-colors max-w-[400px]"
                >
                  <ImageIcon className="w-8 h-8 text-[#949494] mb-2" />
                  <span className="text-sm text-[#949494]">Загрузить изображение</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            {/* Открыт для */}
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Открыт для
              </label>
              <div className="flex flex-wrap gap-2">
                {OPEN_FOR_OPTIONS.map((opt) => (
                  <Badge
                    key={opt}
                    variant={openFor.includes(opt) ? "default" : "outline"}
                    className="cursor-pointer text-sm py-1 px-3"
                    onClick={() => toggleOpenFor(opt)}
                  >
                    {opt}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===== Организация ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Организация</h2>
          <Separator className="mb-4" />
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#333] mb-2 block">Организатор</label>
                <Input
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  placeholder="Название организации"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#333] mb-2 block">
                  Сайт организатора
                </label>
                <Input
                  value={organizerLink}
                  onChange={(e) => setOrganizerLink(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#333] mb-2 block">Страна</label>
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Кыргызстан"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#333] mb-2 block">Город</label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Бишкек"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#333] mb-2 block">
                  Регистрационный взнос
                </label>
                <Input
                  value={registrationFee}
                  onChange={(e) => setRegistrationFee(e.target.value)}
                  placeholder="Бесплатно / Да (100€)"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#333] mb-2 block">Награда</label>
                <Input
                  value={prize}
                  onChange={(e) => setPrize(e.target.value)}
                  placeholder="$50 000 + реализация"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ===== Даты ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Даты</h2>
          <Separator className="mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Начало регистрации
              </label>
              <Input
                type="date"
                value={startRegistration}
                onChange={(e) => setStartRegistration(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Дедлайн регистрации
              </label>
              <Input
                type="date"
                value={endRegistration}
                onChange={(e) => setEndRegistration(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Дедлайн подачи проектов
              </label>
              <Input
                type="date"
                value={submissionDeadline}
                onChange={(e) => setSubmissionDeadline(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Объявление результатов
              </label>
              <Input
                type="date"
                value={resultsAnnouncement}
                onChange={(e) => setResultsAnnouncement(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ===== Детали конкурса ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Детали конкурса</h2>
          <Separator className="mb-4" />
          <div className="space-y-6">
            <DynamicList
              label="Задачи конкурса"
              items={tasks}
              setItems={setTasks}
              placeholder="Описание задачи..."
            />
            <DynamicList
              label="Условия участия"
              items={conditions}
              setItems={setConditions}
              placeholder="Условие участия..."
            />
            <DynamicList
              label="Состав конкурсного проекта"
              items={projectComposition}
              setItems={setProjectComposition}
              placeholder="Элемент проекта..."
            />
            <DynamicList
              label="Критерии оценки"
              items={evaluationCriteria}
              setItems={setEvaluationCriteria}
              placeholder="Критерий..."
            />
          </div>
        </div>

        {/* ===== Статус ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Статус</h2>
          <Separator className="mb-4" />
          <div className="flex flex-wrap gap-3">
            <Badge
              variant={isActive ? "default" : "outline"}
              className="cursor-pointer text-sm py-1 px-3"
              onClick={() => setIsActive(!isActive)}
            >
              {isActive ? "✓ Активный" : "Неактивный"}
            </Badge>
            <Badge
              variant={isFeatured ? "default" : "outline"}
              className="cursor-pointer text-sm py-1 px-3"
              onClick={() => setIsFeatured(!isFeatured)}
            >
              {isFeatured ? "✓ Избранный" : "Обычный"}
            </Badge>
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
            {isSubmitting ? "Создание..." : "Опубликовать конкурс"}
          </Button>
        </div>
      </div>
    </section>
  );
}
