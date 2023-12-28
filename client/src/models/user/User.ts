export type User = {
  id: string;
  role: string;
  token: string;
  email: string;
  libraryId?: string;
  name: string;
  lat?: number;
  lon?: number;
};
