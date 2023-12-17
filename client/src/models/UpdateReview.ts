import { z } from 'zod';

const UpdateReview = z.object({
  idReview: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  rating: z.number().min(0).max(5).nullable(),
  idBook: z.string(),
});

export default UpdateReview;
export type UpdateReviewType = z.infer<typeof UpdateReview>;
