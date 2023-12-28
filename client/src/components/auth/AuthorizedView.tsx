import { ReactNode, useMemo } from 'react';
import { useAuth } from '../../utils/auth/useAuth';

interface AuthorizedViewProps {
  children?: ReactNode;
  roles?: string[];
  notAuthorized?: ReactNode;
}

export default function AuthorizedView({ children, roles, notAuthorized }: AuthorizedViewProps) {
  const { user } = useAuth();
  const alternative = useMemo(() => {
    return notAuthorized === undefined ? null : <>{children}</>;
  }, [children, notAuthorized]);

  if (user === null) {
    return alternative;
  }
  if (roles !== undefined && roles.length > 0) {
    return roles.some((role) => user.role === role) ? <>{children}</> : <>{alternative}</>;
  }
  return <>{children}</>;
}
