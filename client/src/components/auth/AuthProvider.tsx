import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../../utils/auth/AuthContext';
import { User } from '../../models/User';
import { useLocalStorage } from '../../utils/auth/useLocalStorage';
import { getJwtBody, convertJwtToUser } from '../../utils/utils';
import { LocalStorageTokenKey } from '../../utils/constants';
import { getAuthToken } from '../../api/auth';

function initUser() {
  const token = localStorage.getItem(LocalStorageTokenKey);
  if (!token) {
    return null;
  }
  const claims = getJwtBody(token);
  const expires = new Date(claims.exp * 1000);
  if (expires < new Date()) {
    return null;
  }
  return convertJwtToUser(token);
}

function initExpires() {
  const token = localStorage.getItem(LocalStorageTokenKey);
  if (!token) {
    return null;
  }
  const claims = getJwtBody(token);
  return new Date(claims.exp * 1000);
}

function AuthProvider({ children }: { children?: ReactNode }) {
  const { getItem, setItem, removeItem } = useLocalStorage();
  const [expires, setExpires] = useState<Date | null>(initExpires);
  const [user, setUser] = useState<User | null>(initUser);

  const login = useCallback(
    (token: string) => {
      const claims = getJwtBody(token);
      const expires = new Date(claims.exp * 1000);
      if (expires < new Date()) {
        removeItem(LocalStorageTokenKey);
        return null;
      }
      setItem(LocalStorageTokenKey, token);
      setExpires(new Date(claims.exp * 1000));
      const user = convertJwtToUser(token);
      setUser(user);
      return user;
    },
    [removeItem, setItem]
  );

  const handleTokenChange = useCallback(() => {
    const token = getItem(LocalStorageTokenKey);
    console.log('handleTokenChange', { token });
    if (token) {
      login(token);
    }
  }, [getItem, login]);

  //odświeżenie wygasłego access tokenu
  useEffect(() => {
    const token = getItem(LocalStorageTokenKey);
    if (!token) {
      return;
    }
    if (expires && expires >= new Date()) {
      return;
    }
    getAuthToken().catch((err) => {
      console.log(err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener('storage', handleTokenChange);
    return () => window.removeEventListener('storage', handleTokenChange);
  }, [handleTokenChange]);

  const logout = useCallback(() => {
    setItem(LocalStorageTokenKey, '');
    setExpires(null);
    setUser(null);
  }, [setItem]);

  const cachedValues = useMemo(
    () => ({
      user,
      expires,
      login,
      logout,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, expires]
  );
  return <AuthContext.Provider value={cachedValues}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
