import { z } from 'zod';
import PublisherViewModel from './PublisherViewModel';
import AuthorViewModel from './AuthorViewModel';
import BookCategoryViewModel from './BookCategoryViewModel';
import ReviewViewModel from './ReviewViewModel';

const BookViewModel = z.object({
  id: z.string().uuid(),
  isbn: z.string().max(17),
  title: z.string(),
  yearPublished: z.number().int().positive(),
  averageRating: z.nullable(z.number()),
  averageCriticRating: z.nullable(z.number()),
  publisher: PublisherViewModel.nullable(),
  authors: z.array(AuthorViewModel),
  reviews: z.array(ReviewViewModel),
  bookCategories: z.array(BookCategoryViewModel),
});

export default BookViewModel;
export type BookViewModelType = z.infer<typeof BookViewModel>;
