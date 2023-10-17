import { z } from 'zod';
import LibraryInCartViewModel from './LibraryInCartViewModel';

const CartViewModel = z.object({
  librariesInCart: z.array(LibraryInCartViewModel),
});

export default CartViewModel;
export type CartViewModelType = z.infer<typeof CartViewModel>;

