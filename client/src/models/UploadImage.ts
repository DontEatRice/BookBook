import { z } from 'zod';

const UploadImage = z.object({
  contentType: z.string().max(64),
  content: z.string(),
  fileName: z.string().transform((name) => {
    if (name.length > 64) {
      name = name.slice(-64);
    }
    return name;
  }),
});

export default UploadImage;
export type UploadImageType = z.infer<typeof UploadImage>;
