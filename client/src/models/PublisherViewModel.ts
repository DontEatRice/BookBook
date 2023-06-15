import { z } from 'zod';

const PublisherViewModel = z.object({
  id: z.string().uuid(),
  name: z.string().max(40),
});

export default PublisherViewModel;
export type PublisherViewModelType = z.infer<typeof PublisherViewModel>;
