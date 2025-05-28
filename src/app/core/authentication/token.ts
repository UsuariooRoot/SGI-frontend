import { base64, capitalize, currentTimestamp, timeLeft } from './helpers';
import { JwtPayload, Token, User } from './interface';

export abstract class BaseToken {
  constructor(protected attributes: Token) {}

  get access_token() {
    return this.attributes.access_token;
  }

  get refresh_token() {
    return this.attributes.refresh_token;
  }

  get token_type() {
    return this.attributes.token_type ?? 'bearer';
  }

  get exp() {
    return this.attributes.exp;
  }

  valid() {
    return this.hasAccessToken() && !this.isExpired();
  }

  getBearerToken() {
    return this.access_token
      ? [capitalize(this.token_type), this.access_token].join(' ').trim()
      : '';
  }

  needRefresh() {
    return this.exp !== undefined && this.exp >= 0;
  }

  getRefreshTime() {
    return timeLeft((this.exp ?? 0) - 5);
  }

  private hasAccessToken() {
    return !!this.access_token;
  }

  private isExpired() {
    return this.exp !== undefined && this.exp - currentTimestamp() <= 0;
  }
}

export class SimpleToken extends BaseToken {}

export class JwtToken extends SimpleToken {
  private _payload?: JwtPayload;

  static is(accessToken: string): boolean {
    try {
      const [_header] = accessToken.split('.');
      const header = JSON.parse(base64.decode(_header));

      return header.typ.toUpperCase().includes('JWT');
    } catch (e) {
      return false;
    }
  }

  get exp() {
    return this.payload?.exp;
  }

  get sub() {
    return this.payload?.sub;
  }

  get role() {
    return this.payload?.role;
  }

  get employeeId() {
    return this.payload?.employee_id;
  }

  get authorities() {
    return this.payload?.permissions;
  }

  get itTeam() {
    return this.payload?.id_it_team;
  }

  // Method for obtaining user information from the JWT
  getUserFromToken(): User | {} {
    if (!this.payload) {
      return {};
    }

    // ensure that the role is handled correctly
    let role = this.payload.role;

    // handle the case where permissions is a string (ROLE_XXX)
    let permissions: string[] = [];
    if (this.payload.permissions) {
      const permValue = this.payload.permissions;
      if (typeof permValue === 'string') {
        // If it is a string like "ROLE_LIDER_EQUIPO_TI", extract the actual role
        if (permValue.startsWith('ROLE_')) {
          const extractedRole = permValue.replace('ROLE_', '');
          permissions = [extractedRole];

          // If we don't have a role but we have a permission that indicates the role, use it
          if (!role && extractedRole) {
            role = extractedRole;
          }
        } else {
          permissions = [permValue];
        }
      } else if (Array.isArray(permValue)) {
        permissions = permValue;
      }
    }

    return {
      id: this.payload.employee_id,
      name: this.payload.sub,
      role: role,
      id_it_team: this.payload.id_it_team,
      permissions: permissions,
      employee_id: this.payload.employee_id,
    };
  }

  private get payload(): JwtPayload | undefined {
    if (!this.access_token) {
      return undefined;
    }

    if (this._payload) {
      return this._payload;
    }

    try {
      const [, payload] = this.access_token.split('.');
      const data = JSON.parse(base64.decode(payload));

      if (!data.exp) {
        data.exp = this.attributes.exp;
      }

      return (this._payload = data as JwtPayload);
    } catch (e) {
      console.error('Error al decodificar el JWT', e);
      return undefined;
    }
  }
}
