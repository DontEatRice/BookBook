import { z } from 'zod';
import { pictureSchema, userNameSchema } from '../../utils/zodSchemas';
import LibraryViewModel from '../LibraryViewModel';

const UpdateMyAccount = z.object({
  avatarPicture: pictureSchema,
  name: userNameSchema,
  avatarImageUrl: z.string().url().nullable(),
  libraryId: z.string().optional().nullable(),
  library: LibraryViewModel.optional().nullable(),
});

export default UpdateMyAccount;
export type UpdateMyAccountType = z.infer<typeof UpdateMyAccount>;
