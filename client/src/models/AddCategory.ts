import { z } from 'zod';

const AddCategory = z.object({
  name: z.string().max(40).nonempty(),
});

export default AddCategory;
export type AddCategoryType = z.infer<typeof AddCategory>;
