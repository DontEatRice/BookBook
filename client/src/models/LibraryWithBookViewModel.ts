import { z } from 'zod';
import AddressViewModel from './AddressViewModel';

const LibraryWithBookViewModel = z.object({
  id: z.string().uuid(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  address: AddressViewModel,
  isBookCurrentlyAvailable: z.boolean(),
});

export default LibraryWithBookViewModel;
export type LibraryWithBookViewModelType = z.infer<typeof LibraryWithBookViewModel>;

