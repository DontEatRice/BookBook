import { z } from 'zod';
import PublisherViewModel from './PublisherViewModel';
import AuthorViewModel from './author/AuthorViewModel';
import BookCategoryViewModel from './BookCategoryViewModel';

const BookInRankingViewModel = z.object({
  id: z.string().uuid(),
  isbn: z.string().max(17),
  title: z.string(),
  coverPictureUrl: z.string().url().max(256).nullable(),
  averageRating: z.nullable(z.number()),
  averageCriticRating: z.nullable(z.number()),
  publisher: PublisherViewModel.nullable(),
  authors: z.array(AuthorViewModel),
  bookCategories: z.array(BookCategoryViewModel),
  reviewsCount: z.number().int(),
});

export default BookInRankingViewModel;
export type BookInRankingViewModelType = z.infer<typeof BookInRankingViewModel>;

