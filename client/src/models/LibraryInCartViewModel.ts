import { z } from 'zod';
import BookViewModel from './BookViewModel';
import LibraryViewModel from './LibraryViewModel';

const LibraryInCartViewModel = z.object({
  library: LibraryViewModel,
  books: z.array(BookViewModel),
});

export default LibraryInCartViewModel;
export type LibraryInCartViewModelType = z.infer<typeof LibraryInCartViewModel>;

