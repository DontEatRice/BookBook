import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../../utils/auth/AuthContext';
import { User } from '../../models/User';
import { useLocalStorage } from '../../utils/auth/useLocalStorage';
import { getJwtBody, convertJwtToUser } from '../../utils/utils';

function AuthProvider({ children }: { children?: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [expires, setExpires] = useState<Date | null>(null);
  const { getItem, setItem } = useLocalStorage();

  const login = useCallback(
    (token: string) => {
      const claims = getJwtBody(token);
      setItem('token', token);
      setExpires(new Date(claims.exp * 1000));
      setUser(convertJwtToUser(token));
    },
    [setItem]
  );

  useEffect(() => {
    const token = getItem('token');
    if (token) {
      login(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = useCallback(() => {
    setItem('token', '');
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
