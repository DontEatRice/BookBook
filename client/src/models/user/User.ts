export type User = {
  id: string;
  roles: string[];
  token: string;
  email: string;
  libraryId?: string;
  name: string;
  lat?: number;
  lon?: number;
};
