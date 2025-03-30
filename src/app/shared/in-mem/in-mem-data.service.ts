import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { InMemoryDbService, RequestInfo, STATUS } from 'angular-in-memory-web-api';
import { from, Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { filter, find, map, switchMap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { JWT } from './jwt';
import { employees, users as usersdb } from './tables/employees';
import { historical } from './tables/historical';
import { categories } from './tables/incident-categories';
import { incidents } from './tables/incidents';
import { itTeams } from './tables/it-teams';
import { ticketActions } from './tables/ticket-actions';
import { ticketStatuses } from './tables/ticket-statuses';
import { ticketPriorities } from './tables/ticket-priorities';
import { Employee } from './tables/db-typings';
import { incidentTiceks } from './tables/incident-tickets';
import { getIncidentTickets } from './helpers/get-incident-tickets';
import { IncidentTicketFilter } from './api';

const jwt = new JWT();

function is(reqInfo: RequestInfo, path: string) {
  if (environment.baseUrl) {
    return false;
  }

  return new RegExp(`${path}(/)?$`, 'i').test(reqInfo.req.url);
}

@Injectable({
  providedIn: 'root',
})
export class InMemDataService implements InMemoryDbService {
  // Users are added here
  private users = usersdb;
  private employeesDb = employees;
  private historicalDb = historical;
  private incidentCategoriesDb = categories;
  private incidentsDb = incidents;
  private incidentTicketsDb = incidentTiceks;
  private itTeams = itTeams;
  private ticketActionsDb = ticketActions;
  private ticketPrioritiesDb = ticketPriorities;
  private ticketStatusesDb = ticketStatuses;

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

    if (is(reqInfo, 'api/incidents')) {
      const incidents = this.incidentCategoriesDb.map(category => {
        return {
          ...category,
          incidents: this.incidentsDb.filter(({ category_id }) => category_id === category.id),
        };
      });
      const result = { status: STATUS.OK, body: { data: incidents } };
      const response = Object.assign({ headers, url }, result);

      return reqInfo.utils.createResponse$(() => response);
    }

    if (is(reqInfo, 'api/tickets/statuses')) {
      const result = { status: STATUS.OK, body: { data: this.ticketStatusesDb } };
      const response = Object.assign({ headers, url }, result);

      return reqInfo.utils.createResponse$(() => response);
    }

    if (is(reqInfo, 'api/employees')) {
      const [idItTeam] = reqInfo.query.get('id_it_team') ?? ['0'];
      const response: any = { headers, url, status: STATUS.OK };

      if (idItTeam === '0') {
        response.body = { data: this.employeesDb };
        return reqInfo.utils.createResponse$(() => response);
      }

      const filterEmployees = this.employeesDb.filter(({ id_it_team }) => id_it_team === +idItTeam);
      response.body = { data: filterEmployees };

      return reqInfo.utils.createResponse$(() => response);
    }

    if (is(reqInfo, 'api/requesters')) {
      const [idItTeam] = reqInfo.query.get('id_it_team') ?? ['0'];
      const response: any = { headers, url, status: STATUS.OK };

      if (idItTeam === '0') {
        response.body = { data: this.employeesDb.filter(({ id_it_team }) => !id_it_team) };
        return reqInfo.utils.createResponse$(() => response);
      }

      const filterEmployees: Set<Employee> = new Set();

      const filterTickets = this.incidentTicketsDb.filter(({ id_current_history }) => {
        return (
          this.historicalDb.find(({ id }) => id_current_history === id)?.id_current_it_team ===
          +idItTeam
        );
      });

      filterTickets.forEach(({ id_employee_owner }) => {
        const emp = this.employeesDb.find(({ id }) => id === id_employee_owner);
        if (emp) filterEmployees.add(emp);
      });

      response.body = { data: Array.from(filterEmployees) };

      return reqInfo.utils.createResponse$(() => response);
    }

    if (is(reqInfo, 'api/tickets/incidents')) {
      const { query } = reqInfo;
      const response: any = { headers, url, status: STATUS.OK };
      response.body = { data: [] };

      if (query.size > 0) {
        const filter: any = {};

        query.forEach((value, key) => {
          if (key === 'statuses') {
            filter[key] = value.map(v => +v);
          }
          filter[key] = value[0];
        });

        const { news, id_it_team, statuses, employee_owner, assigned_employee, from, to } = filter;
        const filterParams: IncidentTicketFilter = {
          news: news ? news === 'true' : undefined,
          id_it_team: id_it_team ? Number(id_it_team) : undefined,
          statuses: statuses ? statuses.map((v: string) => Number(v)) : undefined,
          employee_owner: employee_owner ? Number(employee_owner) : undefined,
          assigned_employee: assigned_employee ? Number(assigned_employee) : undefined,
          from: from ? new Date(from) : undefined,
          to: to ? new Date(to) : undefined,
        };

        response.body = { data: getIncidentTickets(filterParams) };
      }

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
