import { ReactNode } from 'react';
import { useAuth } from '../../utils/auth/useAuth';

interface NotAuthorizedViewProps {
  children?: ReactNode;
  roles?: string[];
}

export default function NotAuthorizedView({ children, roles }: NotAuthorizedViewProps) {
  const { user, expires } = useAuth();

  if (user === null || (expires !== null && expires > new Date())) {
    return children;
  }
  if (roles !== undefined && roles.length > 0) {
    return roles.every((role) => user.roles.includes(role)) ? null : children;
  }
  return null;
}
