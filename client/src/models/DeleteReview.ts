import { z } from 'zod';
import { BookViewModelType } from './BookViewModel';

const AddReview = z.object({
    id: z.string().uuid(),
    title: z.string().optional(),
    description: z.string().optional(),
    rating: z.number(),
});

export default AddReview;
export type AddReviewType = z.infer<typeof AddReview>;