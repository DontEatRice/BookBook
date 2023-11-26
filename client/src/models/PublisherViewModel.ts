import { z } from 'zod';

const PublisherViewModel = z.object({
  id: z.string().uuid(),
  name: z.string().max(40),
  description: z.string().nullable(),
});

export default PublisherViewModel;
export type PublisherViewModelType = z.infer<typeof PublisherViewModel>;
