export type Role = 'User' | 'Admin' | 'Employee';

export type ErrorResponse = {
  type: string;
  code?: string;
};

export const LocalStorageTokenKey = 'token';

export type Claims = {
  identityid: string;
  role: string | Array<string>;
  exp: number;
  email: string;
  libraryid?: string;
};

export type Order = 'asc' | 'desc';
