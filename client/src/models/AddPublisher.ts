import { z } from 'zod';

const AddPublisher = z.object({
    name: z.string().max(40).nonempty(),
});

export default AddPublisher;
export type AddPublisherType = z.infer<typeof AddPublisher>;