import { LoginRequestType } from '../models/LoginRequest';
import { getJwtBody, handleBadResponse } from '../utils/utils';
import { LocalStorageTokenKey } from '../utils/constants';
import { RegisterUserType } from '../models/RegisterUser';
import { RegisterEmployeeType } from '../models/RegisterEmployee';

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
    await handleBadResponse(result);
  }

  return (await result.json()) as { accessToken: string };
};

export const register = async (request: RegisterUserType) => {
  const copy = { ...request };
  copy.avatarPicture = null!;
  const result = await fetch(base + '/register', {
    method: 'post',
    body: JSON.stringify(copy),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  if (!result.ok) {
    await handleBadResponse(result);
  }
};

export async function getAuthTokenOrNull() {
  try {
    return await getAuthToken();
  } catch {
    return null;
  }
}

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

export async function refresh() {
  const result = await fetch(base + '/refresh', {
    method: 'get',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'include',
  });
  return result;
}

export const registerEmployee = async (request: RegisterEmployeeType) => {
  const auth = await getAuthToken();
  const copy = { ...request };
  copy.avatarPicture = null!;
  const result = await fetch(base + '/employee/register', {
    method: 'post',
    body: JSON.stringify(copy),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: auth,
    }),
  });
  if (!result.ok) {
    await handleBadResponse(result);
  }
};
