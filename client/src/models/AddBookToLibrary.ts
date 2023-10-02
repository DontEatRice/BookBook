import { z } from 'zod';

const AddBookToLibrary = z.object({
    libraryId: z.string().uuid(),
    bookId: z.string().uuid(),
    amount: z.number().int().gte(1)
});

export default AddBookToLibrary;
export type AddBookToLibraryType = z.infer<typeof AddBookToLibrary>;