import { User } from '@core/authentication/interface';
import { Employee, Role } from './db-typings';

export const employees: Employee[] = [
  {
    id: 1,
    fullname: 'Rogelio Flores',
    email: 'rogelio.flores@example.com',
    id_role: 2,
    id_it_team: 1,
  },
  {
    id: 2,
    fullname: 'Angel Martines',
    email: 'angel.martines@example.com',
    id_role: 3,
    id_it_team: 1,
  },
  {
    id: 3,
    fullname: 'Carlos Bustamante',
    email: 'carlos.bustamante@example.com',
    id_role: 2,
    id_it_team: 2,
  },
  {
    id: 4,
    fullname: 'Miguel Pierola',
    email: 'miguel.pierola@example.com',
    id_role: 3,
    id_it_team: 2,
  },
  {
    id: 5,
    fullname: 'Facundo Gonzales',
    email: 'facundo.gonzales@example.com',
    id_role: 2,
    id_it_team: 3,
  },
  {
    id: 6,
    fullname: 'Juan Pérez',
    email: 'juan.perez@example.com',
    id_role: 3,
    id_it_team: 3,
  },
  {
    id: 7,
    fullname: 'Ricardo Gómez',
    email: 'ricardo.gomez@example.com',
    id_role: 2,
    id_it_team: 4,
  },
  {
    id: 8,
    fullname: 'Angela Rosario',
    email: 'angela.rosario@example.com',
    id_role: 3,
    id_it_team: 4,
  },
  {
    id: 9,
    fullname: 'Richard Stalmant',
    email: 'richard.stalmant@example.com',
    id_role: 1,
    id_it_team: 0,
  },
  {
    id: 10,
    fullname: 'Camila Sánchez',
    email: 'camila.sanchez@example.com',
    id_role: 1,
    id_it_team: 0,
  },
  {
    id: 11,
    fullname: 'Angel Pacheco',
    email: 'angelpacheco@example.com',
    id_role: 1,
    id_it_team: 0,
  },
  {
    id: 12,
    fullname: 'Carlos Cácerez',
    email: 'carloscacerez@example.com',
    id_role: 1,
    id_it_team: 0,
  },
  {
    id: 13,
    fullname: 'Mickey Dier',
    email: 'mickeydier@example.com',
    id_role: 1,
    id_it_team: 0,
  },
];

export const roles: Role[] = [
  {
    id: 1,
    name: 'NON-IT_EMPLOYEE',
  },
  {
    id: 2,
    name: 'IT_EMPLOYEE',
  },
  {
    id: 3,
    name: 'IT_TEAM_LEADER',
  },
];

export const users: User[] = employees.map((employee) => mapEmployeeToUser(employee));

function mapEmployeeToUser(employee: Employee): User {
  const { id, email, fullname, id_it_team, id_role } = employee;
  const username = id + "-" + fullname.split(' ')[0].toLocaleLowerCase();
  // console.log(username) diplock
  const role = roles[id_role - 1].name;
  return {
    id,
    username,
    password: username,
    email,
    role: role,
    id_it_team,
    permissions:
      role === 'IT_EMPLOYEE'
        ? ['canAdd', 'canEdit', 'canRead']
        : ['canAdd', 'canDelete', 'canEdit', 'canRead'],
    avatar: 'images/avatar.jpg',
  };
}
