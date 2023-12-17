import { z } from 'zod';
import AddressViewModel from '../AddressViewModel';

const UserDetailViewModel = z.object({
  id: z.string(),
  name: z.string(),
  avatarImageUrl: z.string().nullable(),
  libraryId: z.string().nullable(),
  roles: z.string().array(),
  address: AddressViewModel.nullable(),
  aboutMe: z.string().nullable()
});

export default UserDetailViewModel;
export type UserDetailViewModelType = z.infer<typeof UserDetailViewModel>;
