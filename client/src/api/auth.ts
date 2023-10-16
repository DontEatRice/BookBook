import { LoginRequestType } from '../models/LoginRequest';

const base = import.meta.env.VITE_API_BASE_URL + '/Auth';

export const login = async (request: LoginRequestType) => {
  const response = await fetch(base + '/login', {
    method: 'post',
    body: JSON.stringify(request),
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'include',
  });
  return response;
};
