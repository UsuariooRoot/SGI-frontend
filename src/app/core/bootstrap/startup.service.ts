import { Injectable, inject } from '@angular/core';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { switchMap, tap } from 'rxjs';
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
    const permissions = user.permissions ?? [];
    this.permissonsService.loadPermissions(permissions); // load user-specific permissions
    this.rolesService.flushRoles(); // removes all roles registered in NgxPermissionsService -> https://github.com/AlexKhymenko/ngx-permissions?tab=readme-ov-file#removing-roles
    this.rolesService.addRole(user.role ? user.role : 'GUEST', []) // add a role with its own permissions
  }
}
