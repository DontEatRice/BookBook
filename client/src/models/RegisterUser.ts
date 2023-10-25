import { z } from 'zod';

const ACCEPTED_FORMATS = ['image/png', 'image/jpg', 'image/jpeg'];

const RegisterUser = z
  .object({
    email: z.string().email('Nieprawidłowy adres e-mail').max(64).min(5),
    password: z
      .string()
      .min(8, 'Hasło musi zawierać mininum 8 znaków')
      .max(128, 'Hasło może zawierać maksymalnie 128 znaków')
      .refine((pass) => /\d+/.test(pass), 'Hasło musi zawierać przynajmniej jedną liczbę'),
    confirm: z.string(),
    name: z
      .string()
      .min(3, 'Nazwa powinna być dłuższa niż 3 znaki')
      .max(64, 'Nazwa może mieć maksymalnie 64 znaki')
      .refine(
        (name) => !/[<>!.\\,$%^;:]/.test(name),
        'Nazwa nie może zawierać następujących znaków: <>,.\\!$%^;:'
      ),
    avatarPicture: z
      .custom<FileList>((v) => v == undefined || v instanceof FileList)
      .optional()
      .transform((val) => val?.item(0))
      .refine((file) => file == undefined || file.size <= 1_000_000, {
        message: 'Plik musi być mniejszy niż 1 MB.',
      })
      .refine(
        (file) => file == undefined || ACCEPTED_FORMATS.includes(file.type),
        'Akceptowane pliki to .png i .jpg'
      ),
    avatarImageUrl: z.string().url().max(300).optional(),
  })
  .refine((input) => input.confirm === input.password, {
    message: 'Hasła nie są takie same',
    path: ['confirm'],
  });

export default RegisterUser;
export type RegisterUserType = z.infer<typeof RegisterUser>;
