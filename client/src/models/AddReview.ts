import { z } from 'zod';
import { BookViewModelType } from './BookViewModel';

const AddReview = z.object({
    title: z.string().min(2).nonempty(),
    description: z.string().min(2).nonempty(),
    rating: z.preprocess(
        (a) => parseInt(z.string().parse(a)),
        z.number().int().refine(r => r >= 0 && r <= 5, "Number out of range")),
    idBook: z.custom<BookViewModelType>()
        .refine((book) => book != null, "Pole wymagane")
        .transform(book => book.id),
});

export default AddReview;
export type AddReviewType = z.infer<typeof AddReview>;