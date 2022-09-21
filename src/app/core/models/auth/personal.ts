import { Module, Entity, Attribute } from '../index';

export interface Personal {
  id?: number;
  dni?: string;
  matricula?: number;
  Personalname?: string;
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

export interface Personal {
  id?: number;
  dni?: string;
  matricula?: number;
  Personalname?: string;
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

export interface LoggedPersonals {
  event?: string;
  host_name?: string;
  ip_remote?: string;
  created_at?: Date;
}

export interface PasswordHistory {
  password?: string;
  created_at?: Date;
}

export interface RolesAllowPersonal {
  id?: string;
  name?: string;
}

export interface RolesAllowPersonal {
  id?: string;
  name?: string;
}

export interface Roles {
  id?: string;
  name?: string;
  role_allow: RolesAllowPersonal[];
}

export interface PersonalRole {
  id?: string;
  Personal_id?: string;
  role_id?: string;
}

export interface PersonalRole {
  id?: string;
  Personal_id?: string;
  role_id?: string;
}

export interface NewPersonalSecurityEntity {
  id?: string;
  Personal_id?: string;
  entity?: string;
}

export interface PersonalSecurityEntity {
  id?: string;
  entity?: Entity;
  attributes?: PersonalAttribute[];
}

export interface NewPersonalAttribute {
  id?: string;
  value?: string;
  enable?: boolean;
  attribute?: string;
  Personals_security_entities_id?: string;
}

export interface PersonalAttribute {
  id?: string;
  value?: string;
  enable?: boolean;
  attribute?: Attribute;
}
