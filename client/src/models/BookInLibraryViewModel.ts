import { number, z } from 'zod';
import BookViewModel from './BookViewModel';

const BookInLibraryViewModel = z.object({
    book: BookViewModel,
    amount: number().int(),
    available: number().int()
});

export default BookInLibraryViewModel;
export type BookInLibraryViewModelType = z.infer<typeof BookInLibraryViewModel>;