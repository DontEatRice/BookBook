import { User } from '../models/User';
import { Claims } from './constants';

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

export function getJwtBody(token: string): Claims {
  const body = token.split('.')[1];
  return JSON.parse(atob(body)) as Claims;
}

export function convertJwtToUser(token: string): User {
  const claims = getJwtBody(token);
  let roles: string[] = [];

  if (Array.isArray(claims.role)) {
    roles = claims.role;
  } else if (typeof claims.role === 'string') {
    roles = [claims.role];
  }

  return {
    id: claims.idenityid,
    token,
    roles,
    email: claims.email,
  };
}
