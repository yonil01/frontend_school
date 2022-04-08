export interface Token {
  id?: string;
  user?: string;
  document?: string;
  doctype?: string;
  autoname?: string;
  process?: string;
  process_name?: string;
  queue?: string;
  execution?: string;
  users_balance?: string[];
  input_message?: boolean;
  response?: string;
  time_estimated_process?: Date;
  time_estimated_queue?: AnsQueue;
  created_at?: Date;
}

export interface AnsQueue {
  queue?: string;
  ans?: Date;
}

export interface ExecuteToken {
  token?: string;
  document?: string;
  queue?: string;
  execution?: string;
  doctype?: string;
  process_id?: string;
  input_message?: boolean;
  response?: string;
}
