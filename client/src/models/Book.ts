import { z } from 'zod';
import AuthorViewModel from './AuthorViewModel';

const Book = z.object({
  name: z.string().max(300),
  id: z.optional(z.string().uuid()),
  price: z.number().positive(),
  authors: z.array(AuthorViewModel),
});

export default Book;
export type BookType = z.infer<typeof Book>;
