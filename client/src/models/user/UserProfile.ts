import { z } from 'zod';
import BookViewModel from '../BookViewModel';

const UserProfileViewModel = z.object({
    userName: z.string(),
    userImageUrl: z.string().nullable(),
    userLocation: z.string().nullable(),
    userLastReadBooks: BookViewModel.array()
});

export default UserProfileViewModel;
export type UserProfileViewModelType = z.infer<typeof UserProfileViewModel>;
