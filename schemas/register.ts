import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Неверный формат email",
  }),
  password: z.string().min(8, {
    message: "Пароль должен быть не менее 8 символов",
  }),
  region_from: z.array(z.string()).nonempty({
    message: "Область является обязательной",
  }),
  role: z.string().optional(),
  category: z.string().optional(),
  /** Только для компании: сразу подписывает её карточку в каталоге и на главной. */
  company_name: z.string().max(200).optional(),
});

export type TypeRegisterSchema = z.infer<typeof RegisterSchema>;
