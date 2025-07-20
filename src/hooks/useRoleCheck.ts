// hooks/useRoleCheck.ts
import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { Role } from '../types/roles';

export interface RoleCheckOptions {
  allowedRoles?: Role[];
  deniedRoles?: Role[];
  requireAll?: boolean; // If true, user must have ALL roles, if false, user needs ANY role
}

export const useRoleCheck = () => {
  const { roles } = useAuth(); // Assuming this returns Role[]

  const hasRole = useMemo(() => {
    return (rolesToCheck: Role | Role[]) => {
      const rolesArray = Array.isArray(rolesToCheck) ? rolesToCheck : [rolesToCheck];
      return rolesArray.some(role => roles.includes(role));
    };
  }, [roles]);

  const hasAllRoles = useMemo(() => {
    return (rolesToCheck: Role[]) => {
      return rolesToCheck.every(role => roles.includes(role));
    };
  }, [roles]);

  const checkAccess = useMemo(() => {
    return (options: RoleCheckOptions): boolean => {
      const { allowedRoles = [], deniedRoles = [], requireAll = false } = options;

      // Check if user has any denied roles
      if (deniedRoles.length > 0 && hasRole(deniedRoles)) {
        return false;
      }

      // If no allowed roles specified, grant access (unless denied)
      if (allowedRoles.length === 0) {
        return true;
      }

      // Check allowed roles
      if (requireAll) {
        return hasAllRoles(allowedRoles);
      } else {
        return hasRole(allowedRoles);
      }
    };
  }, [hasRole, hasAllRoles]);

  const filterByRoles = useMemo(() => {
    return <T extends { allowedRoles?: Role[]; deniedRoles?: Role[]; requireAll?: boolean }>(
      items: T[]
    ): T[] => {
      return items.filter(item => 
        checkAccess({
          allowedRoles: item.allowedRoles,
          deniedRoles: item.deniedRoles,
          requireAll: item.requireAll
        })
      );
    };
  }, [checkAccess]);

  return {
    roles,
    hasRole,
    hasAllRoles,
    checkAccess,
    filterByRoles
  };
};