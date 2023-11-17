import { z } from 'zod';
import AuthorViewModel, { AuthorViewModelType } from './AuthorViewModel';
import { BookCategoryViewModelType } from './BookCategoryViewModel';
import { PublisherViewModelType } from './PublisherViewModel';

const AddBook = z.object({
    ISBN: z.string().refine((value) => /^(?=(?:[^0-9]*[0-9]){10}(?:(?:[^0-9]*[0-9]){3})?$)[\d-]+$/.test(value), 'Nieprawidłowy ISBN'),
    title: z.string().nonempty(),
    yearPublished: z.preprocess(
        (a) => parseInt(z.string().parse(a)),
        z.number().positive())
        .refine((year) => year <= new Date().getFullYear(), "Rok wydania nie może być z przyszłości"),
    idPublisher: z.custom<PublisherViewModelType>()
        .refine((publisher) => publisher != null, "Pole wymagane")
        .transform(publisher => publisher.id),
    categoriesIds: z.custom<BookCategoryViewModelType>()
        .array()
        .transform(categories => categories.map(category => category.id))
        .refine(ids => ids.length > 0, "Książka musi mieć co najmniej jedną kategorię"),
    authorsIds: z.custom<AuthorViewModelType>()
        .array()
        .transform(authors => authors.map(author => author.id))
        .refine(ids => ids.length > 0, "Książka musi mieć co najmniej jednego autora"),
    // .refine(ids => ids.every(id => z.string().uuid().safeParse(id).success))
});

export default AddBook;
export type AddBookType = z.infer<typeof AddBook>;
