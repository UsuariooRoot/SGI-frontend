import { IncidentTicketFilter, IncidentTicketResponse } from '../api';
import { History, IncidentTicket } from '../tables/db-typings';
import { employees } from '../tables/employees';
import { historical } from '../tables/historical';
import { incidentTiceks } from '../tables/incident-tickets';
import { incidents } from '../tables/incidents';
import { ticketStatuses } from '../tables/ticket-statuses';

export function getIncidentTickets(
  filter?: IncidentTicketFilter
): IncidentTicketResponse[] {
  let tickets: IncidentTicket[] = incidentTiceks;

  if (filter) {
    tickets = tickets.filter(ticket => filterTicketByParameters(ticket, filter));
  }

  return tickets.map(ticket => mapIncidentTicketToResponse(ticket));
}

function filterTicketByParameters(ticket: IncidentTicket, filter: IncidentTicketFilter): boolean {
  let result = true;

  const { news, statuses, id_it_team, employee_owner, assigned_employee, from, to } = filter;
  const { created_at, id_current_history, id_employee_owner } = ticket;
  const currentHistory = historical.find(({ id }) => id === id_current_history);

  if (news) {
    const currentDate = new Date();
    const differenceInMs = Math.abs(currentDate.getMilliseconds() - currentDate.getMilliseconds());
    const twentyFourHoursInMs = 86400000;
    result = differenceInMs < twentyFourHoursInMs;
  } else {
    if (from) {
      result = created_at >= from;
    }

    if (to) {
      result = created_at <= to;
    }
  }

  if (employee_owner) {
    result = employee_owner === id_employee_owner;
  }

  if (statuses) {
    result = currentHistory ? statuses.includes(currentHistory.id_current_status) : false;
  }

  if (assigned_employee) {
    result = assigned_employee === currentHistory?.id_employee_action;
  }

  if (id_it_team) {
    result = id_it_team === currentHistory?.id_current_it_team;
  }

  return result;
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
