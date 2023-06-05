import { z } from 'zod';

const Book = z.object({
  name: z.string().max(300),
  id: z.optional(z.string().uuid()),
  price: z.number().positive(),
});

export default Book;
export type BookType = z.infer<typeof Book>;
