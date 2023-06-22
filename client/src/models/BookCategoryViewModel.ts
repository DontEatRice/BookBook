import { z } from 'zod';

const BookCategoryViewModel = z.object({
  id: z.string().uuid(),
  name: z.string().max(40).nonempty(),
});

export default BookCategoryViewModel;
export type BookCategoryViewModelType = z.infer<typeof BookCategoryViewModel>;
