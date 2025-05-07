export interface Role {
  id: number;
  name: string;
}

export interface ItTeam {
  id: number;
  name: string;
}

export interface Employee {
  id: number;
  name: string;
  paternalSurname: string;
  maternalSurname: string;
  email: string;
  role: ItTeam;
  itTeam: ItTeam;
}

export interface TicketStatus {
  id: number;
  name: string;
}

export interface TicketPriority {
  id: number;
  name: string;
}

export interface IncidentCategory {
  id: number;
  name: string;
  id_it_team: number;
}

export interface Incident {
  id: number;
  description: string;
  categoryId: number;
  priorityId: number;
}

export interface TicketAction {
  id: number;
  name: string;
}

export interface IncidentTicket {
  id: number;
  id_employee_creator: number;
  id_employee_owner: number;
  id_incident: number;
  description: string;
  id_current_history: number;
  created_at: Date;
}

export interface History {
  id: number;
  id_ticket: number;
  id_employee_action: number;
  id_assigned_employee: number;
  id_action: number;
  id_current_status: number;
  id_current_priority: number;
  id_current_it_team: number;
  comment: string;
  registered_at: Date;
}
