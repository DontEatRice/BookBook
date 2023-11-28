import { z } from 'zod';

const UserDetailViewModel = z.object({
  id: z.string(),
  name: z.string(),
  avatarImageUrl: z.string().nullable(),
  libraryId: z.string().nullable(),
  roles: z.string().array(),
});

export default UserDetailViewModel;
export type UserDetailViewModelType = z.infer<typeof UserDetailViewModel>;
