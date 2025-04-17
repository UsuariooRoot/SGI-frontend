import { KnowledgeCard } from "../components/knowledge-card/knowledge-card.component";

export const MOCK_KNOWLEDGE_CARDS: KnowledgeCard[] = [
  {
    id: 1,
    titulo: 'Falla en despliegue de microservicio de autenticación',
    descripcion: 'Durante el despliegue en producción, el microservicio Auth fallaba al conectarse con el proveedor OAuth.',
    fecha: '2025-03-10',
    autor: 'Carlos Méndez – Backend',
    categoria: 'Infraestructura'
  },
  {
    id: 2,
    titulo: 'Pérdida de sincronización entre colas de Kafka',
    descripcion: 'Se detectó duplicación de eventos por configuración incorrecta de consumer groups al escalar horizontalmente.',
    fecha: '2025-02-25',
    autor: 'Andrea Ríos – DevOps',
    categoria: 'Mensajería / Event Driven'
  },
  {
    id: 3,
    titulo: 'Error de login en app móvil tras actualización',
    descripcion: 'Después de la actualización 3.4.1, usuarios en Android no podían iniciar sesión por conflicto de headers.',
    fecha: '2025-01-15',
    autor: 'Jorge Castillo – Mobile',
    categoria: 'Frontend / API'
  },
  {
    id: 4,
    titulo: 'Consultas lentas en base de datos MySQL',
    descripcion: 'El índice de la tabla "usuarios" estaba mal optimizado causando lentitud en reportes mensuales.',
    fecha: '2024-12-09',
    autor: 'Luisa Morales – Base de Datos',
    categoria: 'Base de datos'
  },
  {
    id: 5,
    titulo: 'Timeout en peticiones a servicio de terceros',
    descripcion: 'La API externa para validación de RUCs dejó de responder durante 2h. Se implementó un fallback local.',
    fecha: '2024-11-30',
    autor: 'Equipo de Integraciones',
    categoria: 'API externa'
  }
];
