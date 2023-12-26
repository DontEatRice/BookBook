import { z } from 'zod';

const numberSchema = z.preprocess((a) => {
  if (typeof a === 'number') {
    return a;
  }
  return parseInt(z.string().parse(a));
}, z.number().int().positive('Wartość musi być dodatnią liczbą całkowitą'));

const UpdateBookInLibrary = z
  .object({
    amount: numberSchema,
    available: numberSchema,
  })
  .refine((input) => input.available < input.amount, {
    message: 'Dostępna ilość nie może być większa od całkowitej ilości',
    path: ['available'],
  });

export default UpdateBookInLibrary;
export type UpdateBookInLibraryType = z.infer<typeof UpdateBookInLibrary>;
