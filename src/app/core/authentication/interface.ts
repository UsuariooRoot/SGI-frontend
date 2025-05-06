export interface User {
  [prop: string]: any;

  id?: number;
  name?: string;
  role?: string;
  id_it_team?: number;
  permissions?: any[];
  employee_id?: number;
  // email?: string;
  // avatar?: string;
  // itTeam?: number;
}

export interface Token {
  [prop: string]: any;

  access_token: string;
  token_type?: string;
  expires_in?: number;
  exp?: number;
  refresh_token?: string;
}

// Interfaz para extraer la información del payload JWT
export interface JwtPayload {
  id: number;
  role: string;
  employee_id: number;
  permissions: string[];
  id_it_team: number;
  sub: string;
  iat: number;
  exp: number;
}
