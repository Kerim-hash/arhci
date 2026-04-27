import { z } from 'zod'

export const RecoverSchema = z.object({
  email: z.string().email('неверный формат email'),
})

export type TypeRecoverSchema = z.infer<typeof RecoverSchema>
