export type Role = 'User' | 'Admin' | 'Employee';

export type ErrorResponse = {
  type: string;
  code?: string;
};

export const LocalStorageTokenKey = 'token';

export type Claims = {
  idenityid: string;
  role: string | Array<string>;
  exp: number;
  email: string;
  libraryid?: string;
};

export type Order = 'asc' | 'desc';

export type PaginationRequest = {
  pageSize: number;
  pageNumber: number;
  orderByField?: string;
  orderDirection?: Order;
};
