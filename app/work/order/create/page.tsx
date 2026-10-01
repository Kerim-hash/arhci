// app/work/order/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useApiOrdersCreateCreateMutation } from "@/services/generatedApi";
import { formatApiError } from "@/lib/formatApiError";
import { SOFTWARE_OPTIONS } from "../../model/options";

// Подписи полей для ошибок валидации с бэкенда
const FIELD_LABELS: Record<string, string> = {
  title: "Название заказа",
  budget: "Бюджет",
  description: "Описание",
  propertyType: "Тип объекта",
  software: "Программы",
};

const REQUIRED_MSG = "Это поле не может быть пустым.";
const BUDGET_MSG = "Бюджет должен быть числом не меньше 0.";

const errorClass = (hasError: boolean) =>
  hasError ? "border-red-500 focus-visible:ring-red-500" : "";

export default function CreateOrderPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [createOrder] = useApiOrdersCreateCreateMutation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [software, setSoftware] = useState<string[]>([]);

  const clearError = (key: string) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const toggleSoftware = (value: string) => {
    setSoftware((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!title.trim()) errors.title = REQUIRED_MSG;
    if (budget.trim() !== "") {
      const value = Number(budget);
      if (!Number.isFinite(value) || value < 0) errors.budget = BUDGET_MSG;
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Проверьте отмеченные поля в форме.");
      return;
    }
    setIsSubmitting(true);
    try {
      await createOrder({
        orderCreate: {
          title: title.trim(),
          budget: budget.trim() === "" ? undefined : Number(budget),
          description,
          propertyType: propertyType.trim() ? [propertyType.trim()] : [],
          software,
        },
      }).unwrap();
      toast.success("Заказ отправлен на модерацию");
      router.push("/profile");
    } catch (error) {
      console.error("Ошибка создания заказа:", error);
      toast.error(formatApiError(error, "Не удалось создать заказ.", FIELD_LABELS));
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = (
    <div className="mb-6">
      <nav className="text-sm text-gray-500">
        <Link href="/work?tab=orders" className="hover:text-gray-700">
          Работа
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Создать заказ</span>
      </nav>
    </div>
  );

  if (loading) {
    return (
      <section className="container mx-auto relative px-4 sm:px-6 py-8 max-w-[800px]">
        {breadcrumbs}
        <p className="text-gray-500">Загрузка...</p>
      </section>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <section className="container mx-auto relative px-4 sm:px-6 py-8 max-w-[800px]">
        {breadcrumbs}
        <h1 className="text-2xl font-bold mb-4">Создание заказа</h1>
        <p className="text-gray-600 mb-6">
          Войдите в систему, чтобы разместить заказ.
        </p>
        <Button asChild className="rounded-[40px]">
          <Link href="/auth/login">Войти</Link>
        </Button>
      </section>
    );
  }

  if (user.role !== "company") {
    return (
      <section className="container mx-auto relative px-4 sm:px-6 py-8 max-w-[800px]">
        {breadcrumbs}
        <h1 className="text-2xl font-bold mb-4">Создание заказа</h1>
        <p className="text-gray-600">
          Размещать заказы могут только компании. Специалисты откликаются на
          заказы во вкладке «Заказы».
        </p>
      </section>
    );
  }

  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8 max-w-[800px]">
      {breadcrumbs}

      <h1 className="text-2xl font-bold mb-8">Создание заказа</h1>

      <div className="space-y-8">
        {/* ===== Основная информация ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Основная информация</h2>
          <Separator className="mb-4" />
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Название заказа
              </label>
              <Input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  clearError("title");
                }}
                placeholder="Проект жилого дома, 250 м²"
                className={errorClass(Boolean(fieldErrors.title))}
              />
              {fieldErrors.title && (
                <p className="text-sm text-red-500 mt-1">{fieldErrors.title}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Бюджет (сом)
              </label>
              <Input
                type="number"
                min={0}
                value={budget}
                onChange={(e) => {
                  setBudget(e.target.value);
                  clearError("budget");
                }}
                placeholder="Например: 150000"
                className={errorClass(Boolean(fieldErrors.budget))}
              />
              {fieldErrors.budget ? (
                <p className="text-sm text-red-500 mt-1">{fieldErrors.budget}</p>
              ) : (
                <p className="text-xs text-[#949494] mt-2">
                  Оставьте пустым, если бюджет обсуждается
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Тип объекта
              </label>
              <Input
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                placeholder="Жилая, Коммерческая, Благоустройство..."
              />
            </div>
          </div>
        </div>

        {/* ===== Описание ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Описание проекта</h2>
          <Separator className="mb-4" />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Опишите задачу, сроки, объём работ и пожелания к исполнителю..."
            rows={6}
          />
        </div>

        {/* ===== Программы ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Программы / ПО</h2>
          <Separator className="mb-4" />
          <div className="flex flex-wrap gap-2">
            {SOFTWARE_OPTIONS.map((item) => (
              <Badge
                key={item}
                variant={software.includes(item) ? "default" : "outline"}
                className="cursor-pointer text-sm py-1.5 px-4"
                onClick={() => toggleSoftware(item)}
              >
                {item}
              </Badge>
            ))}
          </div>
        </div>

        {/* ===== Кнопки действий ===== */}
        <Separator />
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Link href="/work?tab=orders">
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
