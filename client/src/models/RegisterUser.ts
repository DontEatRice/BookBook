import { z } from 'zod';
import { passwordSchema, pictureSchema } from '../utils/zodSchemas';

const RegisterUser = z
  .object({
    email: z.string().email('Nieprawidłowy adres e-mail').max(64).min(5),
    password: passwordSchema,
    confirm: z.string(),
    name: z
      .string()
      .min(3, 'Nazwa powinna być dłuższa niż 3 znaki')
      .max(64, 'Nazwa może mieć maksymalnie 64 znaki')
      .refine(
        (name) => !/[<>!.\\,$%^;:]/.test(name),
        'Nazwa nie może zawierać następujących znaków: <>,.\\!$%^;:'
      ),
    avatarPicture: pictureSchema,
    avatarImageUrl: z.string().url().max(300).optional(),
  })
  .refine((input) => input.confirm === input.password, {
    message: 'Hasła nie są takie same',
    path: ['confirm'],
  });

export default RegisterUser;
export type RegisterUserType = z.infer<typeof RegisterUser>;
