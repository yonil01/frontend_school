import { Module, Entity, Attribute } from '../index';

export interface Payment {
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

export interface Payment {
  id?: number;
  dni?: string;
  matricula?: number;
  Paymentname?: string;
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

export interface LoggedPayments {
  event?: string;
  host_name?: string;
  ip_remote?: string;
  created_at?: Date;
}



export interface RolesAllowPayment {
  id?: string;
  name?: string;
}

export interface RolesAllowPayment {
  id?: string;
  name?: string;
}



export interface PaymentRole {
  id?: string;
  Payment_id?: string;
  role_id?: string;
}

export interface PaymentRole {
  id?: string;
  Payment_id?: string;
  role_id?: string;
}

export interface NewPaymentSecurityEntity {
  id?: string;
  Payment_id?: string;
  entity?: string;
}

export interface PaymentSecurityEntity {
  id?: string;
  entity?: Entity;
  attributes?: PaymentAttribute[];
}

export interface NewPaymentAttribute {
  id?: string;
  value?: string;
  enable?: boolean;
  attribute?: string;
  Payments_security_entities_id?: string;
}

export interface PaymentAttribute {
  id?: string;
  value?: string;
  enable?: boolean;
  attribute?: Attribute;
}
