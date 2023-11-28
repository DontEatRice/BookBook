import { z } from 'zod';

const AddCategory = z.object({
  name: z.string().max(40, "Maksymalnie 40 znaków").min(1, "Pole wymagane"),
});

export default AddCategory;
export type AddCategoryType = z.infer<typeof AddCategory>;
