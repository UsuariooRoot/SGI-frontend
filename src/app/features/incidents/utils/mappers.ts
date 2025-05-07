import { TicketRow } from '../components/incident-table/incident-table.component';
import { TicketResponse } from '../services/incident.service';

// diplock
export function mapIncidentTicketToRowTicket(ticket: TicketResponse): TicketRow {
  const { id, owner, description, incident, created, status, assignedEmployee } = ticket;
  const reported_by = `${owner.name} ${owner.paternalSurname} ${owner.maternalSurname}`;
  const assigned_to = assignedEmployee
    ? `${assignedEmployee.name} ${assignedEmployee.paternalSurname} ${assignedEmployee.maternalSurname}`
    : 'Sin asignar';

  return {
    id,
    title: incident.description,
    description: description,
    created_at: created.toLocaleString(),
    status: status.name,
    reported_by,
    assigned_to,
  };
}
