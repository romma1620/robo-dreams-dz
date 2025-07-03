import { z } from 'zod';

export const BrewDTO = z.object({
  beans: z.string().min(3, { message: 'Beans must be between 3 and 40 characters' }).max(40),
  method: z.enum(['v60', 'aeropress', 'chemex', 'espresso'], {
    errorMap: () => ({ message: 'Method must be one of: v60, aeropress, chemex, espresso' })
  }),
  rating: z.number().int().min(1).max(5).optional(),
  notes: z.string().max(200).optional(),
  brewedAt: z.string().datetime().optional(),
}).strict();
