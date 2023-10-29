import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../../utils/auth/AuthContext';
import { User } from '../../models/User';
import { useLocalStorage } from '../../utils/auth/useLocalStorage';
import { getJwtBody, convertJwtToUser } from '../../utils/utils';
import { LocalStorageTokenKey } from '../../utils/constants';

function AuthProvider({ children }: { children?: ReactNode }) {
  const [expires, setExpires] = useState<Date | null>(null);
  const { getItem, setItem, removeItem } = useLocalStorage();

  const init = () => {
    const token = localStorage.getItem(LocalStorageTokenKey);
    if (!token) {
      return null;
    }
    const claims = getJwtBody(token);
    const expires = new Date(claims.exp * 1000);
    if (expires < new Date()) {
      // removeItem(LocalStorageTokenKey);
      return null;
    }
    // setItem(LocalStorageTokenKey, token);
    // setExpires(new Date(claims.exp * 1000));
    return convertJwtToUser(token);
  };

  const [user, setUser] = useState<User | null>(init());

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
    if (token) {
      login(token);
    }
  }, [getItem, login]);

  useEffect(() => {
    handleTokenChange();
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
