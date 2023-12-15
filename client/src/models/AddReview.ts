import { z } from 'zod';
import { BookViewModelType } from './BookViewModel';
import { UserDetailViewModelType } from './user/UserDetailViewModel';

const AddReview = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    rating: z.preprocess(
        (a) => parseInt(z.string().parse(a)),
        z.number().int().refine(r => r >= 0 && r <= 5, "Ocena musi mieścić się między 0, a 5")),
    idBook: z.custom<BookViewModelType>()
        .refine((book) => book != null, "Pole wymagane")
        .transform(book => book.id),
});

export default AddReview;
export type AddReviewType = z.infer<typeof AddReview>;