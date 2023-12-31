import { z } from 'zod';
import ReviewUserViewModel from './ReviewUserViewModel';

const ReviewWithBookViewModel = z.object({
  id: z.string().uuid(),
  title: z.string().max(200).nullable(),
  description: z.string().nullable(),
  rating: z.number(),
  user: ReviewUserViewModel,
  created: z.string(),
  book: z.object({
    id: z.string().uuid(),
    title: z.string(),
    yearPublished: z.number().int().positive(),
    coverPictureUrl: z.string().max(256).nullable(),
  }),
});

export default ReviewWithBookViewModel;
export type ReviewWithBookViewModelType = z.infer<typeof ReviewWithBookViewModel>;
