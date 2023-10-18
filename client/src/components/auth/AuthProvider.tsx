import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../../utils/auth/AuthContext';
import { User } from '../../models/User';
import { useLocalStorage } from '../../utils/auth/useLocalStorage';
import { getJwtBody, convertJwtToUser } from '../../utils/utils';
import { LocalStorageTokenKey } from '../../utils/constants';

function AuthProvider({ children }: { children?: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [expires, setExpires] = useState<Date | null>(null);
  const { getItem, setItem } = useLocalStorage();

  const login = useCallback(
    (token: string) => {
      const claims = getJwtBody(token);
      setItem(LocalStorageTokenKey, token);
      setExpires(new Date(claims.exp * 1000));
      setUser(convertJwtToUser(token));
    },
    [setItem]
  );

  const handleTokenChange = useCallback(() => {
    const token = getItem(LocalStorageTokenKey);
    if (token) {
      login(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) 

  useEffect(() => {
    handleTokenChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleTokenChange]);

  useEffect(() => {
    window.addEventListener('storage', handleTokenChange);
    return () => window.removeEventListener('storage', handleStorage());
  }, []);

  const logout = useCallback(() => {
    setItem(LocalStorageTokenKey, '');
    setExpires(null);
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
