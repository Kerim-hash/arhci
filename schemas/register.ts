import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Неверный формат email",
  }),
  password: z.string().min(8, {
    message: "Пароль должен содержать как минимум 8 символов",
  }),
  region_from: z.array(z.string()).nonempty({
    message: "Область является обязательной",
  }),
});

export type TypeRegisterSchema = z.infer<typeof RegisterSchema>;
