import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';

import { Token, User } from './interface';
import { Menu } from '@core/bootstrap/menu.service';
import { TokenService } from './token.service';
import { JwtToken } from './token';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  protected readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService)

  login(username: string, password: string, rememberMe = false) {
    return this.http.post<Token>('/api/auth/login', { username, password, rememberMe });
  }

  refresh(params: Record<string, any>) {
    return this.http.post<Token>('/api/auth/refresh', params);
  }

  logout() {
    return this.http.post<any>('/api/auth/logout', {});
  }

  user() {
    return of(this.getUserFromToken());
  }

  menu() {
    return this.http.get<{ menu: Menu[] }>('data/user/menu.json?_t=' + Date.now()).pipe(
      map(response => response.menu),
      catchError(() => of([]))
    );
  }

  getUserFromToken(): User | {} {
    const token = this.tokenService['token'];

    if (token instanceof JwtToken) {
      return token.getUserFromToken();
    }

    return {};
  }
}
