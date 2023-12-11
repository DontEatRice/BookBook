import { z } from 'zod';

const BookCategoryViewModel = z.object({
  id: z.string().uuid(),
  name: z.string().max(40, 'To pole może mieć maksymalnie 40 znaków!').min(1, 'To pole nie może być puste!'),
});

export default BookCategoryViewModel;
export type BookCategoryViewModelType = z.infer<typeof BookCategoryViewModel>;
