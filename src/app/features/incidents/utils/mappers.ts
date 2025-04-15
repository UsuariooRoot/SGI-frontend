import { TicketRow } from "../components/incident-table/incident-table.component";

// diplock
export function mapIncidentTicketToRowTicket(data: any): TicketRow {
  const { id, created_at, description, incident, reported_by, status, assigned_to } = data;

  return {
    id,
    title: incident.name,
    description,
    status: status.name,
    created_at: created_at.toString(),
    reported_by: reported_by.fullname,
    assigned_to: assigned_to?.fullname ?? '---',
  };
}
