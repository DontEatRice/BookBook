import { z } from 'zod';

const AddToCart = z.object({
  bookId: z.string(),
  libraryId: z.string(),
});

export default AddToCart;
export type AddToCartType = z.infer<typeof AddToCart>;

