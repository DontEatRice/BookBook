import { z } from 'zod';
import ReviewUserViewModel from './ReviewUserViewModel';

const ReviewViewModel = z.object({
  id: z.string().uuid(),
  title: z.string().max(200).nullable(),
  description: z.string().nullable(),
  rating: z.number(),
  isCriticRating: z.boolean(),
  user: ReviewUserViewModel,
  created: z.string(),
});

export default ReviewViewModel;
export type ReviewViewModelType = z.infer<typeof ReviewViewModel>;
