export interface BpmTx {
  id?: string;
  action?: string;
  description?: string;
  process?: string;
  process_name?: string;
  queue?: string;
  execution?: string;
  rule?: string;
  document_id_bpmn?: string;
  document_id_svg?: string;
  document_id_ans?: string;
  user?: string;
}
