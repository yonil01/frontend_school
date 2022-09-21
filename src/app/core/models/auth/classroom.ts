import { Module, Entity, Attribute } from '../index';

export interface Classroom {
  id?: number;
  dni?: string;
  matricula?: number;
  username?: string;
  names?: string;
  lastnames?: string;
  sexo?: string;
  status?: number;
  date_admission?: string;
  date_birth?: string;
  email?: string;
  is_delete?: number;
  password?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Classroom {
  id?: number;
  dni?: string;
  matricula?: number;
  Classroomname?: string;
  names?: string;
  lastnames?: string;
  sexo?: string;
  status?: number;
  date_admission?: string;
  date_birth?: string;
  email?: string;
  is_delete?: number;
  password?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoggedClassrooms {
  event?: string;
  host_name?: string;
  ip_remote?: string;
  created_at?: Date;
}



export interface RolesAllowClassroom {
  id?: string;
  name?: string;
}

export interface RolesAllowClassroom {
  id?: string;
  name?: string;
}



export interface ClassroomRole {
  id?: string;
  Classroom_id?: string;
  role_id?: string;
}

export interface ClassroomRole {
  id?: string;
  Classroom_id?: string;
  role_id?: string;
}

export interface NewClassroomSecurityEntity {
  id?: string;
  Classroom_id?: string;
  entity?: string;
}

export interface ClassroomSecurityEntity {
  id?: string;
  entity?: Entity;
  attributes?: ClassroomAttribute[];
}

export interface NewClassroomAttribute {
  id?: string;
  value?: string;
  enable?: boolean;
  attribute?: string;
  Classrooms_security_entities_id?: string;
}

export interface ClassroomAttribute {
  id?: string;
  value?: string;
  enable?: boolean;
  attribute?: Attribute;
}
