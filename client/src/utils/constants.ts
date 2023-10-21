export type Role = 'User' | 'Admin';

export type ErrorResponse = {
  type: string;
  code: string;
};

export const LocalStorageTokenKey = 'token';

export type Claims = {
  idenityid: string;
  role: string | Array<string>;
  exp: number;
  email: string;
};
