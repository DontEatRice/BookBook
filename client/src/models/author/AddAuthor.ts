import { z } from 'zod';

const ACCEPTED_FORMATS = ['image/png', 'image/jpg', 'image/jpeg'];

const AddAuthor = z.object({
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
  firstName: z.string().max(40).nonempty(),
  lastName: z.string().max(50).nonempty(),
  birthYear: z
    .preprocess((a) => parseInt(z.string().parse(a)), z.number().positive())
    .refine((year) => year <= new Date().getFullYear(), 'Rok urodzenia nie może być z przyszłości'),
  profilePictureUrl: z.string().url().optional().nullable(),
  description: z.string().nullable()
});

export default AddAuthor;
export type AddAuthorType = z.infer<typeof AddAuthor>;
