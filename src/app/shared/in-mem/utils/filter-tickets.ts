import { IncidentTicketFilter, IncidentTicketResponse } from '../api';
import { History, IncidentTicket } from '../tables/db-typings';
import { employees } from '../tables/employees';
import { historical } from '../tables/historical';
import { incidentTiceks } from '../tables/incident-tickets';
import { incidents } from '../tables/incidents';
import { ticketStatuses } from '../tables/ticket-statuses';

export function getIncidentTickets(
  idItTeam: number,
  filter?: IncidentTicketFilter
): IncidentTicketResponse[] {
  // retrieve tickets by their current IT team
  const tickets = incidentTiceks.filter(({ id_current_history }) => {
    return historical.find(({ id }) => id_current_history === id)?.id_current_it_team === idItTeam;
  });

  if (!filter) {
    return tickets.map(ticket => mapIncidentTicketToResponse(ticket));
  }

  return [];
}

function mapIncidentTicketToResponse(incidentTicket: IncidentTicket): IncidentTicketResponse {
  const { id, description, id_current_history, id_employee_owner, created_at, id_incident } =
    incidentTicket;

  const { id_assigned_employee, id_current_it_team, id_current_status } = historical.find(
    ({ id }) => id_current_history === id
  ) as History;
  return {
    id,
    description,
    status: ticketStatuses[id_current_status - 1],
    assigned_to: id_assigned_employee > 0 ? employees[id_assigned_employee - 1] : undefined,
    reported_by: employees[id_employee_owner - 1],
    created_at: created_at,
    id_it_team: id_current_it_team,
    incident: incidents[id_incident - 1],
  };
}
