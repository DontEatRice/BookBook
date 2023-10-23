import { z } from 'zod';
import { BookViewModelType } from './BookViewModel';

const AddReview = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    rating: z.number(),
    idBook: z.custom<BookViewModelType>()
        .refine((book) => book != null, "Pole wymagane")
        .transform(book => book.id),
});

export default AddReview;
export type AddReviewType = z.infer<typeof AddReview>;