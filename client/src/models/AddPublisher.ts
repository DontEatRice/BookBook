import { z } from 'zod';

const AddPublisher = z.object({
    name: z.string().max(40, "Maksymalnie 40 znaków").min(1, "Pole wymagane"),
    description: z.union([z.literal("").transform(() => null), z.string()]).optional(),
});

export default AddPublisher;
export type AddPublisherType = z.infer<typeof AddPublisher>;