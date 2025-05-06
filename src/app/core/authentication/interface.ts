export interface User {
  [prop: string]: any;

  id?: number;
  name?: string;
  email?: string;
  avatar?: string;
  role?: string;
  id_it_team?: number;
  permissions?: any[];

  // Añadimos campos específicos para nuestra API
  employeeId?: number;
  itTeam?: number;
  authorities?: string;
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
  role: string;
  employeeId: number;
  authorities: string;
  itTeam: number;
  sub: string;
  iat: number;
  exp: number;
}
