export interface DocumentTx {
  id?: string;
  document?: string;
  doctype?: string;
  action?: string;
  description?: string;
  user?: string;
  attribute?: AttributeTx[];
}

export interface AttributeTx {
  name?: string;
  value?: any;
  is_cipher?: boolean;
}

export interface EntityTx {
  entity?: string;
  attributes?: AttributeTx[];
}
