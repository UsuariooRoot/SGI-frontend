import { TicketStatus } from './db-typings';

export const ticketStatuses: TicketStatus[] = [
  {
    id: 1,
    name: 'Pendiente',
  },
  {
    id: 2,
    name: 'Asignado',
  },
  {
    id: 3,
    name: 'Cancelado',
  },
  {
    id: 4,
    name: 'Atendido',
  },
  {
    id: 5,
    name: 'Emitido a SD',
  },
  {
    id: 6,
    name: 'Emitido a GAT',
  },
];
