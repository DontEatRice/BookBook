import { z } from 'zod';

const PublisherViewModel = z.object({
  id: z.string().uuid(),
  name: z.string().max(40),
  description: z.union([z.string(), z.null()]),
  logoLink: z.union([z.string().trim().url(), z.null()]),
});

export default PublisherViewModel;
export type PublisherViewModelType = z.infer<typeof PublisherViewModel>;
