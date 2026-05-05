import { z } from 'zod'

export const EditProfileSchema = z.object({
  email: z.string().email({
    message: 'Некорректная почта',
  }).optional(),
  name: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  position: z.string().optional(),
  company_name: z.string().optional(),
  specialization: z.string().optional(),
  experience_years: z.coerce.number().optional(),
  instagram: z.string().optional(),
  telegram: z.string().optional(),
  linkedin: z.string().optional(),
  behance: z.string().optional(),
  website: z.string().optional(),
})

export type TypeEditProfileSchema = z.infer<typeof EditProfileSchema>
