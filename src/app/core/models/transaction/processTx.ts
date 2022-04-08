export interface ProcessTx {
  id?: string;
  token?: string;
  event?: string;
  doc_type?: string;
  document?: string;
  user?: string;
  description?: string;
  process_id?: string;
  process?: string;
  queue?: string;
  execution?: string;
  time_exceeded?: number;
  end_estimated_process_at?: Date;
  end_estimated_queue_at?: Date;
  begin_at?: Date;
  end_at?: Date;
}
