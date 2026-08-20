import { z } from 'zod';

export const dealSchema = z.object({
  companyName: z.string().min(1),
  dealSize: z.number().positive(),
  discountPercentage: z.number().min(0).max(100),
  industry: z.string().optional(),
  products: z.array(z.string()).min(1),
  customerHistory: z.string().optional(),
  idempotencyKey: z.string().uuid()
});
