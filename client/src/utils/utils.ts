import { z } from 'zod';
import UploadImage from '../models/UploadImage';
import { User } from '../models/user/User';
import { Claims, PaginationRequest } from './constants';
import { ResponseError, ValidationError } from './zodSchemas';
import { icon } from 'leaflet';

const base = import.meta.env.VITE_API_BASE_URL;

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

export function imgUrl(dbPath: string | undefined | null, defaultValue?: string) {
  if (!dbPath) {
    return defaultValue ?? '';
  }
  let prefix = base;
  if (!prefix.endsWith('/')) {
    prefix += '/';
  }
  if (dbPath.startsWith('/')) {
    dbPath = dbPath.replace('/', '');
  }
  return prefix + 'images/' + dbPath;
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
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
  return JSON.parse(jsonPayload);
}

export async function handleBadResponse(response: Response) {
  const rawBody = await response.text();
  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    body = {};
  }
  const validationErrorParse = ValidationError.safeParse(body);
  if (validationErrorParse.success) {
    throw new ValidationApiError(response.status, validationErrorParse.data);
  }
  const apiResponseError = ResponseError.safeParse(body);
  if (apiResponseError.success) {
    throw new ApiResponseError(response.status, apiResponseError.data);
  }
  const apiError = new ApiError(response.status, rawBody);
  apiError.rawResponse = response;
  throw apiError;
}

export function loginWithReturnToPath(returnTo: string) {
  return `/login?returnTo=${encodeURIComponent(returnTo)}`;
}

export function convertJwtToUser(token: string): User {
  const claims = getJwtBody(token);

  return {
    id: claims.identityid,
    token,
    role: claims.r,
    email: claims.email,
    libraryId: claims.libraryid,
    name: claims._name,
    lat: claims.lat ? Number(claims.lat.toString().replace(',', '.')) : undefined,
    lon: claims.lon ? Number(claims.lon.toString().replace(',', '.')) : undefined,
  };
}

export const MarkerIcon = icon({
  iconUrl: '/marker-icon.png',
  iconSize: [25, 41],
});

export class ApiError {
  private _rawResponse?: Response;

  constructor(private code: number, private responseContent?: string) {}

  getCode() {
    return this.code;
  }
  getResponseContent() {
    return this.responseContent;
  }

  get rawResponse() {
    return this._rawResponse;
  }

  set rawResponse(value: Response | undefined) {
    this._rawResponse = value;
  }
}

export class ApiResponseError extends ApiError {
  constructor(code: number, private responseError: z.infer<typeof ResponseError>, responseContent?: string) {
    super(code, responseContent);
  }

  get error() {
    return this.responseError;
  }
}

export class ValidationApiError extends ApiError {
  constructor(code: number, private error: z.infer<typeof ValidationError>, responseContent?: string) {
    super(code, responseContent);
  }

  get validationError() {
    return this.error;
  }
}
