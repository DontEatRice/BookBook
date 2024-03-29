import { z } from 'zod';
import PublisherViewModel from './PublisherViewModel';
import BookCategoryViewModel from './BookCategoryViewModel';
import AuthorViewModel from './author/AuthorViewModel';

const ACCEPTED_FORMATS = ['image/png', 'image/jpg', 'image/jpeg'];

const UpdateBook = z.object({
  coverPicture: z
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
  isbn: z
    .string()
    .refine(
      (value) => /^(?=(?:[^0-9]*[0-9]){10}(?:(?:[^0-9]*[0-9]){3})?$)[\d-]+$/.test(value),
      'Nieprawidłowy ISBN'
    ),
  title: z.string().min(1, 'To pole jest wymagane'),
  yearPublished: z
    .preprocess((a) => {
      if (typeof a === 'number') {
        return a;
      }
      return parseInt(z.string().parse(a));
    }, z.number().positive('Liczba musi być dodatnia'))
    .refine((year) => year <= new Date().getFullYear(), 'Rok wydania nie może być z przyszłości'),
  description: z.string().nullable(),
  language: z.string().min(1, 'To pole jest wymagane'),
  pageCount: z
    .number()
    .or(z.string())
    .nullable()
    .transform((value) => {
      if (value == null || value == '') return null;
      else {
        return value;
      }
    })
    .refine((value) => {
      if (value == null) return true;
      if (typeof value == 'number') {
        return value > 0;
      } else {
        return parseInt(value) > 0;
      }
    }, 'Wartość musi być większa niż 0'),
  coverPictureUrl: z.string().optional().nullable(),
  publisher: PublisherViewModel.nullable(),
  bookCategories: BookCategoryViewModel.array().refine(
    (categories) => categories.length > 0,
    'Książka musi mieć co najmniej jedną kategorię'
  ),
  authors: AuthorViewModel.array().refine(
    (authors) => authors.length > 0,
    'Książka musi mieć co najmniej jednego autora'
  ),
});

export default UpdateBook;
export type UpdateBookType = z.infer<typeof UpdateBook>;
