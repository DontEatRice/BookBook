import { z } from 'zod';

const UpdatePublisher = z.object({
    name: z.string().max(40, "Maksymalnie 40 znaków").min(1, "Pole wymagane"),
    description: z.string().optional(),
});

export default UpdatePublisher;
export type UpdatePublisherType = z.infer<typeof UpdatePublisher>;
