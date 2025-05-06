import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';

import { Token, User } from './interface';
import { Menu } from '@core/bootstrap/menu.service';
import { TokenService } from './token.service';
import { JwtToken, SimpleToken } from './token';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  protected readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService)

  login(username: string, password: string, rememberMe = false) {
    return this.http.post<Token>(this.buildUrl('/auth/login'), { username, password, rememberMe });
  }

  refresh(params: Record<string, any>) {
    return this.http.post<Token>('/auth/refresh', params);
  }

  logout() {
    return this.http.post<any>('/auth/logout', {});
  }

  user() {
    return of(this.getUserInfoFromToken());
  }

  menu() {
    return this.http.get<{ menu: Menu[] }>('data/api/user/menu/menu.json?_t=' + Date.now()).pipe(
      map(response => response.menu),
      catchError(() => of([]))
    );
  }

  buildUrl(endpoint: string) {
    return 'http://localhost:8080/api' + endpoint;
  }

  // Método para extraer información del usuario del JWT
  getUserInfoFromToken(): User | {} {
    const token = this.tokenService['token'];
    // console.log(token)
    console.log(token instanceof JwtToken) // false
    if (token instanceof JwtToken) {
      //nunca entra aquí
      return token.getUserFromToken();
    }
    return {};
  }
}
