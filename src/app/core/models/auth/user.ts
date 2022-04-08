import { Module, Entity, Attribute } from '../index';

export interface User {
  id?: string;
  username?: string;
  name?: string;
  last_name?: string;
  password?: string;
  password_comfirm?: string;
  roles?: Roles[];
  logged_users?: LoggedUsers[];
  email_notifications?: string;
  status?: number;
  client_id?: number;
  real_ip?: string;
  host_name?: string;
  time_out?: number;
  failed_attempts?: number;
  last_change_password?: Date;
  block_date?: Date;
  disabled_date?: Date;
  change_password?: boolean;
  change_password_days_left?: number;
  last_login?: Date;
  modules?: Module[];
  token?: string;
  created_at?: string;
  updated_at?: string;
  identification_number?: string;
  identification_type?: string;
  security_entities?: UserSecurityEntity[];
  is_block?: boolean;
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

export interface RolesAllow {
  id?: string;
  name?: string;
}

export interface Roles {
  id?: string;
  name?: string;
  role_allow: RolesAllow;
}

export interface UserRole {
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
