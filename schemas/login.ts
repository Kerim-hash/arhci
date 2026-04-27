import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Неверный формат email",
  }),
  password: z.string().min(8, {
    message: "Пароль должен содержать как минимум 8 символов",
  }),
});

export type TypeLoginSchema = z.infer<typeof LoginSchema>;
