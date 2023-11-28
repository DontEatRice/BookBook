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
  })
  .refine((input) => input.confirm === input.password, {
    message: 'Hasła nie są takie same',
    path: ['confirm'],
  });

export default RegisterUser;
export type RegisterUserType = z.infer<typeof RegisterUser>;
