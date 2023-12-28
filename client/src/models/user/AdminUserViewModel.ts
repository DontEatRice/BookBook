import { z } from 'zod';

const AdminUserViewModel = z.object({
  id: z.string(),
  name: z.string(),
  avatarImageUrl: z.string().nullable(),
  email: z.string().email(),
  isCritic: z.boolean()
});

export default AdminUserViewModel;
export type AdminUserViewModelType = z.infer<typeof AdminUserViewModel>;
