/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react';
import { User } from '../../models/user/User';

interface IAuthContext {
  user: User | null;
  expires: Date | null;
  login: (token: string) => User | null;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  login: () => {
    return null;
  },
  logout: () => {},
  expires: null,
});
