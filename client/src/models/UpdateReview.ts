import { z } from 'zod';
import { BookViewModelType } from './BookViewModel';
import { ReviewViewModelType } from './ReviewViewModel';

const UpdateReview = z.object({
    idReview: z.custom<ReviewViewModelType>()
    .refine((review) => review != null, "Pole wymagane")
    .transform(review => review.id),
    title: z.string().optional(),
    description: z.string().optional(),
    rating: z.preprocess(
        (a) => parseInt(z.string().parse(a)),
        z.number().int().refine(r => r >= 0 && r <= 5, "Number out of range")),
    idBook: z.custom<BookViewModelType>()
        .refine((book) => book != null, "Pole wymagane")
        .transform(book => book.id),
});

export default UpdateReview;
export type UpdateReviewType = z.infer<typeof UpdateReview>;