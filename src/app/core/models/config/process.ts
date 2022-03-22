import {Attribute, DocTypes, Role} from "@app/core/models";

export interface Process {
  id?: string;
  name?: string;
  description?: string;
  process_root?: string;
  class?: string;
  ans?: number;
  percent_alert?: number;
  type_process?: number;
  status?: number;
  project?: any;
  document_id_bpmn?: string;
  document_id_svg?: string;
  document_id_ans?: string;
  version?: number;
  is_locked?: boolean;
  locked_info?: string;
  is_published?: boolean;
  user_deletes?: boolean;
  process_roles?: ProcessRole[];
  process_doctypes?: ProcessDoctype[];
  doc_types?: string[];
  processes_related?: string[];
  roles?: string[];
  queues?: Queue[];
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export interface Queue {
  id?: string;
  process_id?: string;
  name?: string;
  sequences?: number;
  balance_type?: number;
  type?: number;
  class?: string;
  ans?: number;
  percent_alert?: number;
  status?: number;
  id_bpmn_element?: string;
  roles?: string[];
  entities?: string[];
  executions?: Execution[];
  must_confirm_comment?: boolean;
  comments?: QueueComment[];
  description?: string;
  queue_attributes?: QueueAttribute[];
  queue_roles?: any[];
}

export class Execution {
  id?: string;
  queue_id?: string;
  name?: string;
  type?: number;
  timer?: number | Timer;
  class?: string;
  description?: string;
  execution_roles?: ExecutionRole[];
  rules?: Rule[];
}

export class Timer {
  name?: string;
  frequency?: number;
  day_of_week?: string;
  day_of_month?: string;
  begin_at?: string;
  end_at?: string;
  enabled?: boolean;
  is_not_running?: boolean;
  last_execution?: Date;
  constructor(
    name: string,
    freq: number,
    dayWeek: string,
    dayMonth: string,
    beginAt: string,
    endAt: string,
    enable: boolean,
  ) {
    this.name = name;
    this.frequency = freq;
    this.day_of_week = dayWeek;
    this.day_of_month = dayMonth;
    this.begin_at = beginAt;
    this.end_at = endAt;
    this.enabled = enable;
  }
}

export interface Rule {
  id?: string;
  code?: number;
  name?: string;
  status?: boolean;
  first?: number;
  child_true?: number;
  child_false?: number;
  action?: string;
  itemtype_id?: number;
  execution_id?: string;
  description?: string;
  params?: Param[];
  rule_params?: any[];
}

export interface Param {
  id?: string;
  rule_id?: string;
  name?: string;
  value?: string;
}

export interface ProcessRole {
  id?: string;
  process_id?: string;
  role_id?: string;
  role?: Role;
}

export interface ProcessDoctype {
  id?: string;
  process_id?: string;
  doctype_id?: string;
  doctype?: DocTypes;
}

export interface QueueComment {
  id?: string;
  queue_id?: string;
  comment?: string;
}

export interface QueueRole {
  id?: string;
  queue_id?: string;
  role_id?: string;
  role?: Role;
}

export interface QueueAttribute {
  id?: string;
  queue_id?: string;
  attribute_id?: string;
  attribute?: Attribute;
}

export interface ExecutionRole {
  id?: string;
  execution_id?: string;
  role_id?: string;
  role?: Role;
}

export interface StepModel {
  id: number;
  name: string;
  active: boolean;
}

export interface RolesDisplay {
  role: Role;
  active: boolean;
}
