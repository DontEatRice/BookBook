import { z } from 'zod';
import PublisherViewModel from './PublisherViewModel';
import AuthorViewModel from './AuthorViewModel';
import BookCategoryViewModel from './BookCategoryViewModel';

const BookViewModel = z.object({
  id: z.string().uuid(),
  isbn: z.string().max(17),
  title: z.string(),
  yearPublished: z.number().positive(),
  averageRating: z.optional(z.number()),
  averageCriticRating: z.optional(z.number()),
  publisher: PublisherViewModel,
  authors: z.array(AuthorViewModel),
  bookCategories: z.array(BookCategoryViewModel),
});

export default BookViewModel;
export type BookViewModelType = z.infer<typeof BookViewModel>;
