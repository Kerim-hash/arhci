import { z } from "zod";

/** Пустая строка допустима: поле можно очистить. Иначе — только полный адрес сайта. */
const optionalUrl = z
  .string()
  .trim()
  .refine((value) => value === "" || /^https?:\/\/\S+$/i.test(value), {
    message: "Укажите адрес сайта полностью, например https://example.com",
  });

const optionalEmail = z
  .string()
  .trim()
  .refine((value) => value === "" || z.string().email().safeParse(value).success, {
    message: "Некорректная почта",
  });

/** Данные компании — PATCH /api/companies/me/ (название и логотип живут на аккаунте). */
export const CompanySchema = z.object({
  name: z.string().trim().min(1, "Укажите название компании").max(200, "Не больше 200 символов"),
  address: z.string().trim().max(300, "Не больше 300 символов"),
  website: optionalUrl,
  phone: z.string().trim().max(30, "Не больше 30 символов"),
  email: optionalEmail,
  description: z.string().trim(),
});

export type TypeCompanySchema = z.infer<typeof CompanySchema>;
