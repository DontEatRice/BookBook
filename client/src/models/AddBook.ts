import { z } from 'zod';

const AddBook = z.object({
    firstName: z.string().max(40).nonempty(),
    ISBN: z.string().min(13).max(17).nonempty(),
    title: z.string().nonempty(),
    yearPublished: z.preprocess(
        (a) => parseInt(z.string().parse(a)),
        z.number().positive()),
    coverLink: z.union([z.literal(""), z.string().trim().url()]).optional(),
    publisher: z.string().uuid(),
    categories: z.string().uuid().array().min(1),
    authors: z.string().uuid().array().min(1)
});

export default AddBook;
export type AddBookType = z.infer<typeof AddBook>;
