"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { companyHref } from "@/app/companies/model/listParams";
import { formatApiError } from "@/lib/formatApiError";
import { CompanySchema, type TypeCompanySchema } from "@/schemas/company";
import {
  useApiCompaniesMePartialUpdateMutation,
  useApiCompaniesMeRetrieveQuery,
  type CompanyProfileRead,
} from "@/services/generatedApi";

const FIELD_LABELS: Record<string, string> = {
  name: "Название",
  address: "Адрес",
  website: "Сайт",
  phone: "Телефон",
  email: "Email",
  description: "Описание",
};

const FIELDS = Object.keys(FIELD_LABELS) as Array<keyof TypeCompanySchema>;

const toFormValues = (company?: CompanyProfileRead): TypeCompanySchema => ({
  name: company?.name ?? "",
  address: company?.address ?? "",
  website: company?.website ?? "",
  phone: company?.phone ?? "",
  email: company?.email ?? "",
  description: company?.description ?? "",
});

/** Ошибки DRF по полям: {field: ["..."]} → текст первой ошибки поля. */
const fieldError = (err: unknown, field: string): string | undefined => {
  const data = (err as { data?: Record<string, unknown> } | null)?.data;
  const value = data && typeof data === "object" ? data[field] : undefined;
  if (Array.isArray(value)) return value.map(String).join(", ");
  if (typeof value === "string") return value;
  return undefined;
};

interface CompanyInfoFormProps {
  /** Вызывается после сохранения: название компании видно и в профиле аккаунта. */
  onSaved?: () => unknown;
}

/** Данные компании в настройках профиля — PATCH /api/companies/me/. */
export function CompanyInfoForm({ onSaved }: CompanyInfoFormProps) {
  const { data: company, isLoading, isError, refetch } = useApiCompaniesMeRetrieveQuery();
  const [updateCompany, { isLoading: isSaving }] = useApiCompaniesMePartialUpdateMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<TypeCompanySchema>({
    resolver: zodResolver(CompanySchema),
    defaultValues: toFormValues(company),
  });

  useEffect(() => {
    if (company) reset(toFormValues(company));
  }, [company, reset]);

  const onSubmit = async (data: TypeCompanySchema) => {
    try {
      await updateCompany({ patchedCompanyProfile: data }).unwrap();
      await onSaved?.();
      toast.success("Данные компании сохранены");
    } catch (err) {
      const fieldErrors = FIELDS.filter((field) => {
        const message = fieldError(err, field);
        if (message) setError(field, { type: "server", message });
        return Boolean(message);
      });
      if (fieldErrors.length === 0) {
        toast.error(formatApiError(err, "Не удалось сохранить данные компании", FIELD_LABELS));
      }
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Загрузка...</div>;
  }

  if (isError || !company) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Не удалось загрузить данные компании.</p>
        <Button variant="outline" className="mt-4 rounded-[40px]" onClick={() => refetch()}>
          Повторить
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Данные компании</h2>
      <p className="text-sm text-gray-500 mb-6">
        Показываются на{" "}
        <Link href={companyHref(company.slug)} className="underline hover:text-primary">
          странице компании
        </Link>{" "}
        и подставляются в новые вакансии. Логотип — это фото профиля слева.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="companyName">Название</Label>
          <Input
            id="companyName"
            {...register("name")}
            placeholder="ООО «Архитектурное бюро»"
            className="mt-1.5"
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="companyAddress">Адрес</Label>
          <Input
            id="companyAddress"
            {...register("address")}
            placeholder="Бишкек, ул. Киевская, 100"
            className="mt-1.5"
          />
          {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="companyPhone">Телефон</Label>
            <Input
              id="companyPhone"
              type="tel"
              {...register("phone")}
              placeholder="+996 (555) 123-456"
              className="mt-1.5"
            />
            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <Label htmlFor="companyEmail">Email для связи</Label>
            <Input
              id="companyEmail"
              type="email"
              {...register("email")}
              placeholder="hr@example.com"
              className="mt-1.5"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="companyWebsite">Сайт</Label>
          <Input
            id="companyWebsite"
            {...register("website")}
            placeholder="https://example.com"
            className="mt-1.5"
          />
          {errors.website && <p className="text-sm text-red-500 mt-1">{errors.website.message}</p>}
        </div>

        <div>
          <Label htmlFor="companyDescription">О компании</Label>
          <Textarea
            id="companyDescription"
            {...register("description")}
            placeholder="Расскажите о компании, проектах и команде..."
            rows={5}
            className="mt-1.5"
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isSaving} className="w-full md:w-auto">
          {isSaving ? "Сохранение..." : "Сохранить изменения"}
        </Button>
      </form>
    </div>
  );
}
