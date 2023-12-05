import { z } from 'zod';
import BookViewModel from './BookViewModel';

const LibraryViewModel = z.object({
  id: z.string(),
  name: z.string(),
});

const ReservationViewModel = z.object({
  id: z.string(),
  userId: z.string(),
  library: LibraryViewModel,
  status: z.string(),
  reservationEndDate: z.string(),
  books: z.array(BookViewModel).optional(),
});

export default ReservationViewModel;
export type ReservationViewModelType = z.infer<typeof ReservationViewModel>;

