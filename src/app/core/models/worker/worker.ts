export interface Worker {
  id?: string;
  name?: string;
  rule?: string;
  document?: string;
  user?: string;
  response?: any;
  status?: number;
  updated_at?: Date;
}
