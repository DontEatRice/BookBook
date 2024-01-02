import { z } from 'zod';

const UserInfoViewModel = z.object({
  id: z.string(),
  userName: z.string(),
  userImageUrl: z.string().nullable(),
  aboutMe: z.string().nullable(),
  isCritic: z.boolean(),
});

export default UserInfoViewModel;
export type UserInfoViewModelType = z.infer<typeof UserInfoViewModel>;
