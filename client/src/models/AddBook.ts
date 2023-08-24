import { z } from 'zod';
import { AuthorViewModelType } from './AuthorViewModel';
import { BookCategoryViewModelType } from './BookCategoryViewModel';
import { PublisherViewModelType } from './PublisherViewModel';

const AddBook = z.object({
    ISBN: z.string().min(13).max(17).nonempty(),
    title: z.string().nonempty(),
    yearPublished: z.preprocess(
        (a) => parseInt(z.string().parse(a)),
        z.number().positive()),
    coverLink: z.union([z.literal(""), z.string().trim().url()]).optional(),
    idPublisher: z.custom<PublisherViewModelType>()
        .transform(publisher => publisher.id === '' ? null : publisher.id),
    categoriesIds: z.custom<BookCategoryViewModelType>()
        .array()
        .transform(categories => categories.map(category => category.id))
        .refine(ids => ids.length > 0, "Książka musi mieć co najmniej jedną kategorię"),
    authorsIds: z.custom<AuthorViewModelType>()
        .array()
        .transform(authors => authors.map(author => author.id))
        .refine(ids => ids.length > 0, "Książka musi mieć co najmniej jednego autora")
    // .refine(ids => ids.every(id => z.string().uuid().safeParse(id).success))
});

export default AddBook;
export type AddBookType = z.infer<typeof AddBook>;
