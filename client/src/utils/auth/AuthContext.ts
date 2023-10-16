/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react';
import { User } from '../../models/User';

interface IAuthContext {
  user: User | null;
  expires: Date | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  login: () => {},
  logout: () => {},
  expires: null,
});
