import { z } from 'zod';
import { BookViewModelType } from './BookViewModel';

const AddBookToLibrary = z.object({
    libraryId: z.string().uuid(),
    bookId: z.custom<BookViewModelType>()
        .refine((book) => book != null, "Pole wymagane")
        .transform(book => book.id),
    amount: z.preprocess(
        (a) => parseInt(z.string().parse(a)),
        z.number().int())
        .refine((amount) => amount >= 1, "Ilość musi być dodatnią liczbą całkowitą!"),
});

export default AddBookToLibrary;
export type AddBookToLibraryType = z.infer<typeof AddBookToLibrary>;