import { z } from 'zod';

const LoginRequest = z.object({
  password: z.string().max(64).min(8),
  email: z.string().email('Nieprawidłowy adres e-mail!').max(128),
});

export default LoginRequest;
export type LoginRequestType = z.infer<typeof LoginRequest>;
