import { z } from 'zod';

const ReviewInUserProfileViewModel = z.object({
  userId: z.string(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  rating: z.number(),
  bookId: z.string(),
  bookTitle: z.string(),
  bookCoverUrl: z.string().nullable(),
});

export default ReviewInUserProfileViewModel;
export type ReviewInUserProfileViewModelType = z.infer<typeof ReviewInUserProfileViewModel>;
