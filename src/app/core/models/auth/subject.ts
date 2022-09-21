import { Module, Entity, Attribute } from '../index';

export interface Subject {
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

export interface Subject {
  id?: number;
  dni?: string;
  matricula?: number;
  Subjectname?: string;
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

export interface LoggedSubjects {
  event?: string;
  host_name?: string;
  ip_remote?: string;
  created_at?: Date;
}



export interface RolesAllowSubject {
  id?: string;
  name?: string;
}

export interface RolesAllowSubject {
  id?: string;
  name?: string;
}



export interface SubjectRole {
  id?: string;
  Subject_id?: string;
  role_id?: string;
}

export interface SubjectRole {
  id?: string;
  Subject_id?: string;
  role_id?: string;
}

export interface NewSubjectSecurityEntity {
  id?: string;
  Subject_id?: string;
  entity?: string;
}

export interface SubjectSecurityEntity {
  id?: string;
  entity?: Entity;
  attributes?: SubjectAttribute[];
}

export interface NewSubjectAttribute {
  id?: string;
  value?: string;
  enable?: boolean;
  attribute?: string;
  Subjects_security_entities_id?: string;
}

export interface SubjectAttribute {
  id?: string;
  value?: string;
  enable?: boolean;
  attribute?: Attribute;
}
