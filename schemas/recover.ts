import { z } from 'zod'

export const RecoverSchema = z.object({
  email: z.string().email('неверный формат email'),
})

export type TypeRecoverSchema = z.infer<typeof RecoverSchema>

export const CheckCodeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Код состоит из 6 цифр'),
})

export type TypeCheckCodeSchema = z.infer<typeof CheckCodeSchema>

export const NewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Пароль должен быть не менее 8 символов')
      .regex(/\D/, 'Пароль не может состоять только из цифр'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

export type TypeNewPasswordSchema = z.infer<typeof NewPasswordSchema>
