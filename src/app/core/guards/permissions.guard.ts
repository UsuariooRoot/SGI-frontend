import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';

export const permissionsGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const rolesService = inject(NgxRolesService);
  const router = inject(Router);

  // Get permissions data from the route
  const permissionsData = route.data['permissions'];

  if (!permissionsData) {
    return true; // No permissions required for this route
  }

  const onlyRoles = permissionsData.only || [];
  const redirectTo = permissionsData.redirectTo || '/auth/no-access';

  // Get user roles
  const userRoles = rolesService.getRoles();
  const userRoleNames = Object.keys(userRoles);

  // Check if the user has any of the required roles
  const requiredRoles = Array.isArray(onlyRoles) ? onlyRoles : [onlyRoles];

  // Verificar si alguno de los roles del usuario coincide con alguno de los roles requeridos
  let hasRequiredRole = false;
  for (const userRole of userRoleNames) {
    if (requiredRoles.includes(userRole)) {
      hasRequiredRole = true;
      break;
    }
  }

  return hasRequiredRole ? true : router.parseUrl(redirectTo);
};
