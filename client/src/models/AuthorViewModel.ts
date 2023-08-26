import { z } from 'zod';

const AuthorViewModel = z.object({
  id: z.string().uuid(),
  firstName: z.string().max(40),
  lastName: z.string().max(50),
  birthYear: z.number().int().positive(),
  photoLink: z.union([z.string().trim().url(), z.null()]),
});

export default AuthorViewModel;
export type AuthorViewModelType = z.infer<typeof AuthorViewModel>;
