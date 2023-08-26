import { z } from 'zod';

const AddAuthor = z.object({
  firstName: z.string().max(40).nonempty(),
  lastName: z.string().max(50).nonempty(),
  birthYear: z.preprocess(
    (a) => parseInt(z.string().parse(a)),
    z.number().positive())
    .refine((year) => year <= new Date().getFullYear(), "Rok urodzenia nie może być z przyszłości"),
  photoLink: z.union([z.literal("").transform(() => null), z.string().trim().url()]).optional(),
});

export default AddAuthor;
export type AddAuthorType = z.infer<typeof AddAuthor>;
