import { z } from 'zod'

export const EditProfileSchema = z.object({
  email: z.string().email({
    message: 'Некорректная почта',
  }),
})

export type TypeEditProfileSchema = z.infer<typeof EditProfileSchema>
