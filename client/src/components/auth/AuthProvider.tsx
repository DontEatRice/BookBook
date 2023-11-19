import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../../utils/auth/AuthContext';
import { User } from '../../models/User';
import { getJwtBody, convertJwtToUser } from '../../utils/utils';
import { LocalStorageTokenKey } from '../../utils/constants';
import { refresh } from '../../api/auth';
import { useQuery } from '@tanstack/react-query';
import Loading from '../common/Loading';

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
  const [expires, setExpires] = useState<Date | null>(initExpires);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(initUser);

  const login = useCallback((token: string) => {
    const claims = getJwtBody(token);
    const expires = new Date(claims.exp * 1000);
    if (expires < new Date()) {
      return null;
    }
    localStorage.setItem(LocalStorageTokenKey, token);
    setExpires(new Date(claims.exp * 1000));
    const user = convertJwtToUser(token);
    setUser(user);
    return user;
  }, []);

  const handleTokenChange = useCallback(() => {
    const token = localStorage.getItem(LocalStorageTokenKey);
    console.log('handleTokenChange', { token });
    if (token) {
      login(token);
    }
  }, [login]);

  //odświeżenie wygasłego access tokenu
  const { refetch, data, isLoading, isError } = useQuery({
    queryFn: async () => {
      const response = await refresh();
      if (!response.ok) {
        throw new Error();
      }
      return (await response.json()) as { accessToken: string };
    },
    queryKey: ['auth/refresh'],
    enabled: false,
  });
  useEffect(() => {
    const token = localStorage.getItem(LocalStorageTokenKey);
    if (!token) {
      return;
    }
    if (expires && expires >= new Date()) {
      return;
    }
    setLoading(true);
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isError) {
      localStorage.setItem(LocalStorageTokenKey, '');
    }
    login(data!.accessToken);
    setLoading(false);
  }, [login, isError, data, isLoading]);

  useEffect(() => {
    window.addEventListener('storage', handleTokenChange);
    return () => window.removeEventListener('storage', handleTokenChange);
  }, [handleTokenChange]);

  const logout = useCallback(() => {
    localStorage.setItem(LocalStorageTokenKey, '');
    setExpires(null);
    setUser(null);
  }, []);

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
  return (
    <AuthContext.Provider value={cachedValues}>
      {loading && <Loading />}
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
