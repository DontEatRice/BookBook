import { z } from 'zod';

const ACCEPTED_FORMATS = ['image/png', 'image/jpg', 'image/jpeg'];

const AddAuthor = z.object({
  avatarPicture: z
    .custom<FileList>((v) => v == undefined || v instanceof FileList)
    .optional()
    .transform((val) => val?.item(0))
    .refine((file) => {
      console.log(file);
      return true;
    })
    .refine((file) => file == undefined || file.size <= 1_000_000, {
      message: 'Plik musi być mniejszy niż 1 MB.',
    })
    .refine(
      (file) => file == undefined || ACCEPTED_FORMATS.includes(file.type),
      'Akceptowane pliki to .png i .jpg'
    ),
  firstName: z.string().max(40).nonempty(),
  lastName: z.string().max(50).nonempty(),
});

export default AddAuthor;
export type AddAuthorType = z.infer<typeof AddAuthor>;
