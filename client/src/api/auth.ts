import { LoginRequestType } from '../models/LoginRequest';
import { getJwtBody } from '../utils/utils';
import { LocalStorageTokenKey } from '../utils/constants';
import { RegisterUserType } from '../models/RegisterUser';

const base = import.meta.env.VITE_API_BASE_URL + '/Auth';

export class AuthError extends Error {
  constructor(msg: string | undefined) {
    super(msg);
  }
}

export const login = async (request: LoginRequestType) => {
  const result = await fetch(base + '/login', {
    method: 'post',
    body: JSON.stringify(request),
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'include',
  });
  if (!result.ok) {
    throw result;
  }

  return (await result.json()) as { accessToken: string };
};

export const register = async (request: RegisterUserType) => {
  const copy = { ...request };
  copy.avatarPicture = null!;
  await fetch(base + '/register', {
    method: 'post',
    body: JSON.stringify(copy),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
};

export async function getAuthToken() {
  const token = localStorage.getItem(LocalStorageTokenKey);
  if (token === null) {
    throw new AuthError('UNATHORIZED');
  }
  if (getJwtBody(token).exp < Date.now() / 1000) {
    const refreshResponse = await refresh();
    if (!refreshResponse.ok) {
      localStorage.setItem(LocalStorageTokenKey, '');
      window.dispatchEvent(new Event('storage'));
      throw new AuthError('UNATHORIZED');
    }
    const responseBody = (await refreshResponse.json()) as { accessToken: string };
    localStorage.setItem(LocalStorageTokenKey, responseBody.accessToken);
    window.dispatchEvent(new Event('storage'));
    return `Bearer ${responseBody.accessToken}`;
  }
  return `Bearer ${token}`;
}

export function refresh() {
  return fetch(base + '/refresh', {
    method: 'get',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'include',
  });
}
