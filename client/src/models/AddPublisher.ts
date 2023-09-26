import { z } from 'zod';

const AddPublisher = z.object({
    name: z.string().max(40).nonempty(),
    description: z.union([z.literal("").transform(() => null), z.string()]).optional(),
});

export default AddPublisher;
export type AddPublisherType = z.infer<typeof AddPublisher>;