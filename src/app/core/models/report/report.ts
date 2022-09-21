export interface Report {
  autoname: string;
  class: string;
  code: number;
  doctypes_entities: DocTypesEntities[];
  format: string;
  id: string;
  name: string;
  procedure: string;
  retencion_ac: number;
  retencion_ag: number;
  retencion_electronic: number;
  storage_id: string;
  tipo_soporte: string;
  url_path: string;
}


export interface DocTypesEntities {
  id: string;
  entities: Entity;
}

export interface Entity {
  attributes: Attribute[];
  id: string;
  is_unique: boolean;
  name: string;
}

export interface Attribute {
  dataset: boolean;
  description: string;
  disabled: boolean;
  entities_attributes_dataset: any;
  entities_id: string;
  field_types: string;
  hidden: boolean;
  id: string;
  is_cipher: boolean;
  is_index: boolean;
  mask: string;
  max_length:number;
  min_length: number;
  name: string;
  required: boolean;
  sequence: number;
  tag_html: string;
  type: string;
  validation: string;
}
