import { z } from 'zod';
import PublisherViewModel from './PublisherViewModel';
import AuthorViewModel from './author/AuthorViewModel';
import BookCategoryViewModel from './BookCategoryViewModel';

const BookViewModel = z.object({
  id: z.string().uuid(),
  isbn: z.string().max(17),
  title: z.string(),
  yearPublished: z.number().int().positive(),
  description: z.string().nullable(),
  language: z.string(),
  pageCount: z.number().nullable(),
  coverPictureUrl: z.string().url().max(256).nullable(),
  averageRating: z.nullable(z.number()),
  averageCriticRating: z.nullable(z.number()),
  publisher: PublisherViewModel.nullable(),
  authors: z.array(AuthorViewModel),
  bookCategories: z.array(BookCategoryViewModel),
  doesUserObserve: z.nullable(z.boolean()),
});

export default BookViewModel;
export type BookViewModelType = z.infer<typeof BookViewModel>;
