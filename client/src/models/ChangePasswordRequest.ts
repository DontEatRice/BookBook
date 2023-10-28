import { z } from 'zod';
import { passwordSchema } from '../utils/zodSchemas';

const ChangePasswordRequest = z
  .object({
    newPassword: passwordSchema,
    oldPassword: z.string().min(1, 'Podaj stare hasło'),
    confirm: z.string(),
  })
  .refine((input) => input.confirm === input.newPassword, {
    message: 'Hasła nie są takie same',
    path: ['confirm'],
  })
  .refine((input) => input.oldPassword === input.newPassword, {
    message: 'Nowe hasło nie może być takie samo jak stare',
    path: ['newPassword'],
  });

export default ChangePasswordRequest;
export type ChangePasswordRequestType = z.infer<typeof ChangePasswordRequest>;
