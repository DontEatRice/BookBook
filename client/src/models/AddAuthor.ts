import { z } from 'zod';

const AddAuthor = z.object({
  firstName: z.string().max(40).nonempty(),
  lastName: z.string().max(50).nonempty(),
});

export default AddAuthor;
export type AddAuthorType = z.infer<typeof AddAuthor>;
