import { z } from 'zod';

const ToggleBookInUserList = z.object({
    bookId: z.string().uuid()
});

export default ToggleBookInUserList;
export type ToggleBookInUserListType = z.infer<typeof ToggleBookInUserList>;
