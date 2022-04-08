export interface WorkerTx {
  id?: string;
  name?: string;
  document?: string;
  token?: string;
  process?: string;
  process_name?: string;
  queue?: string;
  execution?: string;
  rule?: string;
  description?: string;
  worker_id?: number;
  user?: number;
  response?: any;
}
