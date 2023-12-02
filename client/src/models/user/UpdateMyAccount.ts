import { z } from 'zod';
import { pictureSchema, userNameSchema } from '../../utils/zodSchemas';
import LibraryViewModel from '../LibraryViewModel';

const UpdateMyAccount = z.object({
  avatarPicture: pictureSchema,
  name: userNameSchema,
  avatarImageUrl: z.string().url().nullable(),
  library: LibraryViewModel.optional().nullable(),
  street: z.string().min(1, "To pole jest wymagane").optional(),
    number: z.string()
      .min(1, "To pole jest wymagane")
      .refine((value) => /^\d*[A-Z]{0,1}$/.test(value), "Wprowadź poprawny numer budynku")
      .optional(),
    apartment: z.string().nullable().optional(),
    postalCode: z.string()
      .min(1, "To pole jest wymagane")
      .refine((value) => /^[0-9]{2}-[0-9]{3}$/.test(value), 'Kod pocztowy musi odpowiadać formatowi 00-000')
      .optional(),
    city: z.string().min(1, "To pole jest wymagane").optional()
});

export default UpdateMyAccount;
export type UpdateMyAccountType = z.infer<typeof UpdateMyAccount>;
