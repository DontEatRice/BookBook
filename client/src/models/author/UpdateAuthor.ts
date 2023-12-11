import { z } from 'zod';

const ACCEPTED_FORMATS = ['image/png', 'image/jpg', 'image/jpeg'];

const UpdateAuthor = z.object({
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
  firstName: z.string().max(40, 'Maksymalnie 40 znaków').min(1, 'Pole wymagane'),
  lastName: z.string().max(50, 'Maksymalnie 50 znaków').min(1, 'Pole wymagane'),
  birthYear: z
    .preprocess((a) => {
      if (typeof a === 'number') {
        return a;
      }
      return parseInt(z.string().parse(a));
    }, z.number().positive())
    .refine((year) => year <= new Date().getFullYear(), 'Rok urodzenia nie może być z przyszłości'),
  profilePictureUrl: z.string().optional().nullable(),
  description: z.string().nullable(),
});

export default UpdateAuthor;
export type UpdateAuthorType = z.infer<typeof UpdateAuthor>;
