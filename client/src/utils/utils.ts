import { z } from 'zod';
import UploadImage from '../models/UploadImage';
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

export function paginatedFetch(
  url: string,
  body: PaginationRequest,
  authToken: string | undefined = undefined
) {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });
  if (authToken) {
    headers.append('Authorization', authToken);
  }
  return fetch(url, {
    method: 'post',
    headers,
    body: JSON.stringify(body),
  });
}

export type PaginationRequest = {
  pageSize: number;
  pageNumber: number;
  orderByField?: string;
};

export function paginatedResponse<T>(schema: z.ZodType<T>) {
  return z.object({
    pageNumber: z.number(),
    pageSize: z.number(),
    count: z.number(),
    data: schema.array(),
  });
}

export async function fileToUploadImage(file: File) {
  let base64 = await fileToBase64(file);
  base64 = base64.slice(base64.indexOf(',') + 1);
  return UploadImage.parse({
    content: base64,
    contentType: file.type,
    fileName: file.name,
  });
}

export function getJwtBody(token: string): Claims {
  const body = token.split('.')[1];
  return JSON.parse(atob(body)) as Claims;
}

// export function handleError(error: unknown) {

// }

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
    libraryId: claims.libraryid,
  };
}
