import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Неверный формат email",
  }),
  password: z.string().optional(),
  region_from: z.array(z.string()).nonempty({
    message: "Область является обязательной",
  }),
  role: z.string().optional(),
  category: z.string().optional(),
});

export type TypeRegisterSchema = z.infer<typeof RegisterSchema>;
