import { z } from 'zod';

const ACCEPTED_FORMATS = ['image/png', 'image/jpg', 'image/jpeg'];

export const passwordSchema = z
  .string()
  .min(8, 'Hasło musi zawierać mininum 8 znaków')
  .max(128, 'Hasło może zawierać maksymalnie 128 znaków')
  .refine((pass) => /\d+/.test(pass), 'Hasło musi zawierać przynajmniej jedną liczbę');
export const pictureSchema = z
  .custom<FileList>((v) => v == undefined || v instanceof FileList)
  .optional()
  .transform((val) => val?.item(0))
  .refine((file) => file == undefined || file.size <= 1_000_000, {
    message: 'Plik musi być mniejszy niż 1 MB.',
  })
  .refine(
    (file) => file == undefined || ACCEPTED_FORMATS.includes(file.type),
    'Akceptowane pliki to .png i .jpg'
  );

export function paginatedResponse<T>(schema: z.ZodType<T>) {
  return z.object({
    pageNumber: z.number(),
    pageSize: z.number(),
    count: z.number(),
    data: schema.array(),
  });
}

export const ValidationError = z.object({
  type: z.string(),
  title: z.string(),
  errors: z.record(z.string().array()),
});
