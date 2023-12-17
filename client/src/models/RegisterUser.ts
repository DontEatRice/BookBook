import { z } from 'zod';
import { passwordSchema, pictureSchema, userNameSchema } from '../utils/zodSchemas';

const RegisterUser = z
  .object({
    email: z.string().email('Nieprawidłowy adres e-mail').max(64).min(5),
    password: passwordSchema,
    confirm: z.string(),
    name: userNameSchema,
    avatarPicture: pictureSchema,
    avatarImageUrl: z.string().url().max(300).optional(),
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
  })
  .refine((input) => input.confirm === input.password, {
    message: 'Hasła nie są takie same',
    path: ['confirm'],
  });

export default RegisterUser;
export type RegisterUserType = z.infer<typeof RegisterUser>;
