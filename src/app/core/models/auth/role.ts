import { Attribute, Entity } from "../config/entity";

export interface Role {
  id?: string;
  name?: string;
  username?: string;
  description?: string;
  sessions_allowed?: number;
  date_disallowed?: DateDisallowed[];
  password_policy?: PasswordPolicy;
  roles_doc_types?: RolesDoctype[]; // Validar para Borrar
  role_elements?: any[];
  projects?: string[];
  process?: string[];
  security_entities?: SecurityEntity[];
  role_allow?: RoleAllowed[];
  see_all_users?: boolean;
  // token?: string;
  // is_new?: boolean;
  // is_update?: boolean;
}

export interface RolesDoctype {
  id?: string;
  doctype_id?: string;
  role_id?: string;
}

export interface DateDisallowed {
  id?: string;
  description: string;
  begins_at: Date;
  ends_at: Date;
  role_id: string;
}

export interface PasswordPolicy {
  id?: string;
  days_pass_valid?: number;
  max_length?: number;
  min_length?: number;
  store_pass_not_repeated?: number;
  failed_attempts?: number;
  time_unlock?: number;
  alpha?: number;
  digits?: number;
  special?: number;
  upper_case?: number;
  lower_case?: number;
  enable?: boolean;
  inactivity_time?: number;
  timeout?: number;
  role_id?: string;
}

export interface SecurityEntities {
  id?: string;
  role_id?: string;
  entity?: string; // Id Entidad
  name_entities?: string;
  role_attribute?: Attributes[];
}

export interface Attributes {
  id?: string;
  value?: string;
  // enable?: boolean;
  attribute?: string; // Id Atributo
  name_attribute?: string;
  roles_security_entities_id?: string;
}

export interface Elements {
  id?: string;
  role_id?: string;
  element_id?: string;
  name?: string;
}

export interface RoleAllowed {
  id?: string;
  role_id?: string;
  role_allow?: Role;
}

export interface SecurityEntity {
  id?: string;
  entity?: Entity;
  role_attribute?: RoleAttribute[];
}

export interface RoleAttribute {
  id?: string;
  value?: string;
  attribute?: Attribute;
}
