import { Injectable, inject } from '@angular/core';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { switchMap, take, tap } from 'rxjs';
import { Menu, MenuService } from './menu.service';
import { AuthService } from '@core/authentication/auth.service';
import { User } from '@core/authentication/interface';

@Injectable({
  providedIn: 'root',
})
export class StartupService {
  private readonly authService = inject(AuthService);
  private readonly menuService = inject(MenuService);
  private readonly permissonsService = inject(NgxPermissionsService);
  private readonly rolesService = inject(NgxRolesService);

  /**
   * Load the application only after get the menu or other essential informations
   * such as permissions and roles.
   */
  load() {
    return new Promise<void>((resolve, reject) => {
      this.authService
        .change()
        .pipe(
          tap(user => this.setPermissions(user)),
          switchMap(() => this.authService.menu()),
          tap(menu => this.setMenu(menu))
        )
        .subscribe({
          next: () => resolve(),
          error: () => resolve(),
        });
    });
  }

  private setMenu(menu: Menu[]) {
    this.menuService.addNamespace(menu, 'menu');
    this.menuService.set(menu);
  }

  private setPermissions(user: User) {
    // Clear previous roles and permissions
    this.permissonsService.flushPermissions();
    this.rolesService.flushRoles();

    // If the user has a role, assign it
    if (user && user.role) {
      // Assign the user's primary role
      this.rolesService.addRole(user.role, []);

      // Also load the specific permissions if they exist
      const permissions = user.permissions ?? [];
      if (permissions.length > 0) {
        this.permissonsService.loadPermissions(permissions);
      }
    }
  }
}
