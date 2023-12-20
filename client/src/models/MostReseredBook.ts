import { z } from 'zod';

const MostReservedBookViewModel = z.object({
  id: z.string().uuid(),
  title: z.string(),
  coverPictureUrl: z.string().max(256).nullable(),
  averageRating: z.nullable(z.number()),
});

export default MostReservedBookViewModel;
export type MostReservedBookViewModelType = z.infer<typeof MostReservedBookViewModel>;

