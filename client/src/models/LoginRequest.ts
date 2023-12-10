import { z } from 'zod';

const LoginRequest = z.object({
  password: z
    .string()
    .max(64, 'Hasło ma maksymalnie 8 znaków długości')
    .min(8, 'Hasło ma minimum 8 znaków długości'),
  email: z
    .string()
    .email('Nieprawidłowy adres e-mail!')
    .max(128, 'E-mail ma maksymalnie 128 znaków długości'),
});

export default LoginRequest;
export type LoginRequestType = z.infer<typeof LoginRequest>;
