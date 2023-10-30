import { z } from 'zod';

const MakeReservation = z.object({
  libraryId: z.string(),
});

export default MakeReservation;
export type MakeReservationType = z.infer<typeof MakeReservation>;

