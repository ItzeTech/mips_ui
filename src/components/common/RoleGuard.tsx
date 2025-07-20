// components/common/RoleGuard.tsx
import React from 'react';
import { useRoleCheck, RoleCheckOptions } from '../../hooks/useRoleCheck';

interface RoleGuardProps extends RoleCheckOptions {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  fallback = null,
  showFallback = false,
  ...roleOptions
}) => {
  const { checkAccess } = useRoleCheck();
  const hasAccess = checkAccess(roleOptions);

  if (hasAccess) {
    return <>{children}</>;
  }

  return showFallback ? <>{fallback}</> : null;
};