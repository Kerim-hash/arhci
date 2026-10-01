// app/work/competitions/create/page.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, X, ImageIcon } from "lucide-react";
import { useAppSelector } from "@/app/store/hooks";
import { useAuth } from "@/hooks/use-auth";
import {
  useApiCompetitionsCreateCreateMutation,
  type CompetitionCreate,
} from "@/services/generatedApi";
import { formatApiError } from "@/lib/formatApiError";
import Link from "next/link";
import { toast } from "sonner";

const OPEN_FOR_OPTIONS = [
  "Профессионалы",
  "Студенты",
  "Все желающие",
];

// Подписи полей для ошибок валидации с бэкенда
const FIELD_LABELS: Record<string, string> = {
  title: "Название конкурса",
  shortDescription: "Краткое описание",
  description: "Полное описание",
  image: "Обложка конкурса",
  openFor: "Открыт для",
  organizer: "Организатор",
  organizerLink: "Сайт организатора",
  prize: "Награда",
  startRegistration: "Начало регистрации",
  endRegistration: "Дедлайн регистрации",
  submissionDeadline: "Дедлайн подачи проектов",
  resultsAnnouncement: "Объявление результатов",
  tasks: "Задачи конкурса",
  conditions: "Условия участия",
  projectComposition: "Состав конкурсного проекта",
};

const nonEmpty = (items: string[]) => items.filter((item) => item.trim() !== "");

export default function CreateCompetitionPage() {
  const router = useRouter();
  const [createCompetition] = useApiCompetitionsCreateCreateMutation();
  const user = useAppSelector((state) => state.authSlice.user);
  const { loading: isAuthLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Основная информация
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Организация
  const [organizer, setOrganizer] = useState("");
  const [organizerLink, setOrganizerLink] = useState("");
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

  // --- Хелперы ---

  const toggleOpenFor = (value: string) => {
    setOpenFor(
      openFor.includes(value)
        ? openFor.filter((v) => v !== value)
        : [...openFor, value]
    );
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
    setError(null);
    setIsSubmitting(true);

    try {
      // Обложка уходит файлом, поэтому тело — multipart, а не JSON из схемы.
      // Списки в multipart передаются JSON-строками, бэкенд разбирает их сам;
      // пустые поля не отправляем, чтобы не затирать значения по умолчанию.
      const formData = new FormData();
      const fields: Record<string, string> = {
        title,
        description,
        shortDescription,
        prize,
        organizer,
        organizerLink,
        startRegistration,
        endRegistration,
        submissionDeadline,
        resultsAnnouncement,
      };
      Object.entries(fields).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (imageFile) formData.append("image", imageFile);
      formData.append("openFor", JSON.stringify(openFor));
      formData.append("tasks", JSON.stringify(nonEmpty(tasks)));
      formData.append("conditions", JSON.stringify(nonEmpty(conditions)));
      formData.append("projectComposition", JSON.stringify(nonEmpty(projectComposition)));

      await createCompetition({
        competitionCreate: formData as unknown as CompetitionCreate,
      }).unwrap();
      toast.success("Конкурс отправлен на модерацию");
      router.push("/profile");
    } catch (err) {
      console.error("Ошибка создания конкурса:", err);
      setError(formatApiError(err, "Не удалось создать конкурс. Попробуйте ещё раз.", FIELD_LABELS));
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

  // Профиль подтягивается после загрузки страницы — не пугаем залогиненного
  // пользователя сообщением о входе, пока запрос ещё идёт.
  if (!user && isAuthLoading) {
    return (
      <section className="container mx-auto relative px-4 sm:px-6 py-8 max-w-[800px]">
        <div className="text-center py-12 text-[#666666]">Загрузка...</div>
      </section>
    );
  }

  // Без аккаунта конкурс не создать: раньше форма просто молча не отправлялась.
  if (!user) {
    return (
      <section className="container mx-auto relative px-4 sm:px-6 py-8 max-w-[800px]">
        <div className="text-center py-12 max-w-md mx-auto">
          <h1 className="text-xl font-semibold mb-2">Нужно войти в аккаунт</h1>
          <p className="text-[#666666] mb-6">
            Создавать конкурсы могут только авторизованные пользователи.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/work">
              <Button variant="outline" className="rounded-[40px]">
                К разделу «Работа»
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button className="rounded-[40px]">Войти</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

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
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Проект здания музей современного искусства..."
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
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
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
          </div>
        </div>

        {/* ===== Кнопки действий ===== */}
        <Separator />
        {error && (
          <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3 whitespace-pre-line">
            {error}
          </div>
        )}
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
