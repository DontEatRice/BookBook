import { ReactNode, useMemo } from 'react';
import { useAuth } from '../../utils/auth/useAuth';

interface AuthorizedViewProps {
  children?: ReactNode;
  roles?: string[];
  notAuthorized?: ReactNode;
}

export default function AuthorizedView({ children, roles, notAuthorized }: AuthorizedViewProps) {
  const { user, expires } = useAuth();
  const alternative = useMemo(() => {
    return notAuthorized === undefined ? null : <>{children}</>;
  }, [children, notAuthorized]);

  if (user === null || (expires !== null && expires < new Date())) {
    return alternative;
  }
  if (roles !== undefined && roles.length > 0) {
    return roles.every((role) => user.roles.includes(role)) ? <>{children}</> : <>{alternative}</>;
  }
  return <>{children}</>;
}
