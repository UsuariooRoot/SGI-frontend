export interface Role {
  id: number
  name: string
}

export interface ItTeam {
  id: number
  name: string
}

export interface Employee {
  id: number
  fullname: string
  email: string
  id_role: number
  id_it_team: number
}

export interface Status {
  id: number;
  name: string;
}

export interface Priority {
  id: number;
  name: string;
}

export interface Category {
  id: number
  name: string
  id_it_team: number
}

export interface Incident {
  id: number
  name: string
  category_id: number
  priority_id: number
}

