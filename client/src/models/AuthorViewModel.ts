import { z } from 'zod';

const AuthorViewModel = z.object({
  id: z.string().uuid(),
  firstName: z.string().max(40),
  lastName: z.string().max(50),
  birthYear: z.number().int().positive(),
  profilePictureUrl: z.string().url().max(256).nullable(),
});

export default AuthorViewModel;
export type AuthorViewModelType = z.infer<typeof AuthorViewModel>;
