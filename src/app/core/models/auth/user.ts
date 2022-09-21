import { Module, Entity, Attribute } from '../index';

export interface User {
  id?: number;
  dni?: string;
  matricula?: number;
  username?: string;
  names?: string;
  lastnames?: string;
  sexo?: string;
  status?: number;
  role?: number;
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

export interface LoggedUsers {
  event?: string;
  host_name?: string;
  ip_remote?: string;
  created_at?: Date;
}

export interface PasswordHistory {
  password?: string;
  created_at?: Date;
}

export interface RolesAllowUser {
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
  role_allow: RolesAllowUser[];
}

export interface UserRole {
  id?: string;
  user_id?: string;
  role_id?: string;
}

export interface PersonalRole {
  id?: string;
  user_id?: string;
  role_id?: string;
}

export interface NewUserSecurityEntity {
  id?: string;
  user_id?: string;
  entity?: string;
}

export interface UserSecurityEntity {
  id?: string;
  entity?: Entity;
  attributes?: UserAttribute[];
}

export interface NewUserAttribute {
  id?: string;
  value?: string;
  enable?: boolean;
  attribute?: string;
  users_security_entities_id?: string;
}

export interface UserAttribute {
  id?: string;
  value?: string;
  enable?: boolean;
  attribute?: Attribute;
}


