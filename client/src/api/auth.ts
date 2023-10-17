import { LoginRequestType } from '../models/LoginRequest';
import { getJwtBody } from '../utils/utils';

const base = import.meta.env.VITE_API_BASE_URL + '/Auth';

export class AuthError extends Error {
  constructor(msg: string | undefined) {
    super(msg);
  }
}

export const login = async (request: LoginRequestType) => {
  const response = await fetch(base + '/login', {
    method: 'post',
    body: JSON.stringify(request),
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'include',
  });
  return response;
};

export async function getAuthToken() {
  const token = localStorage.getItem('token');
  if (token === null) {
    throw new AuthError('UNATHORIZED');
  }
  if (getJwtBody(token).exp < Date.now() / 1000) {
    const refreshResponse = await refresh();
    if (!refreshResponse.ok) {
      throw new AuthError('UNATHORIZED');
    }
    const responseBody = (await refreshResponse.json()) as { accessToken: string };
    return `Bearer ${responseBody.accessToken}`;
  }
  return `Bearer ${token}`;
}

async function refresh() {
  const response = await fetch(base + '/refresh', {
    method: 'get',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'include',
  });
  return response;
}
