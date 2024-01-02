import { z } from 'zod';

const ReviewUserViewModel = z.object({
  id: z.string().uuid(),
  name: z.string().max(200).nullable(),
  avatarImageUrl: z.string().nullable(),
});

export default ReviewUserViewModel;
export type ReviewUserViewModelType = z.infer<typeof ReviewUserViewModel>;

