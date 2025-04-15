import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { InMemoryDbService, RequestInfo, STATUS } from 'angular-in-memory-web-api';
import { from, Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { find, map, switchMap } from 'rxjs/operators';
import { JWT } from './jwt';
import { is } from './helpers/validate-path';
import { User } from '@core/authentication/interface';

const jwt = new JWT();

@Injectable({
  providedIn: 'root',
})
export class InMemDataService implements InMemoryDbService {
  private users: User[] = [
    {
      id: 1,
      username: 'ng-matero',
      password: 'ng-matero',
      name: 'Zongbin',
      email: 'nzb329@163.com',
      avatar: 'images/avatar.jpg',
    },
    {
      id: 2,
      username: 'recca0120',
      password: 'password',
      name: 'recca0120',
      email: 'recca0120@gmail.com',
      avatar: 'images/heros/10.jpg',
      refresh_token: true,
    },
    {
      id: 1,
      username: '1-rogelio',
      password: '1-rogelio',
      name: 'Rogelio Flores',
      email: 'rogelio.flores@example.com',
      role: 'IT_EMPLOYEE',
      permissions: ['canAdd', 'canDelete', 'canEdit', 'canRead'],
      avatar: 'images/avatar.jpg',
    }
  ];

  createDb(
    reqInfo?: RequestInfo
  ):
    | Record<string, unknown>
    | Observable<Record<string, unknown>>
    | Promise<Record<string, unknown>> {
    return { users: this.users };
  }

  // get requests to the same domain will be captured here
  get(reqInfo: RequestInfo) {
    const { headers, url } = reqInfo;

    // returns the contents of /public/menu.json
    if (is(reqInfo, 'user/menu')) {
      return ajax('data/api/user/menu/menu.json?_t=' + Date.now()).pipe(
        map((response: any) => {
          return { headers, url, status: STATUS.OK, body: { menu: response.response.menu } };
        }),
        switchMap(response => reqInfo.utils.createResponse$(() => response))
      );
    }

    if (is(reqInfo, 'user')) {
      const user = jwt.getUser(reqInfo.req as HttpRequest<any>);
      const result = user
        ? { status: STATUS.OK, body: user }
        : { status: STATUS.UNAUTHORIZED, body: {} };
      const response = Object.assign({ headers, url }, result);

      return reqInfo.utils.createResponse$(() => response);
    }

    return;
  }

  post(reqInfo: RequestInfo) {
    if (is(reqInfo, 'auth/login')) {
      return this.login(reqInfo);
    }

    if (is(reqInfo, 'auth/refresh')) {
      return this.refresh(reqInfo);
    }

    if (is(reqInfo, 'auth/logout')) {
      return this.logout(reqInfo);
    }

    return;
  }

  private login(reqInfo: RequestInfo) {
    const { headers, url } = reqInfo;
    const req = reqInfo.req as HttpRequest<any>;
    const { username, password } = req.body;

    return from(this.users).pipe(
      find(user => user.username === username || user.email === username),
      map(user => {
        if (!user || user.password !== password) {
          return {
            headers,
            url,
            status: STATUS.UNAUTHORIZED,
            error: { message: 'The username or password is incorrect...' },
          };
        }

        const currentUser = Object.assign({}, user);
        delete currentUser.password;
        return { headers, url, status: STATUS.OK, body: jwt.generate(currentUser) };
      }),
      switchMap(response => reqInfo.utils.createResponse$(() => response))
    );
  }

  private refresh(reqInfo: RequestInfo) {
    const { headers, url } = reqInfo;
    const user = jwt.getUser(reqInfo.req as HttpRequest<any>);
    const result = user
      ? { status: STATUS.OK, body: jwt.generate(user) }
      : { status: STATUS.UNAUTHORIZED, body: {} };
    const response = Object.assign({ headers, url }, result);

    return reqInfo.utils.createResponse$(() => response);
  }

  private logout(reqInfo: RequestInfo) {
    const { headers, url } = reqInfo;
    const response = { headers, url, status: STATUS.OK, body: {} };

    return reqInfo.utils.createResponse$(() => response);
  }
}
