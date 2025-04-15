import { IncidentCategory, IncidentTicketResponse } from "../services/incident.service";

export const INCIDENT_TICKETS: IncidentTicketResponse[] = [
  {
    id: 1,
    description: "El monitor no enciende",
    status: { id: 1, name: "Abierto" },
    reported_by: {
      id: 101,
      fullname: "Juan Pérez",
      email: "juan.perez@empresa.com",
      id_role: 3,
      id_it_team: 2,
    },
    assigned_to: {
      id: 201,
      fullname: "Ana Gómez",
      email: "ana.gomez@empresa.com",
      id_role: 2,
      id_it_team: 2,
    },
    incident: {
      id: 301,
      name: "Falla de hardware",
      category_id: 10,
      priority_id: 2,
    },
    id_it_team: 2,
    created_at: new Date("2025-04-10T08:30:00Z"),
  },
  {
    id: 2,
    description: "No se puede acceder al correo electrónico",
    status: { id: 2, name: "En progreso" },
    reported_by: {
      id: 102,
      fullname: "Laura Martínez",
      email: "laura.martinez@empresa.com",
      id_role: 3,
      id_it_team: 1,
    },
    assigned_to: {
      id: 202,
      fullname: "Carlos Ruiz",
      email: "carlos.ruiz@empresa.com",
      id_role: 2,
      id_it_team: 1,
    },
    incident: {
      id: 302,
      name: "Problema de software",
      category_id: 11,
      priority_id: 3,
    },
    id_it_team: 1,
    created_at: new Date("2025-04-11T10:15:00Z"),
  },
  {
    id: 3,
    description: "La impresora no responde",
    status: { id: 3, name: "Resuelto" },
    reported_by: {
      id: 103,
      fullname: "Miguel Torres",
      email: "miguel.torres@empresa.com",
      id_role: 3,
      id_it_team: 3,
    },
    // No asignado aún
    assigned_to: undefined,
    incident: {
      id: 303,
      name: "Error de impresión",
      category_id: 12,
      priority_id: 1,
    },
    id_it_team: 3,
    created_at: new Date("2025-04-12T09:00:00Z"),
  },
];

export const INCIDENT_CATEGORIES: IncidentCategory[] = [
  {
    id: 1,
    name: "Hardware",
    id_it_team: 2,
    incidents: [
      {
        id: 301,
        name: "Falla de hardware",
        category_id: 1,
        priority_id: 2,
      },
      {
        id: 304,
        name: "Disco duro dañado",
        category_id: 1,
        priority_id: 1,
      },
    ],
  },
  {
    id: 2,
    name: "Software",
    id_it_team: 1,
    incidents: [
      {
        id: 302,
        name: "Problema de software",
        category_id: 2,
        priority_id: 3,
      },
      {
        id: 305,
        name: "Aplicación congelada",
        category_id: 2,
        priority_id: 2,
      },
    ],
  },
  {
    id: 3,
    name: "Periféricos",
    id_it_team: 3,
    incidents: [
      {
        id: 303,
        name: "Error de impresión",
        category_id: 3,
        priority_id: 1,
      },
      {
        id: 306,
        name: "Ratón no detectado",
        category_id: 3,
        priority_id: 1,
      },
    ],
  },
];
