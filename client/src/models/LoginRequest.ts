import { z } from 'zod';
import { Role } from '../utils/constants';

const LoginRequest = z.object({
  loginAs: z.custom<Role>(),
  password: z.string().max(64).min(8),
  email: z.string().email('Nieprawidłowy adres e-mail!').max(128),
});

export default LoginRequest;
export type LoginRequestType = z.infer<typeof LoginRequest>;
