import { z } from 'zod';

const ReviewViewModel = z.object({
  id: z.string().uuid(),
  title: z.string().max(200).nullable(),
  description: z.string().nullable(),
  rating: z.number(),
  userId: z.string().uuid()
});

export default ReviewViewModel;
export type ReviewViewModelType = z.infer<typeof ReviewViewModel>;

