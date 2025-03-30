import { Employee, Incident, TicketStatus } from "./tables/db-typings";

export interface IncidentTicketResponse {
  id: number;
  description: string;
  status: TicketStatus;
  reported_by: Employee;
  assigned_to?: Employee;
  incident: Incident;
  id_it_team: number;
  created_at: Date;
}

export interface IncidentTicketFilter {
  news?: boolean;
  statuses?: number[];
  id_it_team?: number;
  assigned_employee?: number;
  employee_owner?: number;
  from?: Date;
  to?: Date;
}